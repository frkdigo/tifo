"use client";
import Link from 'next/link'
import UserMenu from './UserMenu'
import { useAuth } from './AuthProvider'
import AdminDropdown from './AdminDropdown';

const navItems = [
  { href: '/', label: 'Főoldal' },
  { href: '/esemenyeink', label: 'Eseményeink' },
  { href: '/rolunk', label: 'Rólunk' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
]

import { useEffect, useState } from 'react';

  const { user, logoutUser } = useAuth();
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
  const [menuOpen, setMenuOpen] = useState(false);


  // Close menu on route change (optional, ha szeretnéd)
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [menuOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
        <div className="relative h-10 flex items-center mr-auto" style={{ overflow: 'visible' }}>
          <img src="/images/logo.jpg" alt="TIFO logó" className="h-16 w-auto -mt-3" />
        </div>
        {/* Desktop menu */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-6">
          <ul className="flex gap-6 items-center">
            {navItems.map(item => (
              <li key={item.href}>
                {item.href === '/' ? (
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-secondary font-medium transition-colors px-3 py-2 rounded"
                    scroll={true}
                    onClick={() => {
                      if (window && window.scrollTo) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link href={item.href} className="text-gray-700 hover:text-secondary font-medium transition-colors px-3 py-2 rounded">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            {user && user.isAdmin && (
              <li>
                <div className="h-full flex items-center">
                  <AdminDropdown />
                </div>
              </li>
            )}
          </ul>
          <UserMenu />
        </div>
        {/* Mobile hamburger */}
        <div className="md:hidden flex flex-1 justify-end items-center">
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Menü megnyitása"
            onClick={() => setMenuOpen(v => !v)}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
          {/* Mobile menu dropdown */}
          {menuOpen && (
            <div className="absolute top-full right-4 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50 animate-fade-in">
              <ul className="flex flex-col gap-1 py-2">
                {navItems.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-5 py-3 text-gray-700 hover:bg-slate-100 rounded-xl font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {user && user.isAdmin && (
                  <li>
                    <div className="px-5 py-3">
                      <AdminDropdown />
                    </div>
                  </li>
                )}
                <li>
                  <div className="px-5 py-3">
                    <UserMenu />
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
