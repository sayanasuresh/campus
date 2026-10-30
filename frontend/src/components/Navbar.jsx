import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/map', label: 'Map' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sand/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-amber">
            <MapPin size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            CampusConnect
          </span>
        </NavLink>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ink text-white' : 'text-slate hover:bg-ink/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-ink text-white' : 'text-slate hover:bg-ink/5'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-1 flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-slate hover:bg-ink/5"
              >
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/admin/login"
              className="ml-1 rounded-md bg-amber px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-amber/90"
            >
              Admin login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
