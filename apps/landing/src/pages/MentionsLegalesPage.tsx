import { Link } from 'react-router-dom';

function MentionsLegalesPage() {
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
          Mentions légales
        </h1>

        <div className="mt-8 space-y-6 font-['Inter'] text-sm leading-relaxed text-[#16213E]/80">
          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Éditeur du site
            </h2>
            <p className="mt-2">
              Wafizo — [Forme juridique à préciser]
              <br />
              [Adresse du siège social à préciser]
              <br />
              [Numéro SIRET à préciser]
              <br />
              Contact : [email de contact à préciser]
            </p>
          </section>

          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Directeur de la publication
            </h2>
            <p className="mt-2">[Nom du responsable à préciser]</p>
          </section>

          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Hébergement
            </h2>
            <p className="mt-2">
              [Nom de l'hébergeur à préciser]
              <br />
              [Adresse de l'hébergeur à préciser]
            </p>
          </section>

          <section>
            <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#16213E]">
              Propriété intellectuelle
            </h2>
            <p className="mt-2">
              L'ensemble des contenus présents sur ce site (textes, images, logos) est la propriété
              de Wafizo, sauf mention contraire, et ne peut être reproduit sans autorisation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MentionsLegalesPage;
