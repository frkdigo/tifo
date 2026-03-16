"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../app/components/AuthProvider";

export default function PostsPage() {
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
    if (Array.isArray(data)) {
      setPosts(data);
    } else {
      setError(data?.error || "Ismeretlen hiba történt a posztok betöltésekor.");
      setPosts([]);
    }
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

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Posztok</h1>
      {user && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-8 flex flex-col gap-3">
          <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Írj egy posztot..." required />

          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setText((prev) => `${prev}${emoji}`)}
                className="border rounded px-2 py-1 hover:bg-gray-100"
                aria-label={`Emoji ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kép feltöltése</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded shadow hover:bg-secondary transition-colors">
                Fájl kiválasztása
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {image && (
                <div className="bg-gray-100 rounded-lg shadow p-2 flex items-center">
                  <img src={image} alt="Előnézet" className="h-20 w-20 object-cover rounded mr-2 border" />
                  <span className="text-xs text-gray-500">Előnézet</span>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="bg-primary text-white px-4 py-2 rounded font-semibold">Küldés</button>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
        </form>
      )}
      {!user && <div className="mb-6 text-gray-500">Jelentkezz be, hogy posztolhass!</div>}
      {loading ? <div>Betöltés...</div> : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="bg-white rounded shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                {post.authorProfileImage ? (
                  <img src={post.authorProfileImage} alt={post.authorName || "Profilkép"} className="w-8 h-8 rounded-full object-cover border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700 border">
                    {(post.authorName || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <div>{post.authorName || "Ismeretlen felhasznalo"}</div>
                </div>
              </div>
              <div className="font-medium">{post.text}</div>
              {post.image && <img src={post.image} alt="Poszt kép" className="mt-3 rounded border max-h-72 w-auto" />}
              <div className="text-xs text-gray-400 mt-1">{post.createdAt}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
