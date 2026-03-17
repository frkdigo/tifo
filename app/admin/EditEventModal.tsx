
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
    <div className="fixed inset-0 z-[220] bg-slate-950/45 backdrop-blur-[2px] md:flex md:items-center md:justify-center md:p-4" onClick={onClose}>
      <div
        ref={modalRef}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 md:static bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl h-[92dvh] md:h-auto md:max-h-[88vh] overflow-hidden flex flex-col outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 pt-3 pb-3 md:px-5 md:pt-4 md:pb-4">
          <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mb-3 md:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Esemény szerkesztése</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">Módosítsd az adatokat, majd mentsd a változtatásokat.</p>
            </div>
            <button
              className="shrink-0 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-2xl leading-none"
              onClick={onClose}
              aria-label="Bezárás"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-4 pb-6 pt-4 md:px-5 md:pb-7">
          <form onSubmit={handleUpdate} className="flex flex-col gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4 md:p-5">
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition bg-white" placeholder="Esemény címe" required />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition bg-white" required />
            <textarea
              ref={descriptionRef}
              value={form.description}
              onChange={e => {
                setForm(f => ({ ...f, description: e.target.value }));
                resizeDescription();
              }}
              rows={5}
              className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition resize-none bg-white"
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
                  className="mt-2 rounded-xl shadow max-h-40 border border-slate-200"
                  style={{ objectFit: "contain", maxWidth: 220 }}
                />
              )}
            </div>
            <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-slate-300 transition bg-white" placeholder="Helyszín" />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-800 transition-colors" disabled={loading}>Mentés</button>
              <button type="button" className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors" onClick={handleDelete} disabled={loading}>Törlés</button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
