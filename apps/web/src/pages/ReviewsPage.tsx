import { useState } from 'react';
import { useReviews } from '@/lib/api/queries';
import ReviewCard from '@/components/reviews/ReviewCard';

export function ReviewsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useReviews({ search });

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des avis...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Erreur lors du chargement des avis.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Avis</h1>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Rechercher dans les avis..."
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          className="max-w-sm flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {data && data.data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun avis trouvé pour le moment.
        </div>
      )}

      {data && data.data.length > 0 && (
        <div className="grid gap-4">
          {data.data.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
