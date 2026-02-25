import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, LogInIcon, LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

const publicNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const allNavLinks = isAuthenticated
    ? [...publicNavLinks, { label: 'Admin', path: '/admin' }]
    : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 bg-charcoal-dark border-b border-white/10 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/prodal-tex-logo.dim_400x100.png"
              alt="PRODAL TEX"
              className="h-8 md:h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const sibling = target.nextElementSibling as HTMLElement | null;
                if (sibling) sibling.style.display = 'block';
              }}
            />
            <span
              className="hidden font-heading text-xl md:text-2xl font-semibold text-offwhite tracking-wide"
              style={{ display: 'none' }}
            >
              PRODAL TEX
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-body font-medium tracking-wide transition-colors rounded-sm ${
                  isActive(link.path)
                    ? 'text-teal-light border-b-2 border-teal-light'
                    : 'text-offwhite/80 hover:text-offwhite hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Login / Logout */}
            {isAuthenticated ? (
              <button
                onClick={clear}
                className="ml-2 px-4 py-2 text-sm font-body font-medium tracking-wide transition-colors rounded-sm text-offwhite/70 hover:text-offwhite hover:bg-white/5 flex items-center gap-1.5"
              >
                <LogOutIcon size={14} />
                Logout
              </button>
            ) : (
              <button
                onClick={login}
                disabled={isLoggingIn}
                className="ml-2 px-4 py-2 text-sm font-body font-medium tracking-wide transition-colors rounded-sm text-teal-light hover:text-offwhite hover:bg-teal/10 flex items-center gap-1.5 disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-light border-t-transparent" />
                ) : (
                  <LogInIcon size={14} />
                )}
                Login
              </button>
            )}

            <Link to="/contact">
              <Button
                size="sm"
                className="ml-4 bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide border-0"
              >
                Get a Quote
              </Button>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-offwhite p-2 rounded-sm hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-charcoal-dark border-t border-white/10 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm font-body font-medium tracking-wide rounded-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-teal-light bg-white/5'
                    : 'text-offwhite/80 hover:text-offwhite hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Login / Logout in mobile */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                className="px-4 py-3 text-sm font-body font-medium tracking-wide rounded-sm transition-colors text-offwhite/70 hover:text-offwhite hover:bg-white/5 flex items-center gap-2 text-left"
              >
                <LogOutIcon size={15} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  login();
                  setMobileOpen(false);
                }}
                disabled={isLoggingIn}
                className="px-4 py-3 text-sm font-body font-medium tracking-wide rounded-sm transition-colors text-teal-light hover:text-offwhite hover:bg-teal/10 flex items-center gap-2 text-left disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-light border-t-transparent" />
                ) : (
                  <LogInIcon size={15} />
                )}
                Login
              </button>
            )}

            <Link to="/contact" onClick={() => setMobileOpen(false)}>
              <Button
                size="sm"
                className="mt-2 w-full bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide border-0"
              >
                Get a Quote
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
