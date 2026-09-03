import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  SubscriptionResponse,
  CheckoutResponse,
  BillingPortalResponse,
  Review,
  ReviewStatus,
} from '@wafizo/shared';

import { apiClient } from './client';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () =>
      apiClient.get<{
        id: string;
        email: string;
        name: string;
        business?: { connectionStatus: string };
      }>('/auth/me'),
  });
}

export function useReviews(params?: { status?: string[]; limit?: number; search?: string; sort?: string; page?: number }) {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params?.status) {
        params.status.forEach((s) => searchParams.append('status', s));
      }
      if (params?.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      if (params?.search) {
        searchParams.append('search', params.search);
      }
      if (params?.sort) {
        searchParams.append('sort', params.sort);
      }
      if (params?.page) {
        searchParams.append('page', params.page.toString());
      }
      const queryStr = searchParams.toString();
      return apiClient.get<{ data: Review[] }>(`/reviews${queryStr ? `?${queryStr}` : ''}`);
    },
  });
}

export function useGenerateReply() {
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      apiClient.post<{ content: string }>(`/reviews/${reviewId}/generate-reply`),
  });
}

export function usePublishReply() {
  return useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      apiClient.post<{ reply: { content: string } }>(`/reviews/${reviewId}/publish`, { content }),
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      apiClient.patch(`/reviews/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useConnectBusiness() {
  return useMutation({
    mutationFn: (data: any = {}) => apiClient.post('/business/connect', data),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => apiClient.get<any>('/notifications/preferences'),
  });
}

export function useUpdateNotificationPreferences() {
  return useMutation({
    mutationFn: (data: any) => apiClient.put<any>('/notifications/preferences', data),
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get<SubscriptionResponse>('/billing/subscription'),
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
    mutationFn: () => apiClient.post<BillingPortalResponse>('/billing/portal'),
  });
}
