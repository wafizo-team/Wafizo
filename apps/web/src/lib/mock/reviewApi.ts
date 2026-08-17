import { ReviewStatus } from '@wafizo/shared';

// Simule B8 : PATCH /reviews/:id
export async function updateReviewStatus(
  _reviewId: string,
  status: Extract<ReviewStatus, 'IGNORED' | 'NEW'>,
): Promise<{ status: ReviewStatus }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { status };
}
