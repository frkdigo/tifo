import { useState } from "react";
import { uploadImageToStorage } from "../../../lib/uploadImageToStorage";

export default function EditEventModal({ event, onClose, onDeleted, onUpdated }: {
  event: any,
  onClose: () => void,
  onDeleted: () => void,
  onUpdated: () => void
}) {
  const [form, setForm] = useState({
    title: event.title || "",
    date: event.date || "",
    description: event.description || "",
    image: event.image || "",
    location: event.location || ""
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-4">Esemény szerkesztése</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <input type="text" placeholder="Cím" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="border rounded px-3 py-2" required />
          <input type="date" placeholder="Dátum" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="border rounded px-3 py-2" required />
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2">Kép feltöltése</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded shadow hover:bg-secondary transition-colors">
                Fájl kiválasztása
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {form.image && (
                <div className="bg-gray-100 rounded-lg shadow p-2 flex items-center gap-2">
                  <img src={form.image} alt="Előnézet" className="h-20 w-20 object-cover rounded mr-2 border" />
                  <span className="text-xs text-gray-500">Előnézet</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                    onClick={() => setForm(f => ({ ...f, image: "" }))}
                  >
                    Kép törlése
                  </button>
                </div>
              )}
            </div>
          </div>
          <input type="text" placeholder="Helyszín" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="border rounded px-3 py-2" />
          <textarea placeholder="Leírás" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="border rounded px-3 py-2 min-h-[160px] resize-y" required rows={8} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded font-semibold flex-1" disabled={loading}>Mentés</button>
            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded font-semibold flex-1" onClick={handleDelete} disabled={loading}>Törlés</button>
          </div>
        </form>
      </div>
    </div>
  );
}
