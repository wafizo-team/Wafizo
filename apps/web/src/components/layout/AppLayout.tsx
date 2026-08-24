import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navigation = [
  { label: 'Dashboard', href: '/' },
  { label: 'Avis', href: '/reviews' },
  { label: 'Réponses', href: '/replies' },
  { label: 'Établissement', href: '/business' },
  { label: 'Paramètres', href: '/settings' },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navigation.map((item) => {
        const active = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
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
  );
}

function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 border-r bg-card md:flex md:flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-xl font-bold">Wafizo</span>
          </div>
          <NavLinks />
          <div className="border-t p-4">
            <p className="text-sm font-medium">Mon compte</p>
            <p className="text-xs text-muted-foreground">Utilisateur Wafizo</p>
          </div>
        </aside>

        {/* Overlay + tiroir mobile */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-card shadow-xl">
              <div className="flex h-16 items-center justify-between border-b px-6">
                <span className="text-xl font-bold">Wafizo</span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Fermer le menu"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks onNavigate={() => setMobileNavOpen(false)} />
              <div className="border-t p-4">
                <p className="text-sm font-medium">Mon compte</p>
                <p className="text-xs text-muted-foreground">Utilisateur Wafizo</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center gap-3 border-b px-4 md:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Ouvrir le menu"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xl font-bold">Wafizo</span>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
