import { useState } from 'react';
import { ReviewStatus, ReviewSort } from '@wafizo/shared';
import { useReviews } from '@/lib/api/queries';
import ReviewCard from '@/components/reviews/ReviewCard';

const statusFilters: { label: string; value: ReviewStatus | 'ALL' }[] = [
  { label: 'Tous', value: 'ALL' },
  { label: 'Nouveaux', value: ReviewStatus.NEW },
  { label: 'Répondus', value: ReviewStatus.REPLIED },
  { label: 'Ignorés', value: ReviewStatus.IGNORED },
];

const ratingOptions = [1, 2, 3, 4, 5];

function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ReviewSort>(ReviewSort.PUBLISHED_AT_DESC);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useReviews({
    status: statusFilter === 'ALL' ? undefined : [statusFilter],
    rating: ratingFilter.length > 0 ? ratingFilter : undefined,
    search: search.trim() || undefined,
    sort,
    page,
    limit: 20,
  });

  function toggleRating(value: number) {
    setPage(1);
    setRatingFilter((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value],
    );
  }

  function handleStatusChange(value: ReviewStatus | 'ALL') {
    setPage(1);
    setStatusFilter(value);
  }

  function handleSearchChange(value: string) {
    setPage(1);
    setSearch(value);
  }

  function handleSortChange(value: ReviewSort) {
    setPage(1);
    setSort(value);
  }

  const meta = data?.meta;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Avis</h1>
        <p className="mt-2 text-muted-foreground">
          Consultez et gérez les avis de votre établissement.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border bg-card p-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => handleStatusChange(f.value)}
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
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border bg-card px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as ReviewSort)}
          className="rounded-lg border bg-card px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value={ReviewSort.PUBLISHED_AT_DESC}>Plus récents</option>
          <option value={ReviewSort.PUBLISHED_AT_ASC}>Plus anciens</option>
          <option value={ReviewSort.RATING_DESC}>Note décroissante</option>
          <option value={ReviewSort.RATING_ASC}>Note croissante</option>
        </select>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Note :</span>
        {ratingOptions.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => toggleRating(r)}
            className={`rounded-md border px-2.5 py-1 text-sm font-medium transition-colors ${
              ratingFilter.includes(r)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {r} ★
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
      {isError && (
        <p className="text-sm text-red-600">Impossible de charger les avis. Réessayez plus tard.</p>
      )}
      {data && data.data.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun avis ne correspond à ces critères.</p>
      )}
      {data && data.data.length > 0 && (
        <div className="space-y-4">
          {data.data.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} sur {meta.totalPages} — {meta.totalItems} avis au total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={meta.page >= meta.totalPages}
              className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
