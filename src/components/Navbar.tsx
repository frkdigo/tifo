"use client";
import Link from 'next/link'
import UserMenu from './UserMenu'
import { useAuth } from '../../app/components/AuthProvider'
import AdminDropdown from './AdminDropdown';

const navItems = [
  { href: '/', label: 'Főoldal' },
  { href: '/esemenyeink', label: 'Eseményeink' },
  { href: '/rolunk', label: 'Rólunk' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
]

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
        <div className="relative h-10 flex items-center mr-auto" style={{ overflow: 'visible' }}>
          <img src="/images/logo.jpg" alt="TIFO logó" className="h-16 w-auto -mt-3" />
        </div>
        <div className="flex flex-1 justify-end items-center gap-6">
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
            {/* Admin link only for admin users */}
            {user && user.isAdmin && (
              <li>
                <div className="h-full flex items-center">
                  <AdminDropdown />
                </div>
              </li>
            )}
          </ul>
          <div className="pl-6">
            {user ? (
              <UserMenu user={user} onLogout={logoutUser} />
            ) : (
              <Link href="/auth" className="text-gray-700 hover:text-secondary font-medium transition-colors px-3 py-2 rounded">Bejelentkezés</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
