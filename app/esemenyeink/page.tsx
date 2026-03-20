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

  const featuredEvent = events[0];

  function EventCard({ event }: { event: EventItem }) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
      >
        {event.image && (
          <img
            src={event.image}
            className="w-full h-44 object-cover"
          />
        )}

        <div className="p-5 flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-400">
            {event.category || "Esemény"}
          </span>

          <h3 className="text-lg font-bold">{event.title}</h3>

          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString("hu-HU")}
          </p>

          <p className="text-sm text-gray-600 line-clamp-3">
            {event.description}
          </p>

          <div className="flex justify-center mt-3">
            <button
              onClick={() => setActiveEvent(event)}
              className="bg-blue-900 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-800 transition text-sm"
            >
              Érdekel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">

      {/* HEADER */}
      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-10 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-10 md:p-14">
          <h1 className="text-4xl md:text-6xl font-black text-white">
            Eseményeink
          </h1>

          <div className="w-20 h-1 bg-white/70 mx-auto my-6" />

          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Fedezd fel legfrissebb eseményeinket és csatlakozz hozzánk!
          </p>
        </div>
      </section>

      {/* KIEMELT ESEMÉNY */}
      {featuredEvent && (
        <section className="mb-14">
          <div
            onClick={() => setActiveEvent(featuredEvent)}
            className="cursor-pointer grid md:grid-cols-2 overflow-hidden rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition"
          >
            {/* KÉP */}
            <div className="h-64 md:h-auto">
              {featuredEvent.image && (
                <img
                  src={featuredEvent.image}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* SZÖVEG */}
            <div className="bg-white p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#87ceeb]">
                  Kiemelt esemény
                </span>

                <h2 className="text-2xl md:text-3xl font-black mt-2">
                  {featuredEvent.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(featuredEvent.date).toLocaleDateString("hu-HU")}
                </p>

                <p className="text-gray-600 mt-4 line-clamp-4 leading-[1.6]">
                  {featuredEvent.description}
                </p>
              </div>

              <div className="mt-6">
                <button className="bg-blue-900 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-800 transition">
                  Érdekel →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LISTA */}
      <section>
        {loading ? (
          <p className="text-gray-500">Betöltés...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              if (index === 0) return null;
              return <EventCard key={event.id} event={event} />;
            })}
          </div>
        )}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              {/* ❌ X GOMB */}
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-black hover:bg-gray-100 transition"
                aria-label="Bezárás"
              >
                ✕
              </button>

              {activeEvent.image && (
                <img
                  src={activeEvent.image}
                  className="w-full h-60 object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-2xl font-bold">
                  {activeEvent.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(activeEvent.date).toLocaleDateString("hu-HU")}
                </p>

                <p className="mt-4 text-gray-700">
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
