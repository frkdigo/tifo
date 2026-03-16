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
                    <div className="font-medium">{post.text}</div>
                    <div className="text-xs text-gray-500">{post.createdAt}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approvePost(post.id)} className="bg-green-500 text-white px-3 py-1 rounded">Jóváhagy</button>
                    <button onClick={() => deletePost(post.id)} className="bg-red-500 text-white px-3 py-1 rounded">Törlés</button>
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
          {events.length === 0 ? <div>Nincs esemény.</div> : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map(event => (
                <AdminEventCard key={event.id} event={event} onUpdated={fetchEvents} />
              ))}
            </div>
          )}
        </section>
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
