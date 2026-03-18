```tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { uploadImageToStorage } from "../../lib/uploadImageToStorage";

export default function PostsPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const emojiOptions = ["😀","😂","😍","🔥","👍","🎉"];

  function getPostNickname(post: any) {
    return post.authorNickname || post.users?.nickname || null;
  }

  function getPostAuthorName(post: any) {
    return getPostNickname(post) || post.authorName || post.users?.name || post.email || "Ismeretlen";
  }

  function getPostAuthorImage(post: any) {
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
        setError("Kép feltöltési hiba");
        return;
      }
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, image: imageUrlToSend, email: user.email }),
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

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Posztok ({posts.length})</h2>
      </div>

      {/* FORM */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Írj valamit..."
            className="border p-2"
          />

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {imageUrl && <img src={imageUrl} className="max-h-32" />}

          <div>
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setText(text + emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            Küldés
          </button>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      )}

      {/* POSTS */}
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4">

            <div className="flex justify-between">
              <strong>{getPostAuthorName(post)}</strong>

              {user?.isAdmin && (
                <button onClick={() => handleDeletePost(post.id)}>
                  Törlés
                </button>
              )}
            </div>

            <p>{post.text}</p>

            {post.image && (
              <img
                src={post.image}
                className="max-h-40 cursor-pointer"
                onClick={() => handleImageClick(post.image)}
              />
            )}

            {user && (
              <button onClick={() => setSelectedPost(post)}>
                Megtekintés
              </button>
            )}
          </div>
        ))}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <img src={selectedImage} className="max-h-[90vh]" />
        </div>
      )}

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-6 max-w-lg w-full relative">
            <button onClick={() => setSelectedPost(null)}>X</button>

            <h2>{getPostAuthorName(selectedPost)}</h2>
            <p>{selectedPost.text}</p>

            {selectedPost.image && (
              <img src={selectedPost.image} className="max-h-60" />
            )}
          </div>
        </div>
      )}

    </section>
  );
}
```
