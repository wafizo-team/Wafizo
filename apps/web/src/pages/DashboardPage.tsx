import { ReviewStatus } from '@wafizo/shared';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useReviews } from '@/lib/api/queries';
import ReviewStatusBadge from '@/components/reviews/ReviewStatusBadge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function DashboardPage() {
  // ⚠️ Le contrat (packages/shared/dto.ts) n'a pas d'endpoint d'agrégation dédié
  // (ex: GET /stats). On calcule les stats côté client à partir de la liste complète
  // des avis. Ça fonctionne pour un petit volume, mais ne passera pas à l'échelle —
  // à remonter au back pour un vrai endpoint d'agrégation avant la mise en prod.
  const { data, isLoading, isError } = useReviews({ page: 1, limit: 100 });

  const reviews = data?.data ?? [];
  const totalReviews = data?.meta.totalItems ?? 0;
  const pendingCount = reviews.filter((r) => r.status === ReviewStatus.NEW).length;
  const repliedCount = reviews.filter((r) => r.status === ReviewStatus.REPLIED).length;
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '—';

  const latestReviews = [...reviews]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Gérez vos avis clients depuis votre espace Wafizo.</p>
      </div>

      {isError && (
        <p className="mb-4 text-sm text-red-600">
          Impossible de charger les statistiques. Réessayez plus tard.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Avis reçus</p>
          <p className="mt-2 text-3xl font-bold">{isLoading ? '—' : totalReviews}</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Avis à traiter</p>
          <p className="mt-2 text-3xl font-bold">{isLoading ? '—' : pendingCount}</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Note moyenne</p>
          <p className="mt-2 text-3xl font-bold">{isLoading ? '—' : averageRating}</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Réponses publiées</p>
          <p className="mt-2 text-3xl font-bold">{isLoading ? '—' : repliedCount}</p>
        </div>
      </div>

      <section className="mt-8 rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="font-semibold">Derniers avis</h2>
            <p className="text-sm text-muted-foreground">
              Les derniers avis reçus par votre établissement.
            </p>
          </div>
          <Link to="/reviews" className="text-sm font-medium text-primary hover:underline">
            Voir tout
          </Link>
        </div>

        <div className="divide-y">
          {isLoading && <p className="p-6 text-sm text-muted-foreground">Chargement...</p>}

          {!isLoading && latestReviews.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">
              Aucun avis à afficher pour le moment.
            </p>
          )}

          {latestReviews.map((review) => (
            <div key={review.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{review.authorName}</p>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-none text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="truncate text-sm text-muted-foreground">{review.comment}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.publishedAt)}
                </span>
                <ReviewStatusBadge status={review.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
