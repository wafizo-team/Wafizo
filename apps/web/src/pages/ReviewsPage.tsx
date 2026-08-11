import { useMemo, useState } from 'react';
import { ReviewStatus, ReviewSort } from '@wafizo/shared';

import { mockReviews } from '@/lib/fixtures/reviews';
import ReviewCard from '@/components/reviews/ReviewCard';

const statusFilters: { label: string; value: ReviewStatus | 'ALL' }[] = [
  { label: 'Tous', value: 'ALL' },
  { label: 'Nouveaux', value: ReviewStatus.NEW },
  { label: 'Répondus', value: ReviewStatus.REPLIED },
  { label: 'Ignorés', value: ReviewStatus.IGNORED },
];

function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ReviewSort>(ReviewSort.PUBLISHED_AT_DESC);

  const filteredReviews = useMemo(() => {
    let result = [...mockReviews];

    if (statusFilter !== 'ALL') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.authorName.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case ReviewSort.PUBLISHED_AT_ASC:
          return a.publishedAt.localeCompare(b.publishedAt);
        case ReviewSort.RATING_ASC:
          return a.rating - b.rating;
        case ReviewSort.RATING_DESC:
          return b.rating - a.rating;
        case ReviewSort.PUBLISHED_AT_DESC:
        default:
          return b.publishedAt.localeCompare(a.publishedAt);
      }
    });

    return result;
  }, [statusFilter, search, sort]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Avis</h1>
        <p className="mt-2 text-muted-foreground">
          Consultez et gérez les avis de votre établissement.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border bg-card p-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Rechercher un avis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border bg-card px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as ReviewSort)}
          className="rounded-lg border bg-card px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value={ReviewSort.PUBLISHED_AT_DESC}>Plus récents</option>
          <option value={ReviewSort.PUBLISHED_AT_ASC}>Plus anciens</option>
          <option value={ReviewSort.RATING_DESC}>Note décroissante</option>
          <option value={ReviewSort.RATING_ASC}>Note croissante</option>
        </select>
      </div>

      {filteredReviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun avis ne correspond à ces critères.</p>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
