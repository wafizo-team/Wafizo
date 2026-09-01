import type { ReviewStatus } from '@prisma/client';

export class GetReviewsQueryDto {
  page?: string;
  limit?: string;
  rating?: string;
  status?: ReviewStatus;
  hasReply?: string;
  search?: string;
  sort?: 'asc' | 'desc';
}
