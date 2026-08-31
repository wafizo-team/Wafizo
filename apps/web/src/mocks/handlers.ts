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

const SIMULATE_AUTH = false;

const reviews: Review[] = [...mockReviews];

let businessConnectionStatus: BusinessConnectionStatus = BusinessConnectionStatus.CONNECTED;

let currentPlan: Plan = Plan.FREE;

let notificationPreferences: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: false,
  phoneNumber: null,
  minRatingAlert: 3,
};

function delay(ms: number) {
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

function fakeQrSvg(seed: string): string {
  const size = 10;
  const cells: string[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      hash = (hash * 1103515245 + 12345) >>> 0;
      if (hash % 2 === 0) {
        cells.push(`<rect x="${x * 10}" y="${y * 10}" width="10" height="10" fill="black" />`);
      }
    }
  }
  return `<svg viewBox="0 0 ${size * 10} ${size * 10}" xmlns="http://www.w3.org/2000/svg">${cells.join('')}</svg>`;
}

export const handlers = [
  http.get(`${API_URL}/health`, () => {
    const response: HealthResponse = { status: 'ok', timestamp: new Date().toISOString() };
    return HttpResponse.json(response);
  }),

  http.post(`${API_URL}/auth/refresh`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { refreshToken?: string };

    if (SIMULATE_AUTH && body.refreshToken === 'invalid-refresh') {
      return apiError(401, ApiErrorCode.REFRESH_INVALID, 'Refresh token invalide');
    }

    await delay(300);
    return HttpResponse.json({ accessToken: 'mock-access-token', expiresIn: 3600 });
  }),

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

  http.post(`${API_URL}/business/connect-google`, async () => {
    await delay(700);
    businessConnectionStatus = BusinessConnectionStatus.CONNECTED;
    return HttpResponse.json({ connectionStatus: businessConnectionStatus });
  }),

  http.post(`${API_URL}/business/collect-link`, async () => {
    await delay(400);
    const publicUrl = 'https://wafizo.fr/c/mon-commerce';
    return HttpResponse.json({
      publicUrl,
      qrCodeSvg: fakeQrSvg(publicUrl),
    });
  }),

  http.get(`${API_URL}/billing/subscription`, ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    return HttpResponse.json({
      plan: currentPlan,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd:
        currentPlan === Plan.PRO ? '2026-09-25T00:00:00.000Z' : null,
      cancelAtPeriodEnd: false,
    });
  }),

  http.post(`${API_URL}/billing/checkout`, async ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    currentPlan = Plan.PRO;
    await delay(500);
    return HttpResponse.json({ checkoutUrl: 'https://checkout.stripe.com/mock-session' });
  }),

  http.post(`${API_URL}/billing/portal`, async () => {
    await delay(300);
    return HttpResponse.json({ portalUrl: 'https://billing.stripe.com/mock-portal' });
  }),

  http.get(`${API_URL}/public/collect/:slug`, () => {
    const response = {
      businessName: 'Mon Commerce',
      googleReviewUrl: 'https://g.page/r/mon-commerce/review',
    };
    return HttpResponse.json(response);
  }),

  http.get(`${API_URL}/me/notification-preferences`, ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;
    return HttpResponse.json(notificationPreferences);
  }),

  http.put(`${API_URL}/me/notification-preferences`, async ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const body = (await request.json()) as NotificationPreferences;

    if (body.smsEnabled && body.phoneNumber && !/^\+[1-9]\d{1,14}$/.test(body.phoneNumber)) {
      return apiError(400, ApiErrorCode.VALIDATION_ERROR, 'Numéro de téléphone invalide', [
        { field: 'phoneNumber', message: 'Format E.164 attendu, ex: +33612345678' },
      ]);
    }

    await delay(400);
    notificationPreferences = body;
    return HttpResponse.json(notificationPreferences);
  }),

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

  http.get(`${API_URL}/reviews/:id`, ({ params, request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    const review = reviews.find((r) => r.id === params.id);
    if (!review) {
      return apiError(404, ApiErrorCode.NOT_FOUND, 'Avis introuvable');
    }
    return HttpResponse.json(review);
  }),

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
