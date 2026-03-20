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
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.55, ease: [0.4, 0.2, 0.2, 1] }}
        whileHover={{ scale: 1.05, y: -4, boxShadow: "0 8px 32px 0 rgba(80,0,120,0.10)" }}
        className="relative rounded-3xl overflow-hidden shadow-xl group bg-white/80 backdrop-blur-md border border-gray-200 transition-all duration-300 hover:shadow-2xl cursor-pointer"
        style={{ willChange: 'transform, box-shadow' }}
        onClick={onSelect}
      >
        {event.image && (
          <div className="relative h-56 w-full overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-700/60 via-pink-500/20 to-transparent" />
          </div>
        )}
        <div className="p-6 flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm text-white">
              {event.category || "Esemény"}
            </span>
            <span className="text-xs text-gray-500 ml-auto">
              {new Date(event.date).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-1 line-clamp-2 drop-shadow-sm">
            {event.title}
          </h3>
          {event.location && (
            <p className="text-sm text-purple-600 font-semibold mb-1">📍 {event.location}</p>
          )}
          {event.description && (
            <p className="text-gray-600 text-base line-clamp-3 mb-4">{event.description}</p>
          )}
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-6 py-2 rounded-xl shadow-md transition-all duration-300 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Érdekel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-white via-[#f6f2ff] to-[#fbeaff] text-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(168,85,247,0.08),transparent_40%),linear-gradient(180deg,#f6f2ff_0%,#fbeaff_100%)]" />

      {/* HERO szekció - premium, parallax, animated gradient, better typography */}
      <motion.header
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0.2, 0.2, 1] }}
        className="max-w-4xl mx-auto px-4 pt-14 md:pt-20 pb-12 text-center relative overflow-hidden rounded-3xl border border-white/20 bg-slate-950 shadow-[0_30px_70px_-40px_rgba(80,0,120,0.25)] mb-12"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="w-full h-full bg-gradient-to-br from-purple-700/80 via-pink-500/40 to-transparent opacity-90"
          />
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.4, 0.2, 0.2, 1] }}
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImages[current]})`, willChange: 'transform' }}
          />
        </div>
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20 backdrop-blur-md"
          >
            Törökbálinti Ifjúsági Önkormányzat
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black leading-tight text-white drop-shadow-lg mb-3"
          >
            Eseményeink
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-5 text-white/90 text-lg md:text-2xl max-w-3xl leading-[1.58] mx-auto font-medium drop-shadow"
          >
            Fedezd fel a legjobb bulikat, programokat és rendezvényeket! Válassz, és éld át a felejthetetlen élményeket!
          </motion.p>
        </div>
      </motion.header>

      {/* Kártyák gridje külön szekcióban, glassmorphism, fade-in, masonry */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {loading ? (
            <motion.p className="text-gray-400 col-span-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Betöltés...</motion.p>
          ) : error ? (
            <motion.p className="text-red-400 col-span-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>
          ) : events.length === 0 ? (
            <motion.p className="text-gray-400 col-span-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Nincs esemény.</motion.p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={() => setActiveEvent(event)}
              />
            ))
          )}
        </motion.div>
      </section>

      {/* Modal - glass, premium, animated */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[5px] p-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveEvent(null)}
          >
            <motion.div
              className="w-full max-w-2xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200 relative"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.4, 0.2, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-400 to-pink-300" />
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl leading-none bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-gray-200"
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
                    className="w-full h-72 object-cover rounded-2xl mb-6 shadow"
                  />
                )}
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-1">{activeEvent.title}</h2>
                {activeEvent.location && <p className="mt-1 text-purple-600 font-semibold">{activeEvent.location}</p>}
                <p className="mt-2 text-gray-500 text-sm">{new Date(activeEvent.date).toLocaleDateString("hu-HU")}</p>
                {activeEvent.description && <p className="mt-5 text-gray-700 text-lg leading-relaxed">{activeEvent.description}</p>}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => navigateEvent(-1)}
                    className="px-5 py-2.5 rounded-xl border border-purple-200 bg-white/70 text-purple-700 hover:bg-purple-50 transition-colors font-semibold shadow-sm"
                  >
                    Előző esemény
                  </button>
                  <span className="text-sm text-gray-400">{activeIndex + 1} / {events.length}</span>
                  <button
                    type="button"
                    onClick={() => navigateEvent(1)}
                    className="px-5 py-2.5 rounded-xl border border-pink-200 bg-white/70 text-pink-600 hover:bg-pink-50 transition-colors font-semibold shadow-sm"
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