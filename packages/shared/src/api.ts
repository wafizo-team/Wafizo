/**
 * Wafizo — Conventions transverses du contrat d'API v1
 * Format d'erreur unique + enveloppe de pagination.
 */

export const ApiErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  REFRESH_INVALID: 'REFRESH_INVALID',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PLAN_LIMIT_REACHED: 'PLAN_LIMIT_REACHED',
  SYNC_IN_PROGRESS: 'SYNC_IN_PROGRESS',
  ALREADY_PUBLISHED: 'ALREADY_PUBLISHED',
  BUSINESS_NOT_CONNECTED: 'BUSINESS_NOT_CONNECTED',
} as const;
export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  statusCode: number;
  error: ApiErrorCode;
  message: string;
  details?: ApiErrorDetail[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
