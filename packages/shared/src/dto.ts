/**
 * Wafizo — DTOs du contrat d'API v1 (requêtes/réponses par module)
 */

import type { PaginationQuery } from './api';
import type {
  Business,
  IsoDateString,
  NotificationPreferences,
  Reply,
  Subscription,
  User,
} from './entities';
import type { ReplyTone, ReviewStatus } from './enums';

export interface MeResponse {
  user: User;
  business: Business | null;
  subscription: Subscription;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface SyncTriggeredResponse {
  jobId: string;
}

export interface CollectLinkResponse {
  publicUrl: string;
  qrCodeSvg: string;
}

export interface PublicCollectResponse {
  businessName: string;
  googleReviewUrl: string;
}

export const ReviewSort = {
  PUBLISHED_AT_DESC: 'publishedAt:desc',
  PUBLISHED_AT_ASC: 'publishedAt:asc',
  RATING_ASC: 'rating:asc',
  RATING_DESC: 'rating:desc',
} as const;
export type ReviewSort = (typeof ReviewSort)[keyof typeof ReviewSort];

export interface ListReviewsQuery extends PaginationQuery {
  rating?: number[];
  status?: ReviewStatus[];
  hasReply?: boolean;
  search?: string;
  sort?: ReviewSort;
}

export interface UpdateReviewRequest {
  status: Extract<ReviewStatus, 'IGNORED' | 'NEW'>;
}

export interface GenerateReplyRequest {
  tone?: ReplyTone;
  instructions?: string;
}

export interface UpsertReplyRequest {
  content: string;
}

export interface PublishReplyResponse {
  reply: Reply;
  jobId: string;
}

export type UpdateNotificationPreferencesRequest = NotificationPreferences;

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface PortalResponse {
  portalUrl: string;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: IsoDateString;
}

export const HandledStripeEvents = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
] as const;
export type HandledStripeEvent = (typeof HandledStripeEvents)[number];

export type ProcessedWebhookEventId = string;
