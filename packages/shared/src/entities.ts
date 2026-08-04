/**
 * Wafizo — Entités du contrat d'API v1
 * Objets tels que l'API les expose (pas le schéma Prisma).
 * Dates = chaînes ISO 8601 UTC.
 */

import type {
  BusinessConnectionStatus,
  Plan,
  ReplyOrigin,
  ReplyStatus,
  ReviewStatus,
  SourceType,
  SubscriptionStatus,
} from './enums';

export type IsoDateString = string;
export type Uuid = string;

export interface User {
  id: Uuid;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: IsoDateString;
}

export interface Business {
  id: Uuid;
  name: string;
  address: string | null;
  googleLocationId: string | null;
  connectionStatus: BusinessConnectionStatus;
  lastSyncAt: IsoDateString | null;
  createdAt: IsoDateString;
}

export interface Source {
  id: Uuid;
  businessId: Uuid;
  type: SourceType;
  externalId: string | null;
}

export interface Review {
  id: Uuid;
  businessId: Uuid;
  sourceType: SourceType;
  externalId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  reply: Reply | null;
  publishedAt: IsoDateString;
  syncedAt: IsoDateString;
}

export interface Reply {
  id: Uuid;
  reviewId: Uuid;
  content: string;
  status: ReplyStatus;
  origin: ReplyOrigin;
  publishedAt: IsoDateString | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Subscription {
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd: IsoDateString | null;
  cancelAtPeriodEnd: boolean;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  phoneNumber: string | null;
  minRatingAlert: number;
}
