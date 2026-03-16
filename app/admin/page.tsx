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
  const [eventMessage, setEventMessage] = useState("");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  function getPostAuthorName(post: any) {
    return post.authorName || post.users?.nickname || post.users?.name || post.email || "Ismeretlen";
  }

  function getPostAuthorImage(post: any) {
    return post.authorProfileImage || post.users?.profileImage || null;
  }

  function getPostCreatedAt(post: any) {
    const raw = post.createdAt || post.created_at;
    if (!raw) return "";
    return new Date(raw).toLocaleString("hu-HU");
  }

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

  useEffect(() => {
    if (!eventMessage) return;
    const timer = setTimeout(() => setEventMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [eventMessage]);

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

  async function rejectPost(id: number) {
    await fetch(`/api/posts`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" })
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
                        {getPostAuthorImage(post) && (
                          <img src={getPostAuthorImage(post)} alt="Profilkép" className="w-8 h-8 rounded-full border border-slate-200 object-cover flex-shrink-0" />
                        )}
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="font-medium text-slate-900 text-sm truncate max-w-[110px]">{getPostAuthorName(post)}</span>
                          <span className="text-xs text-slate-500">{getPostCreatedAt(post)}</span>
                        </div>
                      </div>
                      {post.image && (
                        <img src={post.image} alt="post" className="max-h-20 rounded mt-1 mb-1" style={{objectFit:'contain', maxWidth:'100%'}} />
                      )}
                      <p className="text-sm text-slate-700 max-h-16 overflow-hidden">{post.text}</p>
                      <div className="flex gap-2 mt-2">
                        <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 font-semibold transition-colors" onClick={() => setSelectedPost(post)}>Megtekintés</button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold transition-colors" onClick={() => approvePost(post.id)}>Jóváhagyás</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition-colors" onClick={() => {
                          if (window.confirm('Biztosan elutasítod ezt a posztot?')) rejectPost(post.id);
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
              {eventMessage && <div className="text-green-600 text-sm mb-4">{eventMessage}</div>}
              {loading ? <div>Betöltés...</div> : error ? <div className="text-red-500">{error}</div> : (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map(event => (
                    <li key={event.id}>
                      <AdminEventCard event={event} onUpdated={fetchEvents} onDeleted={() => {
                        fetchEvents();
                        setEventMessage("Sikeresen törölted az eseményt!");
                      }} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </section>
      {selectedPost && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute top-2 right-3 text-2xl text-slate-400 hover:text-slate-700"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Poszt megtekintése</h3>
            <div className="flex items-center gap-3 mb-4">
              {getPostAuthorImage(selectedPost) ? (
                <img src={getPostAuthorImage(selectedPost)} alt="Profilkép" className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold">
                  {String(getPostAuthorName(selectedPost)).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900">{getPostAuthorName(selectedPost)}</p>
                <p className="text-xs text-slate-500">{selectedPost.email || "Nincs email"}</p>
                <p className="text-xs text-slate-500">{getPostCreatedAt(selectedPost)}</p>
              </div>
            </div>
            {selectedPost.image && (
              <img src={selectedPost.image} alt="Poszt képe" className="w-full max-h-72 object-contain rounded-lg border border-slate-200 mb-4" />
            )}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 whitespace-pre-line">
              {selectedPost.text || "Nincs szöveg a poszthoz."}
            </div>
          </div>
        </div>
      )}
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
