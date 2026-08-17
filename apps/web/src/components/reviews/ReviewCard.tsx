import { useState } from 'react';
import { Star, EyeOff, RotateCcw, Loader2 } from 'lucide-react';
import type { Review, ReviewStatus } from '@wafizo/shared';
import { ReviewStatus as Status } from '@wafizo/shared';

import ReviewStatusBadge from './ReviewStatusBadge';
import ReplyComposer from './ReplyComposer';
import { updateReviewStatus } from '@/lib/mock/reviewApi';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ReviewCard({
  review,
  onStatusChange,
}: {
  review: Review;
  onStatusChange: (reviewId: string, status: ReviewStatus) => void;
}) {
  const [publishedReply, setPublishedReply] = useState<string | null>(
    review.reply?.content ?? null,
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function handleToggleIgnore() {
    const nextStatus = review.status === Status.IGNORED ? Status.NEW : Status.IGNORED;
    setIsUpdatingStatus(true);
    try {
      await updateReviewStatus(review.id, nextStatus);
      onStatusChange(review.id, nextStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <div
      className={`rounded-xl border bg-card p-5 ${
        review.status === Status.IGNORED ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{review.authorName}</p>
          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-muted-foreground'
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-muted-foreground">
              {formatDate(review.publishedAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ReviewStatusBadge status={review.status} />

          {review.status !== Status.REPLIED && (
            <button
              type="button"
              onClick={handleToggleIgnore}
              disabled={isUpdatingStatus}
              title={review.status === Status.IGNORED ? 'Réactiver cet avis' : 'Ignorer cet avis'}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
            >
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : review.status === Status.IGNORED ? (
                <RotateCcw className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {review.comment && (
        <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
      )}

      {review.status === Status.IGNORED ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Avis ignoré — il n'apparaîtra pas dans vos statistiques.
        </p>
      ) : publishedReply ? (
        <div className="mt-4 rounded-lg bg-muted p-3">
          <p className="text-xs font-medium text-muted-foreground">Votre réponse</p>
          <p className="mt-1 text-sm">{publishedReply}</p>
        </div>
      ) : (
        <ReplyComposer reviewId={review.id} onPublished={setPublishedReply} />
      )}
    </div>
  );
}

export default ReviewCard;
