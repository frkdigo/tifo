"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { motion } from "framer-motion";

export default function ProfilomPage() {
  const { user, updateUserProfile } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState(user?.nickname || user?.name || "");
  const [profileimage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    setNickname(user.nickname || user.name || "");
    setProfileImage(user.profileimage ?? user.profileImage ?? null);

    async function loadProfile() {
      const res = await fetch(`/api/profile?email=${encodeURIComponent(user.email)}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const freshNickname = data.nickname || data.name || user.nickname || user.name || "";
      const freshImage = data.profileimage ?? data.profileImage ?? user.profileimage ?? user.profileImage ?? null;
      setNickname(freshNickname);
      setProfileImage(freshImage);
      // Szinkronizálja a navbar-t is, ha az adatbázisban más kép van mint a cache-ben
      if (freshImage !== (user.profileimage ?? user.profileImage ?? null) || freshNickname !== (user.nickname || user.name || "")) {
        updateUserProfile(freshNickname, freshImage);
      }
    }

    loadProfile();
  }, [user, router]);

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        nickname,
        profileimage: profileimage,
        profileImage: profileimage,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(data.error || "Nem sikerült menteni a profilodat.");
      return;
    }

    const nextProfileImage = data.user?.profileimage ?? data.user?.profileImage ?? profileimage ?? null;
    updateUserProfile(data.user.nickname || nickname, nextProfileImage);
    setProfileImage(nextProfileImage);
    setMessage("Profil sikeresen mentve.");
  }

  if (!user) return null;

  return (
    <motion.main
      className="max-w-xl mx-auto py-10 px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="text-2xl font-bold mb-6">Profilom</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {profileimage ? (
            <img src={profileimage} alt="Profilkép" className="w-16 h-16 rounded-full object-cover border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-700 border">
              {(nickname || user.name || user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-sm text-gray-600">Válassz profilképet fájlból.</div>
        </div>

        <label>
          Becenév
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </label>

        <div>
          <label className="block text-sm font-medium mb-2">Profilkép feltöltése</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded shadow hover:bg-secondary transition-colors">
              Fájl kiválasztása
              <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
            </label>
            {profileimage && (
              <div className="bg-gray-100 rounded-lg shadow p-2 flex items-center">
                <img src={profileimage} alt="Előnézet" className="h-16 w-16 object-cover rounded mr-2 border" />
                <span className="text-xs text-gray-500">Előnézet</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-900 text-white font-semibold px-6 py-2 rounded hover:bg-blue-800 transition disabled:opacity-60"
        >
          {saving ? "Mentés..." : "Mentés"}
        </button>

        {message && <div className="text-sm text-gray-700">{message}</div>}
      </form>
    </main>
  );
}
