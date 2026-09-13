import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  SubscriptionResponse,
  CheckoutResponse,
  BillingPortalResponse,
  ReviewStatus,
  Business,
  Review,
} from '@wafizo/shared';
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
        data: Review[];
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
