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
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();

      setEvents(
        data.sort(
          (a: EventItem, b: EventItem) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
    } catch {
      setError("Hiba történt az események betöltése közben.");
    }
    setLoading(false);
  }

  const activeIndex = useMemo(() => {
    if (!activeEvent) return -1;
    return events.findIndex((e) => e.id === activeEvent.id);
  }, [activeEvent, events]);

  function navigateEvent(direction: -1 | 1) {
    if (!activeEvent || events.length === 0) return;
    const currentIndex = events.findIndex((e) => e.id === activeEvent.id);
    const nextIndex = (currentIndex + direction + events.length) % events.length;
    setActiveEvent(events[nextIndex]);
  }

  function EventCard({ event }: { event: EventItem }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        onClick={() => setActiveEvent(event)}
        className="cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
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

        <div className="p-6 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-gray-400">
            {event.category || "Esemény"}
          </span>

          <h3 className="text-lg font-bold text-gray-900 leading-snug">
            {event.title}
          </h3>

          {event.location && (
            <p className="text-sm text-gray-500">📍 {event.location}</p>
          )}

          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString("hu-HU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <p className="text-sm text-gray-600 line-clamp-3 mt-2">
            {event.description}
          </p>

          <button className="mt-4 text-sm font-semibold text-blue-900 hover:underline self-start">
            Részletek →
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">

      {/* HEADER – mint Rólunk oldal */}
      <section className="mb-12 text-center">
        <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
          Események
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900">
          Eseményeink
        </h1>

        <div className="w-20 h-1 bg-blue-900 mx-auto my-6" />

        <p className="text-gray-600 max-w-2xl mx-auto">
          Fedezd fel legújabb eseményeinket, programjainkat és élményeinket.
          Válassz egy eseményt, és nézd meg a részleteket!
        </p>
      </section>

      {/* CONTENT */}
      <section>
        {loading ? (
          <p className="text-center text-gray-400">Betöltés...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-400">Nincs esemény.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {activeEvent.title}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  {new Date(activeEvent.date).toLocaleDateString("hu-HU")}
                </p>

                {activeEvent.location && (
                  <p className="text-sm text-gray-500 mb-4">
                    📍 {activeEvent.location}
                  </p>
                )}

                <p className="text-gray-700">
                  {activeEvent.description}
                </p>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => navigateEvent(-1)}
                    className="px-4 py-2 bg-blue-900 text-white rounded-full text-sm"
                  >
                    Előző
                  </button>

                  <span className="text-sm text-gray-400">
                    {activeIndex + 1} / {events.length}
                  </span>

                  <button
                    onClick={() => navigateEvent(1)}
                    className="px-4 py-2 bg-blue-900 text-white rounded-full text-sm"
                  >
                    Következő
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
