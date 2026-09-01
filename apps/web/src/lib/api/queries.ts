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

// Remplace lib/mock/replyApi.ts::generateReply — vrai appel API (MSW en dev)
export function useGenerateReply() {
  return useMutation({
    mutationFn: ({ reviewId, ...body }: { reviewId: string } & GenerateReplyRequest) =>
      apiClient.post<{ content: string }>(`/reviews/${reviewId}/reply/generate`, body),
  });
}

// Remplace lib/mock/replyApi.ts::publishReply — vrai appel API (MSW en dev),
// invalide le cache 'reviews' pour que la réponse publiée persiste après un refetch
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

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () =>
      apiClient.get<{
        plan: string;
        status: string;
        currentPeriodEnd: string | null;
        cancelAtPeriodEnd: boolean;
      }>('/billing/subscription'),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (priceId: string) =>
      apiClient.post<{ checkoutUrl: string }>('/billing/checkout', { priceId }),
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: () => apiClient.post<{ portalUrl: string }>('/billing/portal'),
  });
}

export function useCollectLink() {
  return useMutation({
    mutationFn: () =>
      apiClient.post<{ publicUrl: string; qrCodeSvg: string }>('/business/collect-link'),
  });
}
