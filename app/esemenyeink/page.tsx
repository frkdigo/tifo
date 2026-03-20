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

  const heroImages = [
    "/images/herokep_1.jpg",
    "/images/herokep_2.jpg",
    "/images/herokep_3.jpg",
    "/images/herokep_4.jpg",
    "/images/herokep_5.jpg",
    "/images/herokep_6.jpg",
    "/images/herokep_7.jpg",
    "/images/herokep_8.jpg",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setCurrent((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearTimeout(timeout);
  }, [current]);

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

  function EventCard({ event, onSelect }: {
    event: EventItem;
    onSelect: () => void;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: [0.4, 0.2, 0.2, 1] }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative rounded-xl overflow-hidden shadow-sm group bg-white border border-gray-200 transition-all duration-200 hover:shadow-md cursor-pointer"
        style={{ willChange: 'transform, box-shadow' }}
        onClick={onSelect}
      >
        {event.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-400"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
          </div>
        )}
        <div className="p-5 flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest border border-gray-200">
              {event.category || "Esemény"}
            </span>
            <span className="text-xs text-gray-400 ml-auto">
              {new Date(event.date).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-tifo-dark mb-1 line-clamp-2">
            {event.title}
          </h3>
          {event.location && (
            <p className="text-xs text-gray-500 mb-1">📍 {event.location}</p>
          )}
          {event.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">{event.description}</p>
          )}
          <div className="flex justify-center mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className="inline-flex justify-center items-center gap-2 rounded-full bg-blue-900 text-white font-black px-6 py-2 hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              Érdekel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">

      {/* HERO szekció - egységes, világos, site style */}
      <header className="mb-10">
        <p className="section-label">Események</p>
        <h1 className="text-3xl md:text-5xl font-black text-tifo-dark mb-3">Eseményeink</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Fedezd fel a legjobb bulikat, programokat és rendezvényeket! Válassz, és éld át a felejthetetlen élményeket!
        </p>
      </header>

      {/* Kártyák gridje - egységes site style, masonry */}
      <section className="mt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-400 col-span-full text-center">Betöltés...</p>
          ) : error ? (
            <p className="text-red-400 col-span-full text-center">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center">Nincs esemény.</p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={() => setActiveEvent(event)}
              />
            ))
          )}
        </div>
      </section>

      {/* Modal - egységes, világos, letisztult */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] p-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveEvent(null)}
          >
            <motion.div
              className="w-full max-w-2xl rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200 relative"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0.2, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-900 text-2xl leading-none bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-gray-200"
                onClick={() => setActiveEvent(null)}
                aria-label="Bezárás"
              >
                &times;
              </button>
              <div className="p-7">
                {activeEvent.image && (
                  <img
                    src={activeEvent.image}
                    alt={activeEvent.title}
                    className="w-full h-64 object-cover rounded-xl mb-6 shadow-sm"
                  />
                )}
                <h2 className="text-2xl md:text-3xl font-black text-tifo-dark leading-tight mb-1">{activeEvent.title}</h2>
                {activeEvent.location && <p className="mt-1 text-gray-500 text-sm">{activeEvent.location}</p>}
                <p className="mt-2 text-gray-400 text-xs">{new Date(activeEvent.date).toLocaleDateString("hu-HU")}</p>
                {activeEvent.description && <p className="mt-5 text-gray-700 text-base leading-relaxed">{activeEvent.description}</p>}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => navigateEvent(-1)}
                    className="inline-flex justify-center items-center gap-2 rounded-full bg-blue-900 text-white font-black px-5 py-2 hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
                  >
                    Előző esemény
                  </button>
                  <span className="text-sm text-gray-400">{activeIndex + 1} / {events.length}</span>
                  <button
                    type="button"
                    onClick={() => navigateEvent(1)}
                    className="inline-flex justify-center items-center gap-2 rounded-full bg-blue-900 text-white font-black px-5 py-2 hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
                  >
                    Következő esemény
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