import { useEffect, useState } from 'react';

const REPLY_TEXT =
  "Merci beaucoup pour votre retour ! Toute l'équipe est ravie de vous avoir accueilli.";

function ReceiptCard() {
  const [visibleChars, setVisibleChars] = useState(0);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev >= REPLY_TEXT.length) {
            clearInterval(interval);
            setTimeout(() => setPublished(true), 400);
            return prev;
          }
          return prev + 1;
        });
      }, 28);
    }, 900);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-sm rounded-lg bg-white shadow-[0_20px_50px_-15px_rgba(22,33,62,0.25)]">
      {/* Volet avis client */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-['Inter'] text-xs font-medium uppercase tracking-wide text-[#16213E]/50">
            Avis reçu
          </span>
          <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#16213E]/40">
            08:14
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-['Bricolage_Grotesque'] font-semibold text-[#16213E]">
            Nadia B.
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-[#E0A63A]">★</span>
            ))}
          </div>
        </div>

        <p className="mt-2 font-['Inter'] text-sm text-[#16213E]/70">
          Super accueil, je recommande vraiment ce commerce !
        </p>
      </div>

      {/* Ligne perforée façon ticket */}
      <div className="relative">
        <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#FAF8F3]" />
        <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#FAF8F3]" />
        <div className="border-t border-dashed border-[#16213E]/20" />
      </div>

      {/* Volet réponse IA */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-['Inter'] text-xs font-medium uppercase tracking-wide text-[#16213E]/50">
            Votre réponse
          </span>
          {published && (
            <span className="font-['Inter'] text-xs font-semibold text-[#4B7A5B]">
              ✓ Publiée
            </span>
          )}
        </div>

        <p className="mt-2 min-h-[3.5rem] font-['Inter'] text-sm text-[#16213E]">
          {REPLY_TEXT.slice(0, visibleChars)}
          {visibleChars < REPLY_TEXT.length && <span className="typing-cursor" />}
        </p>
      </div>
    </div>
  );
}

export default ReceiptCard;
