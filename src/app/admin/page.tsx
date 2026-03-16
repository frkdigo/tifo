"use client";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../../app/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import NewEventForm from "./new-event";
import AdminEventCard from "./AdminEventCard";

function AdminPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams && searchParams.get ? searchParams.get("tab") || "posts" : "posts";
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
  async function deletePost(id: number) {
    await fetch(`/api/posts`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" })
    });
    fetchPendingPosts();
  }
  async function approveEvent(id: number) {
    await fetch(`/api/events`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "approve" })
    });
    fetchEvents();
  }
  async function deleteEvent(id: number) {
    await fetch(`/api/events`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" })
    });
    fetchEvents();
  }

  if (loading) return <div className="p-8 text-center">Betöltés...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin jóváhagyás</h1>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded font-semibold border ${tab === 'posts' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          onClick={() => router.push('/admin?tab=posts')}
        >
          Poszt jóváhagyás
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold border ${tab === 'events' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          onClick={() => router.push('/admin?tab=events')}
        >
          Események kezelése
        </button>
      </div>
      {tab === 'posts' && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Függőben lévő posztok</h2>
          {pendingPosts.length === 0 ? <div>Nincs jóváhagyásra váró poszt.</div> : (
            <ul className="space-y-3">
              {pendingPosts.map(post => (
                <li key={post.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{getPostAuthorName(post)}</div>
                    <div className="text-xs text-gray-500">{getPostCreatedAt(post)}</div>
                    <div className="text-sm text-slate-700 max-h-16 overflow-hidden">{post.text}</div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                    <button onClick={() => setSelectedPost(post)} className="w-full bg-slate-700 text-white px-3 py-2 rounded">Megtekintés</button>
                    <button onClick={() => approvePost(post.id)} className="w-full bg-green-500 text-white px-3 py-2 rounded">Jóváhagy</button>
                    <button onClick={() => deletePost(post.id)} className="w-full bg-red-500 text-white px-3 py-2 rounded">Törlés</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {tab === 'events' && (
        <section>
          <NewEventForm onCreated={fetchEvents} />
          <h2 className="text-lg font-semibold mb-2">Események</h2>
          {eventMessage && <div className="text-green-600 text-sm mb-3">{eventMessage}</div>}
          {events.length === 0 ? <div>Nincs esemény.</div> : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map(event => (
                <AdminEventCard key={event.id} event={event} onUpdated={fetchEvents} onDeleted={() => {
                  fetchEvents();
                  setEventMessage("Sikeresen törölted az eseményt!");
                }} />
              ))}
            </div>
          )}
        </section>
      )}
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
    <Suspense fallback={<div className="p-8 text-center">Betoltes...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}
