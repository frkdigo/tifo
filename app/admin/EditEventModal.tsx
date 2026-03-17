
import { useState, useEffect, useRef } from "react";
import { uploadImageToStorage } from "../../lib/uploadImageToStorage";

export default function EditEventModal({ event, onClose, onDeleted, onUpdated }: {
  event: any,
  onClose: () => void,
  onDeleted: () => void,
  onUpdated: () => void
}) {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  function resizeDescription() {
    if (!descriptionRef.current) return;
    const textarea = descriptionRef.current;
    const maxHeight = Math.round(window.innerHeight * 0.45);

    textarea.style.height = "auto";
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    }
  }

  // Body scroll tiltása modal nyitásakor
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  // Ref a modal fő konténeréhez
  const modalRef = useRef<HTMLDivElement>(null);

  // Modal megnyitásakor fókusz és görgetés
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const [form, setForm] = useState({
    title: event.title || "",
    date: event.date || "",
    description: event.description || "",
    image: event.image || "",
    location: event.location || ""
  });

  useEffect(() => {
    resizeDescription();
  }, [form.description]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadImageToStorage(file, "event");
      setForm(f => ({ ...f, image: url }));
    } catch (err) {
      setError("Nem sikerült feltölteni a képet.");
    } finally {
      setLoading(false);
    }
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm("Biztosan törlöd ezt az eseményt?")) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/events`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: event.id, action: "delete" })
    });
    setLoading(false);
    if (res.ok) {
      onDeleted();
      onClose();
    } else {
      setError("Nem sikerült törölni az eseményt.");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/events`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: event.id, action: "update", ...form })
    });
    setLoading(false);
    if (res.ok) {
      onUpdated();
      onClose();
    } else {
      setError("Nem sikerült frissíteni az eseményt.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative outline-none"
        style={{ marginTop: 'clamp(32px, 8vw, 64px)' }}
      >
        <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl" onClick={onClose}>&times;</button>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition" placeholder="Esemény címe" required />
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition" required />
          <textarea
            ref={descriptionRef}
            value={form.description}
            onChange={e => {
              setForm(f => ({ ...f, description: e.target.value }));
              resizeDescription();
            }}
            rows={5}
            className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition resize-none"
            placeholder="Leírás"
          />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium text-slate-700">Kép feltöltése</span>
            <label className="inline-block cursor-pointer">
              <span className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-800 transition-colors inline-block">Fájl kiválasztása</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {form.image && (
              <img
                src={form.image}
                alt="Kép előnézet"
                className="mt-2 rounded shadow max-h-32 border border-slate-200"
                style={{ objectFit: "contain", maxWidth: 180 }}
              />
            )}
          </div>
          <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition" placeholder="Helyszín" />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-800 transition-colors" disabled={loading}>Mentés</button>
            <button type="button" className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors" onClick={handleDelete} disabled={loading}>Törlés</button>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
