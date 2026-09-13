import { useState } from 'react';
import { useReviews } from '@/lib/api/queries';
import type { ReviewItem } from '@/lib/api/queries';
import ReplyComposer from '@/components/reviews/ReplyComposer';

export function ReviewsPage() {
  const [search, setSearch] = useState('');
  const { data: reviewsData, isLoading } = useReviews({ search });

  const reviews = reviewsData?.data || [];

  return (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avis clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultez et répondez aux avis reçus sur vos établissements.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Rechercher un avis..."
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement des avis...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun avis trouvé.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: ReviewItem) => (
            <div key={review.id} className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{review.authorName || 'Client anonyme'}</p>
                  <p className="text-sm text-yellow-500">Note : {review.rating} / 5</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {review.publishedAt ? new Date(review.publishedAt).toLocaleDateString() : ''}
                </span>
              </div>

              <p className="text-sm text-foreground">{review.comment || 'Aucun commentaire.'}</p>

              {review.reply ? (
                <div className="rounded-md bg-muted p-4 text-sm">
                  <p className="font-medium text-xs text-muted-foreground mb-1">Réponse publiée :</p>
                  <p>{review.reply}</p>
                </div>
              ) : (
                <div className="pt-2">
                  <ReplyComposer reviewId={review.id} initialReply={review.reply} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
