"use client";

// ...existing code...
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
      body: JSON.stringify({ text, email: user.email, image }),
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
      <div className="space-y-4">
        {loading ? (
          <div>Betöltés...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-500">Még nincsenek posztok.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                {post.authorProfileImage && (
                  <img src={post.authorProfileImage} alt="Profilkép" className="w-8 h-8 rounded-full border border-slate-200 object-cover flex-shrink-0" />
                )}
                <div className="flex flex-col justify-center min-w-0">
                  <span className="font-medium text-slate-900 text-sm truncate max-w-[120px]">{post.authorName || post.email}</span>
                  <span className="text-xs text-slate-500">{new Date(post.createdAt || post.created_at).toLocaleString('hu-HU')}</span>
                </div>
                {user && user.email === "furkonorbert16@gmail.com" && (
                  <button
                    className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                    title="Poszt törlése"
                    onClick={() => handleDeletePost(post.id)}
                  >Törlés</button>
                )}
              </div>
              <div className="text-slate-700 mb-2">{post.text}</div>
              {post.image && <img src={post.image} alt="post" className="max-h-20 rounded mt-1" style={{objectFit:'contain', maxWidth:'100%'}} />}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
