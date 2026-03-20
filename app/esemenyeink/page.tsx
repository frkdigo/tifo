"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type EventItem = {
  id: number;
  title: string;
  date: string;
  description?: string;
  image?: string | null;
  location?: string | null;
};

function EventCard({ event, onClick }: { event: EventItem; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col rounded-xl shadow-lg overflow-hidden bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {event.image && (
        <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-2 font-medium">
          {new Date(event.date).toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        {event.description && (
          <p className="text-gray-700 flex-1 mb-4 line-clamp-3">{event.description}</p>
        )}
        <button className="mt-auto inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200 hover:from-blue-700 hover:to-blue-500 hover:scale-105 focus:outline-none">
          Tovább
        </button>
      </div>
    </div>
  );
}

export default function Esemeneink() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events"); // Backend API endpoint
      const data = await res.json();
      setEvents(
        data.sort(
          (a: EventItem, b: EventItem) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
    } catch {
      setError("Nem sikerült betölteni az eseményeket.");
    }
    setLoading(false);
  }

  const nextEvent = events.find((e) => new Date(e.date) >= new Date());

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-black py-12">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <motion.div
          className="relative rounded-3xl bg-white/90 shadow-2xl border border-blue-200 px-8 py-12 flex flex-col items-center overflow-hidden"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="mb-4 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold tracking-widest uppercase shadow-lg">
            TiFO események
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-blue-600 mb-4 text-center">Eseményeink</h1>
          <p className="text-lg md:text-xl text-slate-700 text-center max-w-2xl font-medium">
            Fedezd fel legújabb közösségi eseményeinket! Kattints a <span className="font-bold text-blue-500">"Tovább"</span> gombra a részletekért.
          </p>
        </motion.div>
      </section>

      {/* Közelgő esemény */}
      {nextEvent && (
        <section className="max-w-3xl mx-auto px-4 mb-16">
          <motion.div
            className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-2xl border border-white/20 p-10 flex flex-col md:flex-row items-center gap-8 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex-1 min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow tracking-wide uppercase">
                  Közelgő esemény
                </span>
              </div>
              <h2 className="font-extrabold text-3xl md:text-4xl text-white mb-2 truncate drop-shadow-lg">
                {nextEvent.title}
              </h2>
              {nextEvent.location && (
                <div className="flex items-center gap-1 text-base text-white/90 mb-2 font-semibold">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block mr-1">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/>
                  </svg>
                  {nextEvent.location}
                </div>
              )}
              <div className="text-white/80 text-base mb-3 font-medium">
                {new Date(nextEvent.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              {nextEvent.description && (
                <p className="text-white/95 text-lg leading-relaxed line-clamp-3">{nextEvent.description}</p>
              )}
            </div>
            <button
              className="mt-6 md:mt-0 w-full md:w-auto py-3 px-8 rounded-2xl bg-white text-blue-600 font-extrabold shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-200 text-lg tracking-wide drop-shadow"
              onClick={() => { setSelected(nextEvent); setShowModal(true); }}
            >
              Érdekel
            </button>
          </motion.div>
        </section>
      )}

      {/* További események */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-blue-600 mb-8 tracking-tight drop-shadow-sm">
          További eseményeink
        </h2>
        {loading ? (
          <div className="text-center text-gray-400 text-lg font-medium animate-pulse">Betöltés...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-400 text-lg font-medium">Nincs megjeleníthető esemény.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EventCard event={event} onClick={() => { setSelected(event); setShowModal(true); }} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Event modal */}
      <AnimatePresence>
        {showModal && selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 flex flex-col gap-4 overflow-y-auto max-h-[80vh]"
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none"
                onClick={() => setShowModal(false)}
                aria-label="Bezárás"
              >
                ×
              </button>
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="rounded-xl w-full max-h-64 object-cover mb-2 border border-blue-200 shadow"
                />
              )}
              <div className="text-xs text-gray-400 mb-1">
                {new Date(selected.date).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" })}
              </div>
              <h3 className="font-bold text-2xl text-blue-600 mb-1 text-center">{selected.title}</h3>
              {selected.location && (
                <div className="text-sm text-blue-500 font-medium mb-1 text-center">{selected.location}</div>
              )}
              {selected.description && (
                <p className="mt-2 text-gray-700 text-base leading-relaxed text-center">{selected.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}