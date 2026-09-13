import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface BusinessSource {
  id: string;
  type: string;
  externalId: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  sources: BusinessSource[];
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  businesses: Business[];
}

export interface ReviewItem {
  id: string;
  status: string;
  rating: number;
  comment?: string;
  authorName?: string;
  publishedAt?: string;
  reply?: string;
}

export interface ReviewsResponse {
  data: ReviewItem[];
  meta: { totalItems: number; page: number; limit: number; totalPages: number };
}

export function useMe() {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.get<MeResponse>('/auth/me'),
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

      const queryString = searchParams.toString();
      const endpoint = queryString ? `/reviews?${queryString}` : '/reviews';

      return apiClient.get<ReviewsResponse>(endpoint);
    },
  });
}

export function useConnectBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<unknown>('/business/connect', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useGenerateReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      apiClient.post<unknown>(`/reviews/${reviewId}/generate`, {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function usePublishReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      apiClient.post<unknown>(`/reviews/${reviewId}/publish`, { content }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewId, status }: { id?: string; reviewId?: string; status: string }) => {
      const targetId = reviewId || id;
      return apiClient.patch<unknown>(`/reviews/${targetId}/status`, { status });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useCollectLink() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/business/collect-link', {});
      return {
        url: res.url || '',
        qrCodeSvg: res.qrCodeSvg || '',
        publicUrl: res.publicUrl || res.url || '',
      };
    },
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get<Record<string, unknown>>('/billing/subscription'),
  });
}

export function useCreateCheckout() {
  return useMutation<
    { url: string; checkoutUrl: string },
    Error,
    void | string | Record<string, unknown>
  >({
    mutationFn: async (payload?: void | string | Record<string, unknown>) => {
      const body = typeof payload === 'string' ? { priceId: payload } : payload || {};
      const res = await apiClient.post('/billing/checkout', body);
      return {
        url: res.url || res.checkoutUrl || '',
        checkoutUrl: res.checkoutUrl || res.url || '',
      };
    },
  });
}

export function useBillingPortal() {
  return useMutation<
    { url: string; portalUrl: string },
    Error,
    void | string | Record<string, unknown>
  >({
    mutationFn: async (payload?: void | string | Record<string, unknown>) => {
      const body = typeof payload === 'string' ? { returnUrl: payload } : payload || {};
      const res = await apiClient.post('/billing/portal', body);
      return {
        url: res.url || res.portalUrl || '',
        portalUrl: res.portalUrl || res.url || '',
      };
    },
  });
}
