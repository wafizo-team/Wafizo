import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  businesses: Array<{
    id: string;
    name: string;
    slug: string;
    sources: Array<{
      id: string;
      type: string;
      externalId: string;
    }>;
  }>;
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
      
      return apiClient.get<{
        data: any[];
        meta: { totalItems: number; page: number; limit: number; totalPages: number };
      }>(endpoint);
    },
  });
}

export function useConnectBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<any>('/business/connect', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useGenerateReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      apiClient.post<any>(`/reviews/${reviewId}/generate`, {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function usePublishReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      apiClient.post<any>(`/reviews/${reviewId}/publish`, { content }),
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
      return apiClient.patch<any>(`/reviews/${targetId}/status`, { status });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useCollectLink() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ url: string; qrCodeSvg?: string; publicUrl?: string }>('/business/collect-link', {});
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
    queryFn: () => apiClient.get<any>('/billing/subscription'),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ url: string; checkoutUrl?: string }>('/billing/checkout', {});
      return {
        url: res.url || res.checkoutUrl || '',
        checkoutUrl: res.checkoutUrl || res.url || '',
      };
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ url: string; portalUrl?: string }>('/billing/portal', {});
      return {
        url: res.url || res.portalUrl || '',
        portalUrl: res.portalUrl || res.url || '',
      };
    },
  });
}
