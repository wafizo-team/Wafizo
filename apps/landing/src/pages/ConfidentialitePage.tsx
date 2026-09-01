import { Link } from 'react-router-dom';

function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] px-6 py-16 text-[#16213E]">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="font-['Inter'] text-sm text-[#16213E]/60 transition hover:text-[#16213E]"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="mt-6 font-['Bricolage_Grotesque'] text-3xl font-extrabold">
          Politique de confidentialité
        </h1>

        <div className="mt-8 space-y-6 font-['Inter'] text-sm leading-relaxed text-[#16213E]/80">
          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Données collectées
            </h2>
            <p className="mt-2">
              Ce site collecte uniquement votre adresse email lorsque vous vous inscrivez pour être
              informé·e du lancement de Wafizo. Aucune autre donnée personnelle n'est collectée sur
              cette page.
            </p>
          </section>

          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Finalité du traitement
            </h2>
            <p className="mt-2">
              Votre adresse email est utilisée exclusivement pour vous informer du lancement du
              produit Wafizo. Elle ne sera ni cédée ni transmise à des tiers à des fins
              commerciales.
            </p>
          </section>

          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Durée de conservation
            </h2>
            <p className="mt-2">
              Votre email est conservé jusqu'au lancement du produit ou jusqu'à votre demande de
              suppression.
            </p>
          </section>

          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Vos droits (RGPD)
            </h2>
            <p className="mt-2">
              Conformément au Règlement Général sur la Protection des Données, vous disposez d'un
              droit d'accès, de rectification et de suppression de vos données. Pour exercer ce
              droit, contactez-nous à [email de contact à préciser].
            </p>
          </section>

          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Cookies
            </h2>
            <p className="mt-2">
              Ce site n'utilise pas de cookies de suivi publicitaire. Aucune donnée de navigation
              n'est transmise à des tiers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ConfidentialitePage;
