import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Business } from '@wafizo/shared';
import type {
  SubscriptionResponse,
  CheckoutResponse,
  BillingPortalResponse,
  ReviewStatus,
} from '@wafizo/shared';

import { apiClient } from './client';

export function useMe() {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['me'],
    queryFn: () =>
      apiClient.get<{
        id: string;
        email: string;
        name: string;
        createdAt: string;
        business?: Business | null;
      }>('/auth/me'),
    enabled: !!token,
  });
}

export function useReviews(params?: {
  status?: string[];
  limit?: number;
  search?: string;
  sort?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: async () => {
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
      return apiClient.get<{
        data: Review[];
        meta: { totalItems: number; page: number; limit: number; totalPages: number };
      }>(`/reviews${queryStr ? `?${queryStr}` : ''}`);
      const query = searchParams.toString();
      const res = await apiClient.get<any>(query ? `/reviews?${query}` : '/reviews');
      return res;
    },
  });
}

export function useGenerateReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      apiClient.post<any>(`/reviews/${reviewId}/generate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function usePublishReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      apiClient.post<any>(`/reviews/${reviewId}/reply`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      apiClient.patch<any>(`/reviews/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => apiClient.get('/settings/notifications'),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferences: any) => apiClient.put('/settings/notifications', preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get<SubscriptionResponse>('/subscription'),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (priceId: string) =>
      apiClient.post<CheckoutResponse>('/subscription/checkout', { priceId }),
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: () => apiClient.post<BillingPortalResponse>('/subscription/portal', {}),
  });
}
