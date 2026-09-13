import { useReviews } from '../lib/api/queries';
import { ReviewItem } from '../lib/api/queries';
import { useUpdateReviewStatus } from '../lib/api/queries';

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

export function DashboardPage() {
  const { data: reviewsData, isLoading } = useReviews();
  const updateStatus = useUpdateReviewStatus();

  if (isLoading) {
    return <div className="p-6">Chargement du tableau de bord...</div>;
  }

  const reviews = reviewsData?.data || [];

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r: ReviewItem) => r.status === 'PENDING').length,
    published: reviews.filter((r: ReviewItem) => r.status === 'PUBLISHED').length,
    averageRating:
      reviews.length > 0
        ? (reviews.reduce((acc: number, r: ReviewItem) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0',
  };

  const sortedReviews = [...reviews].sort((a: ReviewItem, b: ReviewItem) => {
    const dateA = a.publishedAt || '';
    const dateB = b.publishedAt || '';
    return dateB.localeCompare(dateA);
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus.mutate({ reviewId: id, status: newStatus });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Total avis</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">En attente</p>
          <p className="text-xl font-bold">{stats.pending}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Publiés</p>
          <p className="text-xl font-bold">{stats.published}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Note moyenne</p>
          <p className="text-xl font-bold">{stats.averageRating}</p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Avis récents</h2>
        {sortedReviews.length === 0 ? (
          <p className="text-gray-500">Aucun avis trouvé.</p>
        ) : (
          <div className="space-y-4">
            {sortedReviews.slice(0, 5).map((review: ReviewItem) => (
              <div key={review.id} className="border-b pb-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold">{review.authorName || 'Anonyme'}</p>
                  <p className="text-yellow-500">★ {review.rating}</p>
                  <p className="text-gray-700 mt-1">{review.comment || 'Sans commentaire'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {review.publishedAt ? new Date(review.publishedAt).toLocaleDateString() : ''}
                  </p>
                </div>
                <div>
                  <select
                    value={review.status}
                    onChange={(e) => handleStatusChange(review.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="APPROVED">Approuvé</option>
                    <option value="REJECTED">Rejeté</option>
                    <option value="PUBLISHED">Publié</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
