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

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (/^\*[^*]+\*$/.test(part)) {
      return (
        <strong key={index} className="font-semibold text-gray-900">
          {part.slice(1, -1)}
        </strong>
      );
    }
    return <span key={index}>{part.replace(/\*/g, "")}</span>;
  });
}

function EventDescription({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return (
    <div className="space-y-2 text-gray-700">
      {lines.map((line, index) => {
        const bullet = line.match(/^[-*]\s+(.+)$/);
        if (bullet) {
          return (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>{renderInlineFormatting(bullet[1])}</span>
            </div>
          );
        }
        return <p key={index}>{renderInlineFormatting(line)}</p>;
      })}
    </div>
  );
}

export default function Esemeneink() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Következő jövőbeli esemény kiválasztása
  const now = new Date();
  const nextEvent = events.find(e => new Date(e.date) >= now);

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
      setError("Nem sikerült betölteni az eseményeket.");
    }
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 text-black">
      {/* Prémium háttér, overlay, mint a Rólunk oldalon */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-tifo-primary/10 via-white/60 to-slate-100" />

      {/* Modern, prémium header */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8">
        <motion.div
          className="relative rounded-3xl bg-white/90 shadow-2xl border border-tifo-primary/20 px-8 py-12 flex flex-col items-center overflow-hidden"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-tifo-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-tifo-secondary/10 rounded-full blur-2xl" />
          <span className="inline-block mb-4 px-5 py-2 rounded-full bg-gradient-to-r from-tifo-primary to-tifo-secondary text-white text-xs font-bold tracking-widest uppercase shadow-lg shadow-tifo-primary/10">TiFO események</span>
          <h1 className="text-5xl md:text-6xl font-black text-tifo-primary drop-shadow-sm mb-4 text-center">Eseményeink</h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl text-center mx-auto font-medium">Fedezd fel legújabb közösségi eseményeinket, programjainkat és rendezvényeinket! Kattints az <span className='font-bold text-tifo-secondary'>"Érdekel"</span> gombra a részletekért.</p>
        </motion.div>
      </section>

      {/* Közelgő esemény szekció - prémium stílus */}
      {nextEvent && (
        <section className="max-w-3xl mx-auto px-4 mb-16">
          <motion.div
            className="relative rounded-3xl bg-gradient-to-br from-tifo-primary/90 to-tifo-secondary/80 shadow-2xl border border-white/20 p-10 flex flex-col md:flex-row items-center gap-8 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="absolute -top-16 -left-16 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow tracking-wide uppercase">Közelgő esemény</span>
              </div>
              <div className="font-extrabold text-3xl md:text-4xl text-white mb-2 truncate drop-shadow-lg">{nextEvent.title}</div>
              {nextEvent.location && (
                <div className="flex items-center gap-1 text-base text-white/90 mb-2 font-semibold">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/></svg>
                  {nextEvent.location}
                </div>
              )}
              <div className="text-white/80 text-base mb-3 font-medium">
                {toLocalDay(nextEvent.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              {nextEvent.description && (
                <div className="text-white/95 text-lg leading-relaxed line-clamp-3">
                  <EventDescription text={nextEvent.description} />
                </div>
              )}
            </div>
            <button
              className="mt-6 md:mt-0 w-full md:w-auto py-3 px-8 rounded-2xl bg-white text-tifo-primary font-extrabold shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-200 text-lg tracking-wide drop-shadow"
              onClick={() => { setSelected(nextEvent); setShowModal(true); }}
            >
              Érdekel
            </button>
          </motion.div>
        </section>
      )}

      {/* További események */}
      {/* ... a további grid szekció marad ugyanaz ... */}

      {/* További események */}
      <motion.section
        className="max-w-6xl mx-auto px-4 pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-tifo-primary mb-8 tracking-tight drop-shadow-sm">
          További eseményeink
        </h2>
        {loading ? (
          <div className="text-center text-gray-400 text-lg font-medium animate-pulse">
            Betöltés...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-400 text-lg font-medium">
            Nincs megjeleníthető esemény.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                className="group rounded-3xl border-2 border-tifo-primary/30 bg-white shadow-md hover:shadow-xl p-6 flex flex-col gap-3 min-h-[240px] overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-xl mb-2 border border-tifo-primary/20 shadow"
                    onClick={() => {
                      setSelectedImage(event.image!);
                      setShowImageModal(true);
                    }}
                  />
                )}
                {/* Dátum kicsiben */}
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(event.date).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" })}
                </div>
                <h3 className="font-bold text-xl mb-1 truncate">{event.title}</h3>
                {event.description && (
                  <div className="text-gray-700 text-base line-clamp-2">
                    <EventDescription text={event.description} />
                  </div>
                )}
                <button
                  className="mt-auto py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold shadow transition-colors duration-200"
                  onClick={() => {
                    setSelected(event);
                    setShowModal(true);
                  }}
                >
                  Érdekel
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Full modal */}
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
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 flex flex-col gap-4 overflow-y-auto max-h-[80vh] scroll-smooth"
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-tifo-primary text-2xl font-bold focus:outline-none z-10"
                onClick={() => setShowModal(false)}
                aria-label="Bezárás"
              >
                ×
              </button>
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="rounded-xl w-full max-h-64 object-cover mb-2 border border-tifo-primary/20 shadow"
                />
              )}
              <div className="text-xs text-gray-400 mb-1">
                {new Date(selected.date).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="font-bold text-2xl text-tifo-primary mb-1 text-center">
                {selected.title}
              </div>
              {selected.location && (
                <div className="flex items-center gap-1 text-sm text-tifo-secondary font-medium mb-1">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block mr-1"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                      fill="currentColor"
                    />
                  </svg>
                  {selected.location}
                </div>
              )}
              {selected.description && (
                <div className="mt-2 text-gray-700 text-base leading-relaxed text-center">
                  <EventDescription text={selected.description} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image modal */}
      <AnimatePresence>
        {showImageModal && selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
          >
            <motion.img
              src={selectedImage}
              alt="Event"
              className="max-w-full max-h-[80vh] rounded-xl shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
              onClick={() => setShowImageModal(false)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}