import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import type { PublicCollectResponse } from '@wafizo/shared';

import { apiClient } from '@/lib/api/client';

function usePublicCollect(slug: string | undefined) {
  return useQuery({
    queryKey: ['public-collect', slug],
    queryFn: () => apiClient.get<PublicCollectResponse>(`/public/collect/${slug}`),
    enabled: !!slug,
    retry: false,
  });
}

function PublicCollectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = usePublicCollect(slug);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}

        {isError && (
          <>
            <h1 className="text-xl font-bold">Établissement introuvable</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ce lien n'est plus valide ou l'établissement n'existe pas.
            </p>
          </>
        )}

        {data && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
            <h1 className="mt-4 text-xl font-bold">{data.businessName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Votre avis compte beaucoup pour nous. Merci de prendre quelques secondes pour laisser
              un avis sur notre fiche Google.
            </p>
            <a
              href={data.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Laisser un avis Google
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default PublicCollectPage;
