import { Star } from 'lucide-react';
import type { Review } from '@wafizo/shared';

import ReviewStatusBadge from './ReviewStatusBadge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border bg-card p-5">
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

        <ReviewStatusBadge status={review.status} />
      </div>

      {review.comment && (
        <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
      )}

      {review.reply ? (
        <div className="mt-4 rounded-lg bg-muted p-3">
          <p className="text-xs font-medium text-muted-foreground">Votre réponse</p>
          <p className="mt-1 text-sm">{review.reply.content}</p>
        </div>
      ) : (
        <div className="mt-4">
          <button
            type="button"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Répondre
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
