"use client";

import { useAuth } from "../components/AuthProvider";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Kapcsolat() {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    <motion.main
      className="max-w-5xl mx-auto py-12 px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.section
        className="relative overflow-hidden rounded-3xl bg-slate-950 border border-white/15 shadow-[0_24px_55px_-30px_rgba(0,0,0,0.55)] p-6 md:p-8 mb-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 14% -6%, rgba(135,206,235,0.22), transparent 28%), radial-gradient(circle at 88% 8%, rgba(40,167,69,0.18), transparent 25%), radial-gradient(circle at 52% 120%, rgba(13,59,102,0.35), transparent 40%)' }} />
        <div className="relative grid md:grid-cols-[1.25fr,0.75fr] gap-6 items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/15 text-white uppercase tracking-[0.18em] text-xs px-4 py-2 mb-4">
              Törökbálinti Ifjúsági Önkormányzat
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">Kapcsolat</h1>
            <p className="text-white/85 mt-3 text-base md:text-lg leading-[1.58] max-w-lg">
              Kérdésed van, csatlakoznál, vagy ötleted van programra? Írj nekünk, és hamarosan válaszolunk.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-white/12 border border-white/25 text-white text-xs font-semibold px-3 py-1.5">Gyors válasz</span>
              <span className="inline-flex items-center rounded-full bg-[#87ceeb]/15 border border-[#87ceeb]/30 text-[#d7f1ff] text-xs font-semibold px-3 py-1.5">Közvetlen kapcsolat</span>
              <span className="inline-flex items-center rounded-full bg-[#28a745]/18 border border-[#28a745]/35 text-[#d8ffe2] text-xs font-semibold px-3 py-1.5">Közösségi csatornák</span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="mailto:info.tifo@gmail.com"
                className="flex items-center gap-4 rounded-2xl bg-[#28a745]/22 border border-[#28a745]/40 px-4 py-3.5 hover:bg-[#87ceeb]/22 hover:border-[#87ceeb]/60 transition-all group"
              >
                <span className="text-2xl shrink-0">✉️</span>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/65 font-semibold">E-mail</div>
                  <div className="font-bold text-white group-hover:text-[#87ceeb] transition-colors">info.tifo@gmail.com</div>
                </div>
              </a>
              <a
                href="https://www.instagram.com/tifo_2008/"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 rounded-2xl bg-[#28a745]/22 border border-[#28a745]/40 px-4 py-3.5 hover:bg-[#87ceeb]/22 hover:border-[#87ceeb]/60 transition-all group"
              >
                <span className="text-2xl shrink-0">📸</span>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/65 font-semibold">Instagram</div>
                  <div className="font-bold text-white group-hover:text-[#87ceeb] transition-colors">@tifo_2008</div>
                </div>
              </a>
            </div>
          </div>
          <div className="w-fit mx-auto">
            <img
              src="/images/logo.jpg"
              alt="TIFO logó"
              className="w-full max-w-[240px] h-[240px] mx-auto object-cover rounded-full border border-white/35 bg-white p-2"
            />
          </div>
        </div>
      </motion.section>
      <motion.section
        className="rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] border border-gray-200 shadow-[0_18px_45px_-28px_rgba(13,59,102,0.22)] p-6 md:p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      >
        <p className="section-label">Kapcsolatfelvétel</p>
        <h2 className="text-2xl md:text-3xl font-black text-tifo-dark mb-6">Írj nekünk!</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-gray-700">
            Név
            <input
              type="text"
              name="name"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
              required
            />
          </label>
          <label className="text-sm font-semibold text-gray-700">
            Email
            <input
              type="email"
              name="email"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
              required
            />
          </label>
          <label className="text-sm font-semibold text-gray-700">
            Üzenet
            <textarea
              name="message"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
              rows={5}
              required
            />
          </label>
          <button
            type="submit"
            className="inline-flex justify-center items-center gap-2 rounded-full bg-blue-900 text-white font-black px-8 py-3.5 hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={sending}
          >
            {sending ? "Küldés..." : (
              <>
                Üzenet küldése
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </>
            )}
          </button>
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </motion.section>
    </motion.main>
  );
}
                className="flex items-center gap-4 rounded-2xl bg-[#28a745]/22 border border-[#28a745]/40 px-4 py-3.5 hover:bg-[#87ceeb]/22 hover:border-[#87ceeb]/60 transition-all group"
              >
                <span className="text-2xl shrink-0">✉️</span>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/65 font-semibold">E-mail</div>
                  <div className="font-bold text-white group-hover:text-[#87ceeb] transition-colors">info.tifo@gmail.com</div>
                </div>
              </a>
              <a
                href="https://www.instagram.com/tifo_2008/"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 rounded-2xl bg-[#28a745]/22 border border-[#28a745]/40 px-4 py-3.5 hover:bg-[#87ceeb]/22 hover:border-[#87ceeb]/60 transition-all group"
              >
                <span className="text-2xl shrink-0">📸</span>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/65 font-semibold">Instagram</div>
                  <div className="font-bold text-white group-hover:text-[#87ceeb] transition-colors">@tifo_2008</div>
                </div>
              </a>
            </div>
          </div>

           <div className="w-fit mx-auto">
             <img
               src="/images/logo.jpg"
               alt="TIFO logó"
               className="w-full max-w-[240px] h-[240px] mx-auto object-cover rounded-full border border-white/35 bg-white p-2"
             />
           </div>
        </div>

      <motion.section
        className="rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] border border-gray-200 shadow-[0_18px_45px_-28px_rgba(13,59,102,0.22)] p-6 md:p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      >
        <p className="section-label">Kapcsolatfelvétel</p>
        <h2 className="text-2xl md:text-3xl font-black text-tifo-dark mb-6">Írj nekünk!</h2>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-gray-700">
            Név
            <input
              type="text"
              name="name"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
              required
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            Email
            <input
              type="email"
              name="email"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
              required
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            Üzenet
            <textarea
              name="message"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
              rows={5}
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex justify-center items-center gap-2 rounded-full bg-blue-900 text-white font-black px-8 py-3.5 hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={sending}
          >
            {sending ? "Küldés..." : (
              <>
                Üzenet küldése
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </>
            )}
          </button>
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </section>

    </motion.main>
  );
}
