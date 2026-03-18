"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { uploadImageToStorage } from "../../lib/uploadImageToStorage";

export default function PostsSection() {
  const emojiOptions = ["😀", "😂", "😍", "🥳", "🔥", "❤️", "👍", "🎉", "😎", "🙏"];
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
    setImageFile(file);
    setImageUrl(null);
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
    let imageUrlToSend = null;
    if (imageFile) {
      try {
        imageUrlToSend = await uploadImageToStorage(imageFile, user.id);
        setImageUrl(imageUrlToSend);
      } catch (err) {
        setError("Kép feltöltési hiba: " + (err instanceof Error ? err.message : "Ismeretlen hiba"));
        return;
      }
    }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, image: imageUrlToSend }),
    });
    if (!res.ok) {
      setError("Hiba történt a poszt létrehozásakor.");
    } else {
      setSuccess("A poszt elküldve, jóváhagyásra vár!");
      setText("");
      setImageFile(null);
      setImageUrl(null);
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
      <div className="rounded-3xl border border-white/15 bg-slate-950 p-6 md:p-8 mb-6 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/75 mb-2">Közösség</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Posztok</h2>
            <p className="mt-2 text-white/85 max-w-2xl leading-[1.58]">
              Nézd meg, mit oszt meg a közösség, vagy küldd be a saját élményedet, gondolatodat és képedet.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white min-w-[140px]">
            <div className="text-2xl font-black">{posts.length}</div>
            <div className="text-xs text-white/70 uppercase tracking-wide">Jóváhagyott poszt</div>
          </div>
        </div>
      </div>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 rounded-3xl border border-gray-200 bg-white shadow-[0_18px_45px_-28px_rgba(13,59,102,0.22)] p-5 md:p-6 flex flex-col gap-4">
          <div>
            <p className="section-label">Új poszt</p>
            <h3 className="text-2xl md:text-3xl font-black text-tifo-dark">Oszd meg a gondolataid</h3>
          </div>
          <textarea
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 min-h-[110px] text-black leading-[1.58] focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
            placeholder="Oszd meg a gondolataid, képeid vagy élményeid..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex flex-col items-start gap-2">
            <label className="inline-block cursor-pointer">
              <span className="bg-[#28a745] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#87ceeb] hover:text-black transition-colors inline-block">Fájl kiválasztása</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Kép előnézet"
                className="mt-2 rounded-2xl shadow max-h-32 border border-slate-200"
                style={{ objectFit: "contain", maxWidth: 180 }}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <div className="flex gap-2 flex-wrap rounded-2xl bg-slate-50 border border-slate-200 p-3">
            {emojiOptions.map((emoji) => (
              <button
                type="button"
                key={emoji}
                className="text-2xl w-10 h-10 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                onClick={() => setText(text + emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-fit bg-[#28a745] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#87ceeb] hover:text-black transition-colors"
            disabled={loading}
          >
            Poszt beküldése
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        </form>
      ) : (
        <div className="mb-6 bg-white rounded-3xl border border-gray-200 shadow-[0_18px_45px_-28px_rgba(13,59,102,0.22)] p-6 text-center text-slate-600">
          <p className="font-semibold text-slate-900 mb-2">A posztokat fiók nélkül is láthatod.</p>
          <span>Poszt beküldéshez jelentkezz be: <a href="/auth" className="text-[#28a745] hover:text-[#87ceeb] font-semibold transition-colors">Bejelentkezés</a></span>
        </div>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
        {loading ? null : posts.length === 0 ? (
          <div className="text-gray-500 md:col-span-2 xl:col-span-3">Még nincsenek posztok.</div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="h-full rounded-[1.5rem] overflow-hidden border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_16px_35px_-26px_rgba(15,23,42,0.4)] p-5 flex flex-col">
              <div className="h-1 -mx-5 -mt-5 mb-5 bg-gradient-to-r from-[#0d3b66] via-[#87ceeb] to-[#28a745]" />
              <div className="flex items-center gap-3 mb-3">
                  {getPostAuthorImage(post) && (
                    <img src={getPostAuthorImage(post)} alt="Profilkép" className="w-11 h-11 rounded-2xl border border-slate-200 object-cover flex-shrink-0 shadow-sm" />
                )}
                {!getPostAuthorImage(post) && (
                  <div className="w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold shadow-sm">
                    {getPostAuthorName(post).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col justify-center min-w-0">
                    <span className="font-semibold text-slate-900 text-sm truncate max-w-[160px]">{getPostAuthorName(post)}</span>
                    {getPostNickname(post) && (
                      <span className="text-xs text-[#0d3b66] truncate max-w-[160px]">@{getPostNickname(post)}</span>
                    )}
                  <span className="text-xs text-slate-500">{new Date(post.createdAt || post.created_at).toLocaleString('hu-HU')}</span>
                </div>
{user?.isAdmin && (
  <button
    className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 text-xs font-semibold transition-colors"
    title="Poszt törlése"
    onClick={() => handleDeletePost(post.id)}
  >
    Törlés
  </button>
)}
              </div>
              <div className="text-slate-700 mb-3 line-clamp-4 leading-[1.58] flex-1">{post.text}</div>
              {post.image && <img src={post.image} alt="post" className="max-h-48 w-full rounded-2xl mt-1 border border-slate-200 object-contain bg-slate-50" style={{maxWidth:'100%'}} loading="lazy" decoding="async" />}
              {user && (
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="mt-4 bg-[#28a745] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#87ceeb] hover:text-black transition-colors"
                >
                  Megtekintés
                </button>
              )}
            </article>
          ))
        )}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-slate-200 p-7 relative max-h-[85vh] overflow-y-auto animate-fade-in">
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-4 text-3xl text-slate-400 hover:text-slate-700 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-slate-200"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              &times;
            </button>
            <div className="flex items-center gap-5 mb-6">
              {getPostAuthorImage(selectedPost) ? (
                <img src={getPostAuthorImage(selectedPost)} alt="Profilkép" className="w-16 h-16 rounded-2xl border-4 border-slate-100 object-cover shadow-lg" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-3xl font-bold border-4 border-slate-100 shadow-lg">
                  {getPostAuthorName(selectedPost).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col justify-center min-w-0">
                <div className="font-extrabold text-2xl text-slate-900 mb-1">{getPostAuthorName(selectedPost)}</div>
                {getPostNickname(selectedPost) && (
                  <div className="text-lg text-[#0d3b66] font-semibold">@{getPostNickname(selectedPost)}</div>
                )}
                <div className="text-xs text-slate-500 mt-1">{new Date(selectedPost.createdAt || selectedPost.created_at).toLocaleString('hu-HU')}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-800 whitespace-pre-line text-lg font-medium leading-[1.58] shadow-sm mb-4">
              {selectedPost.text || "Nincs szöveg."}
            </div>
            {selectedPost.image && (
              <div className="flex justify-center">
                <img src={selectedPost.image} alt="Poszt képe" className="max-h-96 rounded-2xl border border-slate-200 shadow-lg mt-2 object-contain bg-slate-50" style={{maxWidth:'100%'}} loading="lazy" decoding="async" />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
