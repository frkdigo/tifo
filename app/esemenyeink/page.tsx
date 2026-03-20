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
              className="bg-blue-900 text-white font-bold px-6 py-2 rounded-[16px] hover:bg-blue-800 transition text-base w-full"
            >
              Érdekel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      {/* HERO CARD */}
      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-8 md:p-12">
          <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 14% -6%, rgba(135,206,235,0.22), transparent 28%), radial-gradient(circle at 88% 8%, rgba(40,167,69,0.18), transparent 25%), radial-gradient(circle at 52% 120%, rgba(13,59,102,0.35), transparent 40%)' }} />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:text-left text-center md:max-w-xl flex-1">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20">
                Törökbálinti Ifjúsági Önkormányzat
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-2">Eseményeink</h1>
              <p className="mt-5 text-white/90 text-lg md:text-xl max-w-3xl leading-[1.58] md:mx-0 mx-auto">
                Kövesd a közelgő programokat, nézd vissza a korábbi eseményeket, és csatlakozz a közösséghez.
              </p>
            </div>
            <div className="flex flex-row md:flex-col gap-4 md:gap-6 items-center justify-center md:justify-end flex-shrink-0">
              <div className="w-32 rounded-2xl border border-white/20 bg-white/10 py-4 text-center">
                <div className="text-2xl font-bold text-white">{upcoming.length}</div>
                <div className="text-xs text-white/80 mt-1">Közelgő</div>
              </div>
              <div className="w-32 rounded-2xl border border-white/20 bg-white/10 py-4 text-center">
                <div className="text-2xl font-bold text-white">{past.length}</div>
                <div className="text-xs text-white/80 mt-1">Korábbi</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* KIEMELT ESEMÉNY */}
      {featuredEvent && (
        <section className="mb-10">
          <div
            onClick={() => setActiveEvent(featuredEvent)}
            className="cursor-pointer rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md grid md:grid-cols-2 min-h-[220px]"
            style={{ minHeight: 220 }}
          >
            {/* Bal oldalt: kép, overlay csak label, cím, dátum */}
            <div className="relative h-56 md:h-full">
              {featuredEvent.image && (
                <>
                  <img
                    src={featuredEvent.image}
                    className="w-full h-full object-cover object-center"
                    alt={featuredEvent.title}
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
              <p className="text-gray-700 mb-6 line-clamp-5 leading-[1.6]">{featuredEvent.description}</p>
              <button className="bg-blue-900 text-white font-bold px-6 py-2 rounded-[16px] hover:bg-blue-800 transition w-full text-base mt-auto">
                Érdekel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* KÖZELGŐ ESEMÉNYEK */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">További események</h2>
        {loading ? (
          <p className="text-gray-500">Betöltés...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.slice(1).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* KORÁBBI ESEMÉNYEK */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-2">Korábbi események</h2>
        {past.length === 0 ? (
          <p className="text-gray-400">Még nincsenek korábbi események.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-black hover:bg-gray-100 transition"
              >
                ✕
              </button>
              {activeEvent.image && (
                <img
                  src={activeEvent.image}
                  className="w-full h-60 object-cover"
                  alt={activeEvent.title}
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-1">{activeEvent.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{new Date(activeEvent.date).toLocaleDateString("hu-HU")}</p>
                <p className="text-gray-700">{activeEvent.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
