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

  function openEvent(event: EventItem) {
    setActiveEvent(event);
  }

  function closeModal() {
    setActiveEvent(null);
  }

  return (
    <main className="relative overflow-hidden bg-white text-black">
      {/* BACKGROUND (ugyanaz mint Rólunk) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(15,23,42,0.22),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_34%,#f6f9fc_34%,#ffffff_100%)]" />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-8 md:p-12 text-center">
          <div
            className="absolute inset-0 opacity-80 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 14% -6%, rgba(135,206,235,0.22), transparent 28%), radial-gradient(circle at 88% 8%, rgba(40,167,69,0.18), transparent 25%), radial-gradient(circle at 52% 120%, rgba(13,59,102,0.35), transparent 40%)",
            }}
          />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20">
              TIFO
            </p>

            <h1 className="text-4xl md:text-6xl font-black text-white">
              Eseményeink
            </h1>

            <p className="mt-5 text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
              Fedezd fel programjainkat, eseményeinket és közösségi alkalmainkat.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="section-label">Programok</p>
        <h2 className="text-3xl md:text-4xl font-black text-tifo-dark mb-6">
          Közelgő események
        </h2>

        {loading ? (
          <p className="text-gray-500">Betöltés...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">Nincs esemény.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <motion.article
                key={event.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => openEvent(event)}
                className="group cursor-pointer rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_16px_35px_-26px_rgba(15,23,42,0.4)] hover:shadow-[0_24px_45px_-24px_rgba(13,59,102,0.28)] transition-all duration-200"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-[1.03] transition-transform"
                  />
                )}

                <span className="text-xs uppercase tracking-wider text-gray-400">
                  {event.category || "Esemény"}
                </span>

                <h3 className="font-bold text-lg text-black mt-1">
                  {event.title}
                </h3>

                {event.location && (
                  <p className="text-sm text-gray-500">
                    📍 {event.location}
                  </p>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  {new Date(event.date).toLocaleDateString("hu-HU")}
                </p>

                <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                  {event.description}
                </p>

                <button className="mt-4 text-sm font-semibold text-blue-900 hover:underline">
                  Részletek →
                </button>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px] p-4 flex items-center justify-center"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-[1.75rem] overflow-hidden bg-white shadow-[0_30px_80px_-35px_rgba(0,0,0,0.55)] border border-slate-200"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="p-6">
                <h2 className="text-2xl font-black">
                  {activeEvent.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(activeEvent.date).toLocaleDateString("hu-HU")}
                </p>

                {activeEvent.location && (
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {activeEvent.location}
                  </p>
                )}

                {activeEvent.image && (
                  <img
                    src={activeEvent.image}
                    className="w-full h-60 object-cover rounded-xl mt-4"
                  />
                )}

                <p className="mt-4 text-gray-700 leading-[1.6]">
                  {activeEvent.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
