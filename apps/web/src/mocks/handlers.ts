import { http, HttpResponse } from 'msw';
import { ReviewStatus, ReplyStatus, ReplyOrigin, Plan, SubscriptionStatus, BusinessConnectionStatus } from '@wafizo/shared';
import type { Review, MeResponse, NotificationPreferences } from '@wafizo/shared';

import { mockReviews } from '@/lib/fixtures/reviews';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

// État en mémoire, mutable pendant la session de dev (persiste entre les requêtes, pas entre les reloads)
let reviews: Review[] = [...mockReviews];

// Pour tester W6 : mets 'NOT_CONNECTED' ici pour voir l'onboarding au chargement,
// ou 'CONNECTED' pour voir le dashboard directement.
let businessConnectionStatus: BusinessConnectionStatus = BusinessConnectionStatus.CONNECTED;

let notificationPreferences: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: false,
  phoneNumber: null,
  minRatingAlert: 3,
};

export const handlers = [
  // GET /auth/me — simule une session déjà connectée, pour débloquer W5/W6 sans OAuth réel
  http.get(`${API_URL}/auth/me`, () => {
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
        googleLocationId: businessConnectionStatus === BusinessConnectionStatus.CONNECTED ? 'gloc-123' : null,
        connectionStatus: businessConnectionStatus,
        lastSyncAt: businessConnectionStatus === BusinessConnectionStatus.CONNECTED ? '2026-08-10T09:00:00.000Z' : null,
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
  http.post(`${API_URL}/business/connect-google`, async () => {
    await delay(700);
    businessConnectionStatus = BusinessConnectionStatus.CONNECTED;
    return HttpResponse.json({ connectionStatus: businessConnectionStatus });
  }),

  // GET /me/notification-preferences (B13/W13)
  http.get(`${API_URL}/me/notification-preferences`, () => {
    return HttpResponse.json(notificationPreferences);
  }),

  // PUT /me/notification-preferences (B13/W13)
  http.put(`${API_URL}/me/notification-preferences`, async ({ request }) => {
    const body = (await request.json()) as NotificationPreferences;

    // Validation E.164 basique, cohérente avec le contrat (B13)
    if (body.smsEnabled && body.phoneNumber && !/^\+[1-9]\d{1,14}$/.test(body.phoneNumber)) {
      return HttpResponse.json(
        {
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: 'Numéro de téléphone invalide',
          details: [{ field: 'phoneNumber', message: 'Format E.164 attendu, ex: +33612345678' }],
        },
        { status: 400 },
      );
    }

    await delay(400);
    notificationPreferences = body;
    return HttpResponse.json(notificationPreferences);
  }),

  // GET /reviews — pagination + filtres + tri, conformes au contrat
  http.get(`${API_URL}/reviews`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const statusParams = url.searchParams.getAll('status');
    const search = url.searchParams.get('search')?.toLowerCase();
    const sort = url.searchParams.get('sort') ?? 'publishedAt:desc';

    let result = [...reviews];

    if (statusParams.length > 0) {
      result = result.filter((r) => statusParams.includes(r.status));
    }

    if (search) {
      result = result.filter(
        (r) =>
          r.authorName.toLowerCase().includes(search) ||
          r.comment?.toLowerCase().includes(search),
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
  http.get(`${API_URL}/reviews/:id`, ({ params }) => {
    const review = reviews.find((r) => r.id === params.id);
    if (!review) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', message: 'Avis introuvable' },
        { status: 404 },
      );
    }
    return HttpResponse.json(review);
  }),

  // PATCH /reviews/:id — statut NEW/IGNORED uniquement (contrat)
  http.patch(`${API_URL}/reviews/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { status: ReviewStatus };
    const index = reviews.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', message: 'Avis introuvable' },
        { status: 404 },
      );
    }

    reviews[index] = { ...reviews[index], status: body.status };
    return HttpResponse.json(reviews[index]);
  }),

  // POST /reviews/:id/reply/generate
  http.post(`${API_URL}/reviews/:id/reply/generate`, async () => {
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
    const body = (await request.json()) as { content: string };
    const index = reviews.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', message: 'Avis introuvable' },
        { status: 404 },
      );
    }

    const reply = {
      id: `reply-${params.id}`,
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
