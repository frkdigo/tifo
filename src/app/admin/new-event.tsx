"use client";

import { useRef, useState } from "react";

export default function NewEventForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submitLockRef = useRef(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, description, image })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Hiba az esemény mentésekor.");
      }
      setSuccess(true);
      setTitle("");
      setDate("");
      setDescription("");
      setImage(null);
      if (onCreated) onCreated();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Nem sikerült menteni az eseményt.";
      setError(message);
    } finally {
      setLoading(false);
      submitLockRef.current = false;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-6">
      <h3 className="font-semibold mb-2">Új esemény felvétele</h3>
      <div className="mb-2">
        <label className="block text-sm mb-1">Cím</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Dátum</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-4">
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
      <div className="mb-2">
        <label className="block text-sm mb-1">Leírás</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full border rounded px-2 py-1" />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Sikeres mentés, az esemény azonnal publikálva lett.</div>}
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Mentés..." : "Esemény mentése"}
      </button>
    </form>
  );
}
