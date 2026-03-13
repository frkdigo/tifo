"use client";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import NewEventForm from "./new-event";
import AdminEventCard from "./AdminEventCard";

function AdminPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "posts";
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!user.isAdmin) {
      router.push("/");
      return;
    }
    if (tab === "posts") fetchPendingPosts();
    if (tab === "events") fetchEvents();
    // eslint-disable-next-line
  }, [user, tab]);

  async function fetchPendingPosts() {
    setLoading(true);
    setError("");
    try {
      const postsRes = await fetch("/api/posts?pending=1");
      const posts = await postsRes.json();
      setPendingPosts(posts);
    } catch (e) {
      setError("Nem sikerült betölteni a posztokat.");
    }
    setLoading(false);
  }
  async function fetchEvents() {
    setLoading(true);
    setError("");
    try {
      const eventsRes = await fetch("/api/events");
      const eventsData = await eventsRes.json();
      setEvents(eventsData);
    } catch (e) {
      setError("Nem sikerült betölteni az eseményeket.");
    }
    setLoading(false);
  }

  async function approvePost(id: number) {
    await fetch(`/api/posts`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "approve" })
    });
    fetchPendingPosts();
  }

  return (
    <main className="bg-site min-h-screen py-12 px-2">
      <section className="max-w-6xl mx-auto px-2 md:px-4">
        <div className="premium-surface rounded-3xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 text-center">Admin felület</h1>
          <div className="mb-8 flex gap-4 justify-center">
            <button className={"px-10 py-3 rounded-full font-semibold text-lg transition-colors min-w-[140px] " + (tab === "posts" ? "bg-slate-900 text-white shadow-lg" : "bg-white/90 text-slate-900 border border-slate-200 hover:bg-slate-100")}
              onClick={() => router.push("/admin?tab=posts")}>Posztok</button>
            <button className={"px-10 py-3 rounded-full font-semibold text-lg transition-colors min-w-[140px] " + (tab === "events" ? "bg-slate-900 text-white shadow-lg" : "bg-white/90 text-slate-900 border border-slate-200 hover:bg-slate-100")}
              onClick={() => router.push("/admin?tab=events")}>Események</button>
          </div>
          {tab === "posts" && (
            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Jóváhagyásra váró posztok</h2>
              {loading ? <div>Betöltés...</div> : error ? <div className="text-red-500">{error}</div> : (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingPosts.map(post => (
                    <li key={post.id} className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_16px_30px_-24px_rgba(15,23,42,0.45)] p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                        {post.authorProfileImage && (
                          <img src={post.authorProfileImage} alt="Profilkép" className="w-8 h-8 rounded-full border border-slate-200 object-cover flex-shrink-0" />
                        )}
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="font-medium text-slate-900 text-sm truncate max-w-[110px]">{post.authorName || post.email}</span>
                          <span className="text-xs text-slate-500">{new Date(post.createdAt || post.created_at).toLocaleString('hu-HU')}</span>
                        </div>
                      </div>
                      {post.image && (
                        <img src={post.image} alt="post" className="max-h-20 rounded mt-1 mb-1" style={{objectFit:'contain', maxWidth:'100%'}} />
                      )}
                      <div className="flex gap-2 mt-2">
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold transition-colors" onClick={() => approvePost(post.id)}>Jóváhagyás</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition-colors" onClick={() => {
                          if (window.confirm('Biztosan elutasítod ezt a posztot?')) approvePost(post.id);
                        }}>Elutasítás</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {tab === "events" && (
            <section>
              <NewEventForm onCreated={fetchEvents} />
              <h2 className="text-xl md:text-2xl font-bold mb-4">Események</h2>
              {loading ? <div>Betöltés...</div> : error ? <div className="text-red-500">{error}</div> : (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map(event => (
                    <li key={event.id}>
                      <AdminEventCard event={event} onUpdated={fetchEvents} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense>
      <AdminPageContent />
    </Suspense>
  );
}
