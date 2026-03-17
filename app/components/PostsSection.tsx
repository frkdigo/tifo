"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export default function PostsSection() {
  const emojiOptions = ["😀", "😂", "😍", "🥳", "🔥", "❤️", "👍", "🎉", "😎", "🙏"];
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  function getPostNickname(post: any) {
    return post.authorNickname || post.users?.nickname || null;
  }

  function getPostAuthorName(post: any) {
    return getPostNickname(post) || post.authorName || post.users?.name || post.email || "Ismeretlen";
  }

  function getPostAuthorImage(post: any) {
    return post.authorProfileImage || post.users?.profileImage || null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch("/api/posts", { cache: "no-store" });
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user) {
      setError("Bejelentkezés szükséges a posztoláshoz.");
      return;
    }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, image }), // email maradhat, de csak az admin UI-t cseréljük
    });
    if (!res.ok) {
      setError("Hiba történt a poszt létrehozásakor.");
    } else {
      setSuccess("A poszt elküldve, jóváhagyásra vár!");
      setText("");
      setImage(null);
      fetchPosts();
    }
  }

  async function handleDeletePost(postId: string) {
    if (!window.confirm("Biztosan törlöd ezt a posztot?")) return;
    const res = await fetch(`/api/posts`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: postId, action: "delete" }),
    });
    if (!res.ok) {
      setError("Hiba történt a poszt törlésekor.");
    } else {
      setSuccess("A poszt törölve!");
      fetchPosts();
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-xl shadow p-4 flex flex-col gap-3">
          <textarea
            className="w-full border border-slate-200 rounded p-2 min-h-[60px]"
            placeholder="Oszd meg a gondolataid, képeid vagy élményeid..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex flex-col items-start gap-1">
            <label className="inline-block cursor-pointer">
              <span className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-800 transition-colors inline-block">Fájl kiválasztása</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {image && (
              <img
                src={image}
                alt="Kép előnézet"
                className="mt-2 rounded shadow max-h-32 border border-slate-200"
                style={{ objectFit: "contain", maxWidth: 180 }}
              />
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {emojiOptions.map((emoji) => (
              <button
                type="button"
                key={emoji}
                className="text-2xl"
                onClick={() => setText(text + emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-800 transition-colors"
            disabled={loading}
          >
            Poszt beküldése
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        </form>
      ) : (
        <div className="mb-6 bg-white rounded-xl shadow p-6 text-center text-slate-600">
          <p className="font-semibold text-slate-900 mb-2">A posztokat fiók nélkül is láthatod.</p>
          <span>Poszt beküldéshez jelentkezz be: <a href="/auth" className="text-sky-600 hover:underline font-semibold">Bejelentkezés</a></span>
        </div>
      )}
      <div className="space-y-4">
        {loading ? null : posts.length === 0 ? (
          <div className="text-gray-500">Még nincsenek posztok.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                  {getPostAuthorImage(post) && (
                    <img src={getPostAuthorImage(post)} alt="Profilkép" className="w-8 h-8 rounded-full border border-slate-200 object-cover flex-shrink-0" />
                )}
                <div className="flex flex-col justify-center min-w-0">
                    <span className="font-medium text-slate-900 text-sm truncate max-w-[120px]">{getPostAuthorName(post)}</span>
                    {getPostNickname(post) && (
                      <span className="text-xs text-sky-700 truncate max-w-[120px]">@{getPostNickname(post)}</span>
                    )}
                  <span className="text-xs text-slate-500">{new Date(post.createdAt || post.created_at).toLocaleString('hu-HU')}</span>
                </div>
{user?.email === "furkonorbert16@gmail.com" && user?.isAdmin && (
  <button
    className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 text-xs font-semibold transition-colors"
    title="Poszt törlése"
  >
    Törlés
  </button>
)}
              </div>
              <div className="text-slate-700 mb-2 line-clamp-3">{post.text}</div>
              {post.image && <img src={post.image} alt="post" className="max-h-20 rounded mt-1" style={{objectFit:'contain', maxWidth:'100%'}} />}
              {user && (
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="mt-3 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
                >
                  Megtekintés
                </button>
              )}
            </div>
          ))
        )}
      </div>

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
            <div className="flex items-center gap-2 mb-3">
              {getPostAuthorImage(selectedPost) && (
                <img src={getPostAuthorImage(selectedPost)} alt="Profilkép" className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
              )}
              <div>
                <div className="font-semibold text-slate-900">{getPostAuthorName(selectedPost)}</div>
                {getPostNickname(selectedPost) && (
                  <div className="text-xs text-sky-700">@{getPostNickname(selectedPost)}</div>
                )}
                <div className="text-xs text-slate-500">{new Date(selectedPost.createdAt || selectedPost.created_at).toLocaleString('hu-HU')}</div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 whitespace-pre-line">
              {selectedPost.text || "Nincs szöveg."}
            </div>
            {selectedPost.image && (
              <img src={selectedPost.image} alt="Poszt képe" className="w-full max-h-80 object-contain rounded-lg border border-slate-200 mt-4" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
