import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', to: '/' },
  { name: 'Reviews', to: '/reviews' },
  { name: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-background p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Wafizo</h1>
        <p className="text-sm text-muted-foreground">Gestion des avis</p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
