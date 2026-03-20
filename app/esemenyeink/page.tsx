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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        {event.image && (
          <div className="h-48 w-full overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-5 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-gray-400">
            {event.category || "Esemény"}
          </span>

          <h3 className="text-lg font-bold text-gray-900">
            {event.title}
          </h3>

          {event.location && (
            <p className="text-sm text-gray-500">📍 {event.location}</p>
          )}

          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString("hu-HU")}
          </p>

          <p className="text-sm text-gray-600 line-clamp-3">
            {event.description}
          </p>

          <div className="flex justify-center mt-3">
            <button
              onClick={() => setActiveEvent(event)}
              className="bg-blue-900 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
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

      {/* HEADER (visszaállítva) */}
      <header className="mb-10">
        <p className="section-label">Események</p>
        <h1 className="text-3xl md:text-5xl font-black text-tifo-dark mb-3">
          Eseményeink
        </h1>

        <p className="mt-2 text-gray-600 max-w-2xl">
          Fedezd fel a legjobb programokat és eseményeket. Válassz, és csatlakozz hozzánk!
        </p>
      </header>

      {/* KIEMELT ESEMÉNY */}
      {featuredEvent && (
        <section className="mb-12">
          <div
            onClick={() => setActiveEvent(featuredEvent)}
            className="cursor-pointer relative rounded-3xl overflow-hidden shadow-lg border border-gray-200"
          >
            {featuredEvent.image && (
              <img
                src={featuredEvent.image}
                className="w-full h-72 object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 text-white max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#87ceeb]">
                Kiemelt esemény
              </span>

              <h2 className="text-3xl font-black mt-2">
                {featuredEvent.title}
              </h2>

              <p className="text-white/80 mt-2">
                {featuredEvent.description}
              </p>

              <button className="mt-4 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                Érdekel →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* KÁRTYÁK */}
      <section>
        {loading ? (
          <p className="text-gray-500">Betöltés...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">Nincs esemény.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              // ne duplázza a kiemeltet
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
              className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
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

                {activeEvent.location && (
                  <p className="text-sm text-gray-500">
                    📍 {activeEvent.location}
                  </p>
                )}

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
