function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Gérez vos avis clients depuis votre espace Wafizo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Avis reçus</p>
          <p className="mt-2 text-3xl font-bold">128</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Avis à traiter</p>
          <p className="mt-2 text-3xl font-bold">24</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Note moyenne</p>
          <p className="mt-2 text-3xl font-bold">4.7</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Réponses publiées</p>
          <p className="mt-2 text-3xl font-bold">104</p>
        </div>
      </div>

      <section className="mt-8 rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-semibold">Derniers avis</h2>
          <p className="text-sm text-muted-foreground">
            Les derniers avis reçus par votre établissement.
          </p>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground">
            Aucun avis à afficher pour le moment.
          </p>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
