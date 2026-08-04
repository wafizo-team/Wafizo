/**
 * Wafizo — Enums du contrat d'API v1
 */

export const SourceType = {
  GOOGLE: 'GOOGLE',
} as const;
export type SourceType = (typeof SourceType)[keyof typeof SourceType];

export const BusinessConnectionStatus = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTED: 'CONNECTED',
  SYNC_ERROR: 'SYNC_ERROR',
} as const;
export type BusinessConnectionStatus =
  (typeof BusinessConnectionStatus)[keyof typeof BusinessConnectionStatus];

export const ReviewStatus = {
  NEW: 'NEW',
  REPLIED: 'REPLIED',
  IGNORED: 'IGNORED',
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export const ReplyStatus = {
  DRAFT: 'DRAFT',
  PUBLISHING: 'PUBLISHING',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
} as const;
export type ReplyStatus = (typeof ReplyStatus)[keyof typeof ReplyStatus];

export const ReplyOrigin = {
  AI: 'AI',
  MANUAL: 'MANUAL',
} as const;
export type ReplyOrigin = (typeof ReplyOrigin)[keyof typeof ReplyOrigin];

export const Plan = {
  FREE: 'FREE',
  PRO: 'PRO',
} as const;
export type Plan = (typeof Plan)[keyof typeof Plan];

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
} as const;
export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const ReplyTone = {
  FORMAL: 'FORMAL',
  FRIENDLY: 'FRIENDLY',
} as const;
export type ReplyTone = (typeof ReplyTone)[keyof typeof ReplyTone];
