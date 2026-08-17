import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeResponse, Paginated, Review, ListReviewsQuery, ReviewStatus } from '@wafizo/shared';

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
  query.status?.forEach((s) => params.append('status', s));

  return useQuery({
    queryKey: ['reviews', query],
    queryFn: () => apiClient.get<Paginated<Review>>(`/reviews?${params.toString()}`),
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      apiClient.patch<Review>(`/reviews/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
