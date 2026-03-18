"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { uploadImageToStorage } from "../../lib/uploadImageToStorage";

type Post = {
  id: string;
  text: string;
  image?: string | null;
  createdAt?: string;
  created_at?: string;
  authorName?: string;
  authorNickname?: string;
  authorProfileImage?: string;
  email?: string;
  users?: {
    name?: string;
    nickname?: string;
    profileImage?: string;
  };
};

export default function PostsSection() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const emojiOptions = ["😀", "😂", "😍", "🥳", "🔥", "❤️", "👍", "🎉", "😎", "🙏"];

  function getPostNickname(post: Post) {
    return post.authorNickname || post.users?.nickname || null;
  }

  function getPostAuthorName(post: Post) {
    return getPostNickname(post) || post.authorName || post.users?.name || post.email || "Ismeretlen";
  }

  function getPostAuthorImage(post: Post) {
    return post.authorProfileImage || post.users?.profileImage || null;
  }

  function handleImageClick(img: string) {
    setSelectedImage(img);
  }

  function handleCloseModal() {
    setSelectedImage(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await fetch("/api/posts", { cache: "no-store" });
      if (!res.ok) throw new Error("Fetch hiba");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setError("Nem sikerült betölteni a posztokat.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user) {
      setError("Bejelentkezés szükséges.");
      return;
    }

    let imageUrlToSend: string | null = null;
    try {
      setLoading(true);
      if (imageFile) imageUrlToSend = await uploadImageToStorage(imageFile, user.id);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, image: imageUrlToSend, email: user.email }),
      });
      if (!res.ok) throw new Error();

      setSuccess("Poszt elküldve!");
      setText("");
      setImageFile(null);
      setImageUrl(null);
      fetchPosts();
    } catch {
      setError("Hiba történt a feltöltéskor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(postId: string) {
    if (!window.confirm("Biztos törlés?")) return;
    try {
      const res = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, action: "delete" }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Törölve!");
      fetchPosts();
    } catch {
      setError("Törlés sikertelen.");
    }
  }

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
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

        {/* FORM */}
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

        {/* POSTS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
          {loading ? null : posts.length === 0 ? (
            <div className="text-gray-500 md:col-span-2 xl:col-span-3">Még nincsenek posztok.</div>
          ) : (
            posts.map(post => (
              <article key={post.id} className="h-full rounded-[1.5rem] overflow-hidden border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_16px_35px_-26px_rgba(15,23,42,0.4)] p-5 flex flex-col">
                {/* Posztoló neve/beceneve */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-700">
                    {getPostAuthorName(post).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-slate-900 truncate">{getPostAuthorName(post)}</span>
                    {getPostNickname(post) && (
                      <span className="text-xs text-[#0d3b66] font-medium truncate">@{getPostNickname(post)}</span>
                    )}
                  </div>
                </div>
                <div className="text-slate-700 mb-3 line-clamp-4 leading-[1.58] flex-1">{post.text}</div>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="max-h-48 w-full rounded-2xl mt-1 border border-slate-200 object-contain bg-slate-50 cursor-pointer"
                    style={{ maxWidth: '100%' }}
                    loading="lazy"
                    decoding="async"
                    onClick={() => handleImageClick(post.image!)}
                  />
                )}
                {user && (
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPost(post)}
                      className="bg-[#28a745] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#87ceeb] hover:text-black transition-colors"
                    >
                      Megtekintés
                    </button>
                    {user.isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
                      >
                        Törlés
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      {/* SELECTED IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70"
          onClick={handleCloseModal}
        >
          <img
            src={selectedImage}
            alt="Nagy kép"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-lg border-4 border-white"
            style={{ objectFit: "contain" }}
          />
          <button
            className="absolute top-4 right-4 bg-white text-black rounded-full px-4 py-2 font-bold shadow-lg"
            onClick={handleCloseModal}
          >
            Bezárás
          </button>
        </div>
      )}

      {/* SELECTED POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-slate-200 p-7 relative max-h-[85vh] overflow-y-auto animate-fade-in">
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-4 text-3xl text-slate-400 hover:text-slate-700 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-slate-200"
            >
              &times;
            </button>
            <div className="flex items-center gap-5 mb-6">
              {getPostAuthorImage(selectedPost) ? (
                <img src={getPostAuthorImage(selectedPost) ?? undefined} alt="Profilkép" className="w-16 h-16 rounded-2xl border-4 border-slate-100 object-cover shadow-lg" />
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
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(selectedPost.createdAt || selectedPost.created_at || 0).toLocaleString('hu-HU')}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-800 whitespace-pre-line text-lg font-medium leading-[1.58] shadow-sm mb-4">
              {selectedPost.text || "Nincs szöveg."}
            </div>
            {selectedPost.image && (
              <div className="flex justify-center">
                <img
                  src={selectedPost.image}
                  alt="Poszt képe"
                  className="max-h-96 rounded-2xl border border-slate-200 shadow-lg mt-2 object-contain bg-slate-50 cursor-pointer"
                  style={{ maxWidth: '100%' }}
                  loading="lazy"
                  decoding="async"
                  onClick={() => setSelectedImage(selectedPost.image!)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}