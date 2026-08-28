import type { ReviewStatus } from '@prisma/client';

export class UpdateReviewDto {
  status?: ReviewStatus;
  content?: string;
}
