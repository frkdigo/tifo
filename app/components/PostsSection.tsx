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

export default function PostsPage() {
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

  const emojiOptions = ["😀", "😂", "😍", "🔥", "👍", "🎉"];

  function getPostNickname(post: Post) {
    return post.authorNickname || post.users?.nickname || null;
  }

  function getPostAuthorName(post: Post) {
    return (
      getPostNickname(post) ||
      post.authorName ||
      post.users?.name ||
      post.email ||
      "Ismeretlen"
    );
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
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
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
    } catch (err) {
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

      if (imageFile) {
        imageUrlToSend = await uploadImageToStorage(imageFile, user.id);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          image: imageUrlToSend,
          email: user.email,
        }),
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
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Posztok ({posts.length})</h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Írj valamit..."
            className="border rounded p-3"
          />

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {imageUrl && (
            <img src={imageUrl} className="max-h-32 rounded" />
          )}

          <div className="flex gap-2">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setText((prev) => prev + emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Küldés..." : "Küldés"}
          </button>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded p-4">
            <div className="flex justify-between mb-2">
              <strong>{getPostAuthorName(post)}</strong>

              {user?.isAdmin && (
                <button onClick={() => handleDeletePost(post.id)}>
                  Törlés
                </button>
              )}
            </div>

            <p className="mb-2">{post.text}</p>

            {post.image && (
              <img
                src={post.image}
                className="max-h-60 rounded cursor-pointer"
                onClick={() => handleImageClick(post.image!)}
              />
            )}

            {user && (
              <button
                onClick={() => setSelectedPost(post)}
                className="mt-2 text-sm underline"
              >
                Megtekintés
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <img src={selectedImage} className="max-h-[90vh] rounded" />
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-lg w-full relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-2 right-3"
            >
              ✕
            </button>

            <h3 className="font-bold mb-2">
              {getPostAuthorName(selectedPost)}
            </h3>

            <p>{selectedPost.text}</p>

            {selectedPost.image && (
              <img
                src={selectedPost.image}
                className="mt-3 max-h-60 rounded"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
