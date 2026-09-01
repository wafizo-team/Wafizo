import { http, HttpResponse } from 'msw';
import {
  ReviewStatus,
  ReplyStatus,
  ReplyOrigin,
  Plan,
  SubscriptionStatus,
  BusinessConnectionStatus,
  ApiErrorCode,
} from '@wafizo/shared';
import type {
  Review,
  MeResponse,
  NotificationPreferences,
  UpdateReviewRequest,
  ApiError,
  HealthResponse,
} from '@wafizo/shared';

import { mockReviews } from '@/lib/fixtures/reviews';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3333';

// Passe à true quand tu attaques W2 (client API + refresh token) pour simuler
// les 401 (UNAUTHENTICATED / TOKEN_EXPIRED) sur les routes protégées.
// Reste à false pour continuer à dev les pages sans se soucier de l'auth.
const SIMULATE_AUTH = false;

// État en mémoire, mutable pendant la session de dev (persiste entre les requêtes, pas entre les reloads)
const reviews: Review[] = [...mockReviews];

// Pour tester W6 : mets 'NOT_CONNECTED' ici pour voir l'onboarding au chargement,
// ou 'CONNECTED' pour voir le dashboard directement.
let businessConnectionStatus: BusinessConnectionStatus = BusinessConnectionStatus.CONNECTED;

let notificationPreferences: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: false,
  phoneNumber: null,
  minRatingAlert: 3,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apiError(
  statusCode: number,
  error: ApiErrorCode,
  message: string,
  details?: ApiError['details'],
) {
  const body: ApiError = { statusCode, error, message, ...(details ? { details } : {}) };
  return HttpResponse.json(body, { status: statusCode });
}

// À activer avec SIMULATE_AUTH. Convention de test :
//   Authorization absent           -> 401 UNAUTHENTICATED
//   Authorization: Bearer expired  -> 401 TOKEN_EXPIRED
//   tout le reste                  -> ok
function checkAuth(request: Request) {
  if (!SIMULATE_AUTH) return null;

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return apiError(401, ApiErrorCode.UNAUTHENTICATED, 'Authentification requise');
  }
  if (authHeader === 'Bearer expired') {
    return apiError(401, ApiErrorCode.TOKEN_EXPIRED, 'Le token a expiré');
  }
  return null;
}

export const handlers = [
  // GET /health
  http.get(`${API_URL}/health`, () => {
    const response: HealthResponse = { status: 'ok', timestamp: new Date().toISOString() };
    return HttpResponse.json(response);
  }),

  // POST /auth/refresh
  // Aligné sur client.ts qui envoie { refreshToken } dans le body (et non un header).
  // ⚠️ Choix à valider avec le back : un refresh token lisible en JS (localStorage + body)
  // est moins sûr qu'un cookie httpOnly envoyé automatiquement par le navigateur.
  // Convention de test (avec SIMULATE_AUTH = true) : refreshToken === 'invalid-refresh' -> 401 REFRESH_INVALID
  http.post(`${API_URL}/auth/refresh`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { refreshToken?: string };

    if (SIMULATE_AUTH && body.refreshToken === 'invalid-refresh') {
      return apiError(401, ApiErrorCode.REFRESH_INVALID, 'Refresh token invalide');
    }

    await delay(300);
    return HttpResponse.json({ accessToken: 'mock-access-token', expiresIn: 3600 });
  }),

  // GET /auth/me — simule une session déjà connectée, pour débloquer W5/W6 sans OAuth réel
  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const response: MeResponse = {
      user: {
        id: 'u1',
        email: 'commercant@exemple.fr',
        name: 'Commerçant Test',
        avatarUrl: null,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      business: {
        id: 'b1',
        name: 'Mon Commerce',
        address: '12 rue de la République, Lille',
        googleLocationId:
          businessConnectionStatus === BusinessConnectionStatus.CONNECTED ? 'gloc-123' : null,
        connectionStatus: businessConnectionStatus,
        lastSyncAt:
          businessConnectionStatus === BusinessConnectionStatus.CONNECTED
            ? '2026-08-10T09:00:00.000Z'
            : null,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      subscription: {
        plan: Plan.FREE,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    };
    return HttpResponse.json(response);
  }),

  // POST /business/connect-google — simule la connexion de la fiche (W6)
  // ⚠️ Endpoint absent de packages/shared/dto.ts — à faire ajouter au contrat par le back
  // (ou vérifier qu'il existe sous un autre nom) avant de considérer W6 "prêt".
  http.post(`${API_URL}/business/connect-google`, async () => {
    await delay(700);
    businessConnectionStatus = BusinessConnectionStatus.CONNECTED;
    return HttpResponse.json({ connectionStatus: businessConnectionStatus });
  }),

  // GET /me/notification-preferences (B13/W13)
  http.get(`${API_URL}/me/notification-preferences`, ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;
    return HttpResponse.json(notificationPreferences);
  }),

  // PUT /me/notification-preferences (B13/W13)
  http.put(`${API_URL}/me/notification-preferences`, async ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const body = (await request.json()) as NotificationPreferences;

    // Validation E.164 basique, cohérente avec le contrat (B13)
    if (body.smsEnabled && body.phoneNumber && !/^\+[1-9]\d{1,14}$/.test(body.phoneNumber)) {
      return apiError(400, ApiErrorCode.VALIDATION_ERROR, 'Numéro de téléphone invalide', [
        { field: 'phoneNumber', message: 'Format E.164 attendu, ex: +33612345678' },
      ]);
    }

    await delay(400);
    notificationPreferences = body;
    return HttpResponse.json(notificationPreferences);
  }),

  // GET /reviews — pagination + filtres (status, rating, hasReply, search) + tri, conformes au contrat
  http.get(`${API_URL}/reviews`, ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const statusParams = url.searchParams.getAll('status');
    const ratingParams = url.searchParams
      .getAll('rating')
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    const hasReplyParam = url.searchParams.get('hasReply');
    const search = url.searchParams.get('search')?.toLowerCase();
    const sort = url.searchParams.get('sort') ?? 'publishedAt:desc';

    let result = [...reviews];

    if (statusParams.length > 0) {
      result = result.filter((r) => statusParams.includes(r.status));
    }

    if (ratingParams.length > 0) {
      result = result.filter((r) => ratingParams.includes(r.rating));
    }

    if (hasReplyParam !== null) {
      const hasReply = hasReplyParam === 'true';
      result = result.filter((r) => (r.reply !== null) === hasReply);
    }

    if (search) {
      result = result.filter(
        (r) =>
          r.authorName.toLowerCase().includes(search) || r.comment?.toLowerCase().includes(search),
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'publishedAt:asc':
          return a.publishedAt.localeCompare(b.publishedAt);
        case 'rating:asc':
          return a.rating - b.rating;
        case 'rating:desc':
          return b.rating - a.rating;
        default:
          return b.publishedAt.localeCompare(a.publishedAt);
      }
    });

    const totalItems = result.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const paginated = result.slice((page - 1) * limit, page * limit);

    return HttpResponse.json({
      data: paginated,
      meta: { page, limit, totalItems, totalPages },
    });
  }),

  // GET /reviews/:id
  http.get(`${API_URL}/reviews/:id`, ({ params, request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const review = reviews.find((r) => r.id === params.id);
    if (!review) {
      return apiError(404, ApiErrorCode.NOT_FOUND, 'Avis introuvable');
    }
    return HttpResponse.json(review);
  }),

  // PATCH /reviews/:id — statut NEW/IGNORED uniquement (contrat : UpdateReviewRequest)
  http.patch(`${API_URL}/reviews/:id`, async ({ params, request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const body = (await request.json()) as UpdateReviewRequest;
    const index = reviews.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return apiError(404, ApiErrorCode.NOT_FOUND, 'Avis introuvable');
    }

    reviews[index] = { ...reviews[index], status: body.status };
    return HttpResponse.json(reviews[index]);
  }),

  // POST /reviews/:id/reply/generate
  // ⚠️ Le contrat définit GenerateReplyRequest mais pas de type de réponse dédié.
  // On renvoie { content: string } par choix — à confirmer avec l'équipe / ajouter au contrat
  // pour que W2 sache exactement à quoi s'attendre.
  http.post(`${API_URL}/reviews/:id/reply/generate`, async ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    await delay(800);
    const templates = [
      'Merci beaucoup pour votre retour, ça nous fait vraiment plaisir !',
      "Nous sommes désolés que votre expérience n'ait pas été à la hauteur.",
      'Merci pour ce message, à très bientôt chez nous !',
    ];
    return HttpResponse.json({
      content: templates[Math.floor(Math.random() * templates.length)],
    });
  }),

  // POST /reviews/:id/reply/publish
  http.post(`${API_URL}/reviews/:id/reply/publish`, async ({ params, request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const body = (await request.json()) as { content: string };
    const index = reviews.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return apiError(404, ApiErrorCode.NOT_FOUND, 'Avis introuvable');
    }

    const reply = {
      id: `reply-${String(params.id)}`,
      reviewId: params.id as string,
      content: body.content,
      status: ReplyStatus.PUBLISHED,
      origin: ReplyOrigin.AI,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reviews[index] = { ...reviews[index], status: ReviewStatus.REPLIED, reply };

    return HttpResponse.json({ reply, jobId: `job-${Date.now()}` });
  }),
];
