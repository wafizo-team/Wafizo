import { useState } from 'react';
import { RefreshCw, Send, Loader2, AlertCircle } from 'lucide-react';
import { useGenerateReply, usePublishReply } from '@/lib/api/queries';

type ComposerState = 'idle' | 'generating' | 'editing' | 'publishing' | 'published' | 'failed';

function ReplyComposer({
  reviewId,
  onPublished,
}: {
  reviewId: string;
  onPublished: (content: string) => void;
}) {
  const [state, setState] = useState<ComposerState>('idle');
  const [content, setContent] = useState('');
  const generateReply = useGenerateReply();
  const publishReply = usePublishReply();

  async function handleGenerate() {
    setState('generating');
    try {
      const result = await generateReply.mutateAsync({ reviewId });
      setContent(result.content);
      setState('editing');
    } catch {
      setState('failed');
    }
  }

  async function handlePublish() {
    if (!content.trim()) return;
    setState('publishing');
    try {
      const result = await publishReply.mutateAsync({ reviewId, content });
      setState('published');
      onPublished(result.reply.content);
    } catch {
      setState('failed');
    }
  }

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={() => void handleGenerate()}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Répondre
      </button>
    );
  }

  if (state === 'generating') {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        L'IA rédige une réponse...
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="mt-4 flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm text-red-700">
        <span className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          La publication a échoué. Réessayez.
        </span>
        <button
          type="button"
          onClick={() => void (content ? handlePublish() : handleGenerate())}
          className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-medium hover:bg-red-200"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // editing ou publishing
  return (
    <div className="mt-4 space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={state === 'publishing'}
        rows={3}
        className="w-full rounded-lg border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void handlePublish()}
          disabled={state === 'publishing' || !content.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {state === 'publishing' ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Publication...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Publier
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={state === 'publishing'}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Régénérer
        </button>
      </div>
    </div>
  );
}

export default ReplyComposer;
