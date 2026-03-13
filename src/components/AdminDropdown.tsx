"use client";
import Link from "next/link";
import { useState } from "react";

export default function AdminDropdown() {
  const [open, setOpen] = useState(false);
  let hoverTimeout: NodeJS.Timeout | null = null;

  function handleMouseEnter() {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setOpen(true);
  }
  function handleMouseLeave() {
    hoverTimeout = setTimeout(() => setOpen(false), 80);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <button
        className="text-gray-700 hover:text-secondary font-medium transition-colors px-3 py-2 rounded focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        tabIndex={0}
        type="button"
      >
        Admin
      </button>
      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border rounded shadow-lg z-50"
          tabIndex={0}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/admin?tab=posts"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-secondary transition-colors"
            tabIndex={0}
            onClick={() => setOpen(false)}
          >
            Poszt jóváhagyás
          </Link>
          <Link
            href="/admin?tab=events"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-secondary transition-colors"
            tabIndex={0}
            onClick={() => setOpen(false)}
          >
            Események kezelése
          </Link>
        </div>
      )}
    </div>
  );
}
