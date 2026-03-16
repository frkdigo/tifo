"use client";

import { useAuth } from "../../../app/components/AuthProvider";

export default function Kapcsolat() {
  const { user } = useAuth();

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
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
                Email: <a href="mailto:info.tifo@gmail.com" className="text-slate-900 font-semibold hover:underline">info@tifo.hu</a>
              </p>
              <p>
                Instagram: <a href="https://www.instagram.com/tifo_2008/" target="_blank" rel="noopener" className="text-slate-900 font-semibold hover:underline">@tifo_2008</a>
              </p>
            </div>
          </div>

          <div className="w-fit mx-auto">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Saját profilkép"
                className="w-full max-w-[240px] h-[240px] mx-auto object-cover rounded-full border border-slate-500/60"
              />
            ) : (
              <img
                src="/images/logo.jpg"
                alt="TIFO logó"
                className="w-full max-w-[240px] h-[240px] mx-auto object-cover rounded-full border border-slate-500/60"
              />
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl premium-surface p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">Üzenetküldés</h2>

        <form className="grid gap-4">
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
          >
            Küldés
          </button>
        </form>
      </section>
    </main>
  );
}
