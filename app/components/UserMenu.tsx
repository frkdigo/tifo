"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function UserMenu({
  user,
  onLogout,
}: {
  user: { name: string; nickname: string; profileimage?: string | null; profileImage?: string | null; email: string; isAdmin: boolean } | null;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleDocumentClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!user) return null;
  const userAvatar = user.profileimage ?? user.profileImage ?? null;
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {userAvatar ? (
          <img src={userAvatar} alt="Profilkep" className="w-8 h-8 rounded-full object-cover border" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700 border">
            {(user.nickname || user.name).charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm text-gray-700 whitespace-nowrap">
          {user.nickname || user.name} {user.isAdmin && <span className="ml-1 text-xs bg-primary text-white px-2 py-0.5 rounded">Admin</span>}
        </span>
        <span className="text-xs text-gray-500">▼</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
            {user.isAdmin && <div className="px-4 py-2 text-xs text-gray-500">{user.email}</div>}
          <Link href="/profilom" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">Profilom</Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition-colors"
          >
            Kijelentkezés
          </button>
        </div>
      )}
    </div>
  );
}
