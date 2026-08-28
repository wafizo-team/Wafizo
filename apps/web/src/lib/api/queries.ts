import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  MeResponse,
  Paginated,
  Review,
  ListReviewsQuery,
  ReviewStatus,
  NotificationPreferences,
  GenerateReplyRequest,
  PublishReplyResponse,
  CollectLinkResponse,
  Subscription,
  CheckoutResponse,
  PortalResponse,
} from '@wafizo/shared';

import { apiClient } from './client';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.get<MeResponse>('/auth/me'),
    retry: false,
  });
}

export function useReviews(query: ListReviewsQuery) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.sort) params.set('sort', query.sort);
  if (query.hasReply !== undefined) params.set('hasReply', String(query.hasReply));
  query.status?.forEach((s) => params.append('status', s));
  query.rating?.forEach((r) => params.append('rating', String(r)));

  return useQuery({
    queryKey: ['reviews', query],
    queryFn: () => apiClient.get<Paginated<Review>>(`/reviews?${params.toString()}`),
  });
}

export function useGenerateReply() {
  return useMutation({
    mutationFn: ({ reviewId, ...body }: { reviewId: string } & GenerateReplyRequest) =>
      apiClient.post<{ content: string }>(`/reviews/${reviewId}/reply/generate`, body),
  });
}

export function usePublishReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      apiClient.post<PublishReplyResponse>(`/reviews/${reviewId}/reply/publish`, { content }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      apiClient.patch<Review>(`/reviews/${id}`, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
export function useConnectBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<{ connectionStatus: string }>('/business/connect-google'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

// ⚠️ Route assumée par convention (/business/collect-link) — le contrat définit
// CollectLinkResponse mais ne précise pas l'endpoint. À confirmer avec le back (W12/L2).
export function useCollectLink() {
  return useMutation({
    mutationFn: () => apiClient.post<CollectLinkResponse>('/business/collect-link'),
  });
}

// Aligné sur apps/api/src/billing/billing.controller.ts (routes réelles, pas assumées)
export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get<Subscription>('/billing/subscription'),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (priceId: string) =>
      apiClient.post<CheckoutResponse>('/billing/checkout', { priceId }),
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: () => apiClient.post<PortalResponse>('/billing/portal'),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => apiClient.get<NotificationPreferences>('/me/notification-preferences'),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs: NotificationPreferences) =>
      apiClient.put<NotificationPreferences>('/me/notification-preferences', prefs),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
}
