import { useState } from 'react';
import ReceiptCard from './components/ReceiptCard';

function App() {
const [email, setEmail] = useState('');
const [submitted, setSubmitted] = useState(false);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
setSubmitted(true);
};

return ( <div className="min-h-screen bg-[#FAF8F3] text-[#16213E]">
{/* Header */} <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6"> <span className="font-['Bricolage_Grotesque'] text-xl font-extrabold">
Wafizo </span>

    <a
      href="#cta"
      className="rounded-full bg-[#16213E] px-4 py-2 font-['Inter'] text-sm font-medium text-white transition hover:bg-[#16213E]/90"
    >
      Être prévenu
    </a>
  </header>

  {/* Hero */}
  <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
    <div>
      <h1 className="font-['Bricolage_Grotesque'] text-4xl font-extrabold leading-[1.1] md:text-5xl">
        Répondez à vos avis Google en{' '}
        <span className="text-[#E0A63A]">30 secondes</span>, pas en 30
        minutes
      </h1>

      <p className="mt-5 font-['Inter'] text-lg leading-relaxed text-[#16213E]/70">
        Wafizo génère des réponses professionnelles à vos avis clients,
        en un clic. Fait pour le commerçant qui gère sa fiche seul — pas
        pour les groupes à 50 établissements.
      </p>

      <form
        id="cta"
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
      >
        <input
          type="email"
          required
          placeholder="vous@commerce.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-[#16213E]/15 bg-white px-4 py-3 font-['Inter'] text-sm outline-none transition focus:border-[#E0A63A] focus:ring-2 focus:ring-[#E0A63A]/30"
        />

        <button
          type="submit"
          className="whitespace-nowrap rounded-full bg-[#E0A63A] px-5 py-3 font-['Inter'] text-sm font-semibold text-[#16213E] transition hover:bg-[#E0A63A]/90"
        >
          {submitted ? 'Merci !' : 'Être prévenu'}
        </button>
      </form>

      <p className="mt-2 font-['Inter'] text-xs text-[#16213E]/40">
        Aucun spam. Un email au lancement, c'est tout.
      </p>
    </div>

    <ReceiptCard />
  </section>

  {/* Problème */}
  <section className="mx-auto max-w-6xl px-6 py-16">
    <div className="grid gap-8 md:grid-cols-3">
      <div>
        <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold">
          Le temps
        </h2>
        <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#16213E]/60">
          Répondre à chaque avis prend 5 à 10 minutes si vous réfléchissez
          au ton et à la formulation.
        </p>
      </div>

      <div>
        <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold">
          L'oubli
        </h2>
        <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#16213E]/60">
          Sans notification fiable, des avis restent parfois sans réponse
          pendant des semaines.
        </p>
      </div>

      <div>
        <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold">
          Le prix
        </h2>
        <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#16213E]/60">
          Les outils existants sont souvent pensés pour les agences
          multi-établissements — trop chers et trop complexes pour un
          commerce seul.
        </p>
      </div>
    </div>
  </section>

  {/* Comment ça marche */}
  <section className="bg-white py-16">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold">
        Comment ça marche
      </h2>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div>
          <span className="font-['IBM_Plex_Mono',monospace] text-sm text-[#E0A63A]">
            01
          </span>

          <h3 className="mt-1 font-['Bricolage_Grotesque'] text-lg font-bold">
            Connectez votre fiche
          </h3>

          <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#16213E]/60">
            Reliez votre Google Business Profile en deux minutes. Pas de
            démo, pas d'onboarding.
          </p>
        </div>

        <div>
          <span className="font-['IBM_Plex_Mono',monospace] text-sm text-[#E0A63A]">
            02
          </span>

          <h3 className="mt-1 font-['Bricolage_Grotesque'] text-lg font-bold">
            L'IA écrit une réponse
          </h3>

          <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#16213E]/60">
            Une réponse professionnelle et personnalisée, générée en un
            clic.
          </p>
        </div>

        <div>
          <span className="font-['IBM_Plex_Mono',monospace] text-sm text-[#E0A63A]">
            03
          </span>

          <h3 className="mt-1 font-['Bricolage_Grotesque'] text-lg font-bold">
            Vous validez et publiez
          </h3>

          <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#16213E]/60">
            Modifiez si besoin, puis publiez directement sur Google.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* Différenciation */}
  <section className="mx-auto max-w-6xl px-6 py-16">
    <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold">
      Fait pour vous, pas pour les franchises
    </h2>

    <p className="mt-2 max-w-2xl font-['Inter'] leading-relaxed text-[#16213E]/60">
      Les autres outils sont pensés pour des chaînes et des groupes.
      Wafizo est pensé pour un commerce, une fiche Google, une app simple.
    </p>

    <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
      {[
        'Données hébergées en France',
        'Un vrai plan gratuit',
        'Sans engagement',
        'Configuré en 2 minutes',
      ].map((item) => (
        <div key={item} className="flex items-center gap-2">
          <span className="text-[#4B7A5B]">✓</span>
          <span className="font-['Inter'] text-sm">{item}</span>
        </div>
      ))}
    </div>
  </section>

  {/* Footer */}
  <footer className="border-t border-[#E3DED2] py-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-['Inter'] text-xs text-[#16213E]/40 md:flex-row">
      <span>© 2026 Wafizo</span>

      <div className="flex gap-4">
        <a
          href="/mentions-legales"
          className="transition hover:text-[#16213E]"
        >
          Mentions légales
        </a>

        <a
          href="/confidentialite"
          className="transition hover:text-[#16213E]"
        >
          Confidentialité
        </a>
      </div>
    </div>
  </footer>
</div>

);
}

export default App;
