"use client";

import Link from "next/link";
import UserMenu from "./UserMenu";
import { useAuth } from "./AuthProvider";
import AdminDropdown from "./AdminDropdown";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Főoldal" },
  { href: "/esemenyeink", label: "Eseményeink" },
  { href: "/rolunk", label: "Rólunk" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [menuOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center w-full">

        {/* LOGO */}
        <div className="relative h-10 flex items-center" style={{ overflow: "visible" }}>
          <img
            src="/images/logo.jpg"
            alt="TIFO logó"
            className="h-16 w-auto -mt-3"
          />
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-6 items-center ml-auto mr-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-gray-700 hover:text-secondary font-medium transition-colors px-3 py-2 rounded"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {user && user.isAdmin && (
            <li>
              <AdminDropdown />
            </li>
          )}
        </ul>

        {/* LOGIN / USER */}
        <div className="hidden md:flex items-center">
          {!user && (
            <Link
              href="/auth"
              className="text-gray-700 hover:text-secondary font-medium transition-colors px-3 py-2 rounded border border-slate-300 bg-white hover:bg-slate-100"
            >
              Bejelentkezés
            </Link>
          )}

          {user && <UserMenu user={user} onLogout={logoutUser} />}
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex ml-auto">
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen((v) => !v)}
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
          <div className="absolute top-full right-4 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
            <ul className="flex flex-col gap-1 py-2">
              {navItems.map((item) => (
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
                    className="block w-full text-center text-gray-700 hover:text-secondary font-medium px-3 py-2 rounded border border-slate-300 bg-white hover:bg-slate-100"
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