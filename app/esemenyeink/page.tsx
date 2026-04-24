"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type EventItem = {
  id: number;
  title: string;
  date: string;
  description?: string;
  image?: string | null;
  location?: string | null;
  category?: string;
};

export default function Esemeneink() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const res = await fetch("/api/events", { cache: "no-store" });
    const data = await res.json();

    setEvents(
      Array.isArray(data)
        ? data.sort(
            (a: EventItem, b: EventItem) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        : []
    );

    setLoading(false);
  }

  // Szétválogatás: közelgő és korábbi események
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.date) >= now);
  const past = events.filter(e => new Date(e.date) < now);
  const featuredEvent = upcoming[0];

  function EventCard({ event }: { event: EventItem }) {
    return (
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        {event.image && (
          <img
            src={event.image}
            className="w-full h-44 object-cover"
            alt={event.title}
          />
        )}
        <div className="p-5 flex flex-col gap-2">
          <h3 className="text-lg font-bold mb-1">{event.title}</h3>
          <p className="text-sm text-gray-500 mb-1">{new Date(event.date).toLocaleDateString("hu-HU")}</p>
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">{event.description}</p>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setActiveEvent(event)}
              className="bg-black text-white font-bold px-6 py-2 rounded-[16px] hover:bg-neutral-800 transition text-base w-full"
            >
              Érdekel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 py-8 md:py-12">

      {/* HERO CARD */}
      <motion.section
        className="w-full px-0 pt-8 md:pt-14 pb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0.2, 0.2, 1] }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0a174e] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-6 md:p-12 mx-0">
          <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true" style={{ background: '#0a174e' }} />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0">
            <div className="md:text-left text-center md:max-w-xl flex-1">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20">
                Törökbálinti Ifjúsági Önkormányzat
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-2">Eseményeink</h1>
              <p className="mt-5 text-white/90 text-lg md:text-xl max-w-3xl leading-[1.58] md:mx-0 mx-auto">
                Kövesd a közelgő programokat, nézd vissza a korábbi eseményeket, és csatlakozz a közösséghez.
              </p>
            </div>
            <div className="flex flex-row md:flex-col items-center justify-center md:justify-end flex-shrink-0 md:ml-12 mt-8 md:mt-0 w-full md:w-auto">
              <div className="flex flex-row md:flex-col gap-3 md:gap-6 w-full md:w-auto justify-center">
                <div className="flex-1 md:w-32 rounded-2xl border border-white/20 bg-white/10 py-4 text-center min-w-[120px]">
                  <div className="text-2xl font-bold text-white">{upcoming.length}</div>
                  <div className="text-xs text-white/80 mt-1">Közelgő</div>
                </div>
                <div className="w-px h-10 bg-white/20 self-center hidden md:block" />
                <div className="flex-1 md:w-32 rounded-2xl border border-white/20 bg-white/10 py-4 text-center min-w-[120px]">
                  <div className="text-2xl font-bold text-white">{past.length}</div>
                  <div className="text-xs text-white/80 mt-1">Korábbi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>


      {/* KIEMELT ESEMÉNY */}
      {featuredEvent && (
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div
            onClick={() => setActiveEvent(featuredEvent)}
            className="cursor-pointer rounded-3xl overflow-hidden border border-slate-200 bg-white dark:bg-slate-900 shadow-[0_16px_40px_-18px_rgba(56,189,248,0.10)] grid md:grid-cols-2 min-h-[220px] group hover:scale-[1.015] transition-transform duration-200"
            style={{ minHeight: 220 }}
          >
            {/* Bal oldalt: kép, overlay csak label, cím, dátum */}
            <div className="relative h-56 md:h-full">
              {featuredEvent.image && (
                <>
                  <img
                    src={featuredEvent.image}
                    className="w-full h-full object-cover object-center group-hover:brightness-95 transition-all duration-200"
                    alt={featuredEvent.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-white font-bold mb-1 drop-shadow">KIEMELT ESEMÉNY</span>
                    <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow mb-0.5">{featuredEvent.title}</h2>
                    <p className="text-sm text-gray-200 drop-shadow">{new Date(featuredEvent.date).toLocaleDateString("hu-HU")}</p>
                  </div>
                </>
              )}
            </div>
            {/* Jobb oldalt: csak leírás és gomb */}
            <div className="flex flex-col justify-center p-6 md:p-8 bg-white">
              <p className="text-slate-700 dark:text-slate-200 mb-6 line-clamp-5 leading-[1.6]">{featuredEvent.description}</p>
              <button className="bg-black text-white font-bold px-6 py-2 rounded-2xl hover:bg-neutral-800 transition w-full text-base mt-auto shadow-sm">
                Érdekel
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* KÖZELGŐ ESEMÉNYEK */}
      <section className="mb-14">
        <h2 className="text-lg md:text-2xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">További események</h2>
        {loading ? (
          <p className="text-gray-500">Betöltés...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8 xl:gap-10">
            {upcoming.slice(1).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* KORÁBBI ESEMÉNYEK */}
      <section className="mb-10">
        <h2 className="text-lg md:text-2xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">Korábbi események</h2>
        {past.length === 0 ? (
          <p className="text-gray-400">Még nincsenek korábbi események.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8 xl:gap-10">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
            onClick={() => setActiveEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white w-full max-w-xs sm:max-w-2xl rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-200 max-h-[70vh] sm:max-h-[80vh] flex flex-col"
              style={{ boxSizing: 'border-box' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-black hover:bg-gray-100 transition"
                style={{ top: 8, right: 8 }}
              >
                ✕
              </button>
              {activeEvent.image && (
                <img
                  src={activeEvent.image}
                  className="w-full h-32 sm:h-60 object-cover cursor-zoom-in"
                  alt={activeEvent.title}
                  onClick={() => setImagePreview(activeEvent.image!)}
                />
              )}
              <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0">
                <h2 className="text-lg sm:text-2xl font-bold mb-2">{activeEvent.title}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <span className="text-xs sm:text-sm text-gray-500">{new Date(activeEvent.date).toLocaleDateString("hu-HU")}</span>
                  {activeEvent.location && (
                    <span className="text-xs sm:text-sm text-gray-400 sm:ml-4">Helyszín: {activeEvent.location}</span>
                  )}
                </div>
                {activeEvent.description && (
                  <div className="prose prose-sm sm:prose-base max-w-none text-gray-800">
                    {activeEvent.description.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Fullscreen image preview */}
        {imagePreview && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImagePreview(null)}
          >
            <img
              src={imagePreview}
              alt="Esemény borítókép nagyban"
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border-2 border-white"
              onClick={e => { e.stopPropagation(); setImagePreview(null); }}
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow text-gray-700 text-3xl hover:bg-white"
              aria-label="Bezárás"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
