import { useState } from 'react';
import { useGenerateReply, usePublishReply } from '../../lib/api/queries';
import { Button } from '../ui/button';

interface ReplyComposerProps {
  reviewId: string;
  initialReply?: string;
  onSuccess?: () => void;
  onPublished?: (val: string | null) => void;
}

export default function ReplyComposer({
  reviewId,
  initialReply,
  onSuccess,
  onPublished,
}: ReplyComposerProps) {
  const [content, setContent] = useState(initialReply || '');
  const generateReply = useGenerateReply();
  const publishReply = usePublishReply();

  const handleGenerate = () => {
    generateReply.mutate(
      { reviewId },
      {
        onSuccess: (res: unknown) => {
          const data = res as { reply?: string; content?: string };
          if (data?.reply) {
            setContent(data.reply);
          } else if (data?.content) {
            setContent(data.content);
          }
        },
      },
    );
  };

  const handlePublish = () => {
    publishReply.mutate(
      { reviewId, content },
      {
        onSuccess: (res: unknown) => {
          const data = res as { reply?: string };
          const newReply = data?.reply || content;
          if (data?.reply) {
            setContent(data.reply);
          }
          if (onSuccess) onSuccess();
          if (onPublished) onPublished(newReply);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full p-3 border rounded-md"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrivez ou générez une réponse..."
      />
      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={generateReply.isPending} variant="outline">
          {generateReply.isPending ? 'Génération...' : 'Générer avec IA'}
        </Button>
        <Button onClick={handlePublish} disabled={publishReply.isPending || !content.trim()}>
          {publishReply.isPending ? 'Publication...' : 'Publier'}
        </Button>
      </div>
    </div>
  );
}
