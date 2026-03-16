"use client";

import { useAuth } from "../components/AuthProvider";

import { useState } from "react";

export default function Kapcsolat() {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSuccess(null);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSuccess("Üzenet sikeresen elküldve!");
        form.reset();
      } else {
        const data = await res.json();
        setError(data.error || "Hiba történt az üzenet küldésekor.");
      }
    } catch {
      setError("Hálózati hiba történt.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      {/* Logó a kör alakú kép helyén, a tetejéről eltávolítva */}
      <section className="rounded-3xl premium-surface p-6 md:p-8 mb-6">
        <div className="grid md:grid-cols-[1.25fr,0.75fr] gap-6 items-center">
          <div>
            <p className="inline-flex rounded-full bg-slate-900 text-sky-200 uppercase tracking-[0.18em] text-xs px-4 py-2 mb-4">
              Törökbálinti Ifjúsági Önkormányzat
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900">Kapcsolat</h1>
            <p className="text-slate-600 mt-3 leading-relaxed">
              Kérdésed van, csatlakoznál, vagy ötleted van programra? Írj nekünk, és hamarosan válaszolunk.
            </p>

            <div className="mt-5 space-y-2 text-slate-700">
              <p>
                Email: <a href="mailto:info@tifo.hu" className="text-slate-900 font-semibold hover:underline">info@tifo.hu</a>
              </p>
              <p>
                Instagram: <a href="https://www.instagram.com/tifo_2008/" target="_blank" rel="noopener" className="text-slate-900 font-semibold hover:underline">@tifo_2008</a>
              </p>
            </div>
          </div>

           <div className="w-fit mx-auto">
             <img
               src="/images/logo.png"
               alt="TIFO logó"
               className="w-full max-w-[240px] h-[240px] mx-auto object-cover rounded-full border border-slate-500/60 bg-white p-2"
             />
           </div>
        </div>
      </section>

      <section className="rounded-3xl premium-surface p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">Üzenetküldés</h2>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-700">
            Név
            <input
              type="text"
              name="name"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              name="email"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Üzenet
            <textarea
              name="message"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              rows={5}
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex justify-center items-center rounded-xl bg-slate-900 text-white font-semibold px-6 py-3 hover:bg-slate-800 transition-colors"
            disabled={sending}
          >
            {sending ? "Küldés..." : "Küldés"}
          </button>
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </section>
    </main>
  );
}
