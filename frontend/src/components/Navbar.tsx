import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">🚗</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">
              AutoVault
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={linkClass('/dashboard')}>
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className={linkClass('/admin')}>
                    Admin Panel
                  </Link>
                )}
                <div className="h-6 w-px bg-gray-200 mx-1" />
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Welcome, <strong className="text-gray-900">{user?.id ? 'User' : ''}</strong>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 shadow-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}>
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className={linkClass('/admin')}>
                  Admin Panel
                </Link>
              )}
              <div className="pt-2 mt-2 border-t border-gray-100">
                <p className="px-3 py-1 text-sm text-gray-500">
                  Welcome, <strong className="text-gray-900">{user?.id ? 'User' : ''}</strong>
                </p>
                <button
                  onClick={logout}
                  className="mt-2 w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>
                Log in
              </Link>
              <Link
                to="/register"
                className="block mt-2 text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
