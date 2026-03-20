"use client";

import { useEffect, useState, useMemo } from "react";
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

  const featuredEvent = useMemo(() => {
    return events.length > 0 ? events[0] : null;
  }, [events]);

  const timelineEvents = useMemo(() => {
    return events.slice(1);
  }, [events]);

  return (
    <main className="relative overflow-hidden bg-white text-black">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(15,23,42,0.22),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_34%,#f6f9fc_34%,#ffffff_100%)]" />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
          Eseményeink
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Fedezd fel legközelebbi eseményünket és az idővonalon a többi programot.
        </p>
      </section>

      {/* FEATURED EVENT */}
      {featuredEvent && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5 }}
            onClick={() => setActiveEvent(featuredEvent)}
            className="cursor-pointer relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.8)]"
          >
            {featuredEvent.image && (
              <img
                src={featuredEvent.image}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            <div className="relative p-10 md:p-14 text-white max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#87ceeb]">
                Kiemelt esemény
              </span>

              <h2 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
                {featuredEvent.title}
              </h2>

              <p className="mt-4 text-white/80">
                {featuredEvent.description}
              </p>

              <p className="mt-4 text-sm text-white/60">
                📅 {new Date(featuredEvent.date).toLocaleDateString("hu-HU")}
              </p>

              <button className="mt-6 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                Részletek →
              </button>
            </div>
          </motion.div>
        </section>
      )}

      {/* TIMELINE */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-black mb-10 text-center">
          Idővonal
        </h2>

        <div className="relative border-l border-gray-300 pl-6 space-y-10">

          {loading ? (
            <p>Betöltés...</p>
          ) : (
            timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setActiveEvent(event)}
                className="relative cursor-pointer group"
              >
                {/* DOT */}
                <div className="absolute -left-[34px] top-2 w-4 h-4 bg-blue-900 rounded-full border-4 border-white shadow-md group-hover:scale-125 transition" />

                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <p className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString("hu-HU")}
                  </p>

                  <h3 className="text-lg font-bold mt-1">
                    {event.title}
                  </h3>

                  {event.location && (
                    <p className="text-sm text-gray-500">
                      📍 {event.location}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))
          )}

        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {activeEvent.image && (
                <img
                  src={activeEvent.image}
                  className="w-full h-60 object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-2xl font-black">
                  {activeEvent.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(activeEvent.date).toLocaleDateString("hu-HU")}
                </p>

                <p className="mt-4 text-gray-700 leading-relaxed">
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
