import { Link, Outlet, useLocation } from 'react-router-dom';

const navigation = [
  { label: 'Dashboard', href: '/' },
  { label: 'Avis', href: '/reviews' },
  { label: 'Réponses', href: '/replies' },
  { label: 'Établissement', href: '/business' },
  { label: 'Paramètres', href: '/settings' },
];

function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r bg-card md:flex md:flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-xl font-bold">Wafizo</span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const active = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <p className="text-sm font-medium">Mon compte</p>
            <p className="text-xs text-muted-foreground">Utilisateur Wafizo</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center border-b px-6 md:hidden">
            <span className="text-xl font-bold">Wafizo</span>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
