"use client";


import { useEffect, useRef, useState } from "react";
import { uploadImageToStorage } from "../../lib/uploadImageToStorage";

export default function NewEventForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea minden rendernél
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = 'auto';
      descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
    }
  }, [description]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 3500);
    return () => clearTimeout(timer);
  }, [success]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    // Előnézethez olvassuk be a képet
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
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
    let uploadedImageUrl = null;
    try {
      if (imageFile) {
        uploadedImageUrl = await uploadImageToStorage(imageFile, "event");
      }
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, date, location, description, image: uploadedImageUrl })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.id) {
        throw new Error(data?.error || "Hiba az esemény mentésekor.");
      }
      setSuccess(true);
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      setImageFile(null);
      setImageUrl(null);
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col gap-3">
      <h3 className="font-bold text-lg mb-2">Új esemény felvétele</h3>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition" placeholder="Esemény címe" required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition" required />
      <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition" placeholder="Helyszín (pl. Művház udvar)" />
      <textarea
        ref={descriptionRef}
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition resize-none overflow-hidden"
        placeholder="Leírás"
        rows={2}
        style={{ minHeight: 40, maxHeight: 400 }}
      />
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-medium text-slate-700">Kép feltöltése</span>
        <label className="inline-block cursor-pointer">
          <span className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-neutral-800 transition-colors inline-block">Fájl kiválasztása</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {imageFile && <span className="text-xs text-slate-600 mt-1">{imageFile.name}</span>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Kép előnézet"
            className="mt-2 rounded shadow max-h-32 border border-slate-200"
            style={{ objectFit: "contain", maxWidth: 180 }}
          />
        )}
      </div>
      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-neutral-800 transition-all duration-150 active:scale-95 active:brightness-90 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Mentés..." : "Mentés"}
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">Sikeresen létrehoztad az eseményt!</div>}
    </form>
  );
}
