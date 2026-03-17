"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminDropdown() {
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPendingCount() {
      try {
        const res = await fetch("/api/posts?pending=1", { cache: "no-store" });
        if (!res.ok) return;
        const posts = await res.json();
        if (mounted) {
          setPendingCount(Array.isArray(posts) ? posts.length : 0);
        }
      } catch {
        // Leave the current badge value unchanged on transient errors.
      }
    }

    fetchPendingCount();
    const channel = supabase
      .channel("admin-pending-posts-counter")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  function handleMouseEnter() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpen(true);
  }
  function handleMouseLeave() {
    hoverTimeout.current = setTimeout(() => setOpen(false), 80);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <button
        className="relative text-white/85 hover:text-[#87ceeb] font-medium transition-colors px-3 py-2 rounded focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        tabIndex={0}
        type="button"
      >
        Admin
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[1.15rem] text-center font-bold">
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-950 border border-slate-800 rounded shadow-lg z-50"
          tabIndex={0}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/admin?tab=posts"
            className="block px-4 py-2 text-white/85 hover:bg-white/10 hover:text-[#87ceeb] transition-colors"
            tabIndex={0}
            onClick={() => setOpen(false)}
          >
            Poszt jóváhagyás
          </Link>
          <Link
            href="/admin?tab=events"
            className="block px-4 py-2 text-white/85 hover:bg-white/10 hover:text-[#87ceeb] transition-colors"
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
