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
      {/* HERO */}
      <motion.section
        className="relative overflow-hidden rounded-3xl bg-slate-950 border border-white/15 shadow-[0_24px_55px_-30px_rgba(0,0,0,0.55)] p-6 md:p-8 mb-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 opacity-80 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 14% -6%, rgba(135,206,235,0.22), transparent 28%), radial-gradient(circle at 88% 8%, rgba(40,167,69,0.18), transparent 25%), radial-gradient(circle at 52% 120%, rgba(13,59,102,0.35), transparent 40%)",
          }}
        />

        <div className="relative grid md:grid-cols-[1.25fr,0.75fr] gap-6 items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/15 text-white uppercase tracking-[0.18em] text-xs px-4 py-2 mb-4">
              Törökbálinti Ifjúsági Önkormányzat
            </p>

            <h1 className="text-4xl md:text-6xl font-black text-white">
              Kapcsolat
            </h1>

            <p className="text-white/85 mt-3 max-w-lg">
              Kérdésed van, csatlakoznál, vagy ötleted van programra? Írj nekünk!
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="mailto:info.tifo@gmail.com"
                className="flex items-center gap-4 rounded-2xl bg-[#28a745]/22 border border-[#28a745]/40 px-4 py-3.5 hover:bg-[#87ceeb]/22 transition-all group"
              >
                <span>✉️</span>
                <div>
                  <div className="text-xs text-white/60">E-mail</div>
                  <div className="font-bold text-white group-hover:text-[#87ceeb]">
                    info.tifo@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/tifo_2008/"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 rounded-2xl bg-[#28a745]/22 border border-[#28a745]/40 px-4 py-3.5 hover:bg-[#87ceeb]/22 transition-all group"
              >
                <span>📸</span>
                <div>
                  <div className="text-xs text-white/60">Instagram</div>
                  <div className="font-bold text-white group-hover:text-[#87ceeb]">
                    @tifo_2008
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="w-fit mx-auto">
            <img
              src="/images/logo.jpg"
              alt="TIFO logó"
              className="w-full max-w-[240px] h-[240px] rounded-full border border-white/35 bg-white p-2"
            />
          </div>
        </div>
      </motion.section>

      {/* FORM */}
      <motion.section
        className="rounded-3xl bg-white border p-6 md:p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-black mb-6">Írj nekünk!</h2>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input name="name" placeholder="Név" required />
          <input name="email" type="email" placeholder="Email" required />
          <textarea name="message" rows={5} placeholder="Üzenet" required />

          <button disabled={sending}>
            {sending ? "Küldés..." : "Üzenet küldése"}
          </button>

          {success && <div className="text-green-600">{success}</div>}
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </motion.section>
    </motion.main>
  );
}