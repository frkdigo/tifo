"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "./AuthProvider";
import AdminDropdown from "./AdminDropdown";

const navItems = [
  { href: "/", label: "Főoldal" },
  { href: "/esemenyeink", label: "Eseményeink" },
  { href: "/rolunk", label: "Rólunk" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center w-full">
        {/* LOGO */}
        <div className="flex items-center min-w-[120px]">
          <Link href="/">
            <img
              src="/images/logo.jpg"
              alt="TIFO logó"
              className="h-16 w-auto -mt-3 cursor-pointer"
            />
          </Link>
        </div>
        {/* MENÜ ÉS LOGIN/USER */}
        <div className="flex flex-1 items-center">
          <ul className="flex items-center gap-6 flex-1 justify-end mr-6">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded font-medium transition-colors ${
                      active
                        ? "text-secondary"
                        : "text-gray-700 hover:text-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {user && user.isAdmin && (
              <li>
                <AdminDropdown />
              </li>
            )}
          </ul>
          <div className="flex items-center ml-8">
            {!user && (
              <Link
                href="/auth"
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition font-medium"
              >
                Bejelentkezés
              </Link>
            )}
            {user && (
              <UserMenu user={user} onLogout={logoutUser} />
            )}
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="absolute top-full right-4 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50 animate-fade-in">
            <ul className="flex flex-col py-2">

              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-gray-700 hover:bg-slate-100 font-medium rounded-lg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {user && user.isAdmin && (
                <li className="px-5 py-3">
                  <AdminDropdown />
                </li>
              )}

              {user && (
                <li className="px-5 py-3">
                  <UserMenu user={user} onLogout={logoutUser} />
                </li>
              )}

              {!user && (
                <li className="px-5 py-3">
                  <Link
                    href="/auth"
                    className="block w-full text-center px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 font-medium"
                  >
                    Bejelentkezés
                  </Link>
                </li>
              )}

            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}