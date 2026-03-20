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

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextEvent =
    events.length > 0
      ? events.find((e) => new Date(e.date) >= todayStart) || events[0]
      : null;

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-black overflow-x-hidden">
      {/* Page header */}
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
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20">
            TiFO események
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white">
            Eseményeink
          </h1>
          <p className="mt-5 text-white/90 text-lg md:text-xl max-w-3xl leading-[1.58] mx-auto">
            Fedezd fel legújabb közösségi eseményeinket, programjainkat és
            rendezvényeinket! Kattints az "Érdekel" gombra a részletekért.
          </p>
        </div>
      </section>

      {/* Közelgő esemény */}
      {nextEvent && (
        <section className="max-w-3xl mx-auto px-4 mb-14">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-tifo-primary mb-5 tracking-tight drop-shadow-sm">
            Közelgő esemény
          </h2>
          <div className="relative bg-gradient-to-br from-tifo-primary/90 to-tifo-secondary/80 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-white/20 overflow-hidden">
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-3xl md:text-4xl text-white mb-2 truncate drop-shadow">
                {nextEvent.title}
              </div>
              {nextEvent.location && (
                <div className="flex items-center gap-1 text-base text-white/90 mb-2 font-semibold">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block mr-1"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                      fill="currentColor"
                    />
                  </svg>
                  {nextEvent.location}
                </div>
              )}
              <div className="text-white/80 text-base mb-3 font-medium">
                {new Date(nextEvent.date).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              {nextEvent.description && (
                <div className="text-white/95 text-lg leading-relaxed line-clamp-3">
                  <EventDescription text={nextEvent.description} />
                </div>
              )}
            </div>
            {nextEvent.image && (
              <img
                src={nextEvent.image}
                alt={nextEvent.title}
                className="w-64 h-40 object-cover rounded-xl cursor-pointer border border-white/30 shadow-md"
                onClick={() => {
                  setSelectedImage(nextEvent.image!);
                  setShowImageModal(true);
                }}
              />
            )}
            <button
              className="mt-6 md:mt-0 w-full md:w-auto py-3 px-8 rounded-2xl bg-white text-tifo-primary font-extrabold shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-200 text-lg tracking-wide drop-shadow"
              onClick={() => {
                setSelected(nextEvent);
                setShowModal(true);
              }}
            >
              Érdekel
            </button>
          </div>
        </section>
      )}

      {/* További események */}
      <motion.section
        className="max-w-6xl mx-auto px-4 pb-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
                className="relative group rounded-3xl border-2 border-tifo-primary/30 bg-white/95 shadow-[0_8px_32px_-8px_rgba(40,60,120,0.13)] hover:shadow-[0_16px_48px_-8px_rgba(40,60,120,0.18)] p-8 flex flex-col gap-4 min-h-[240px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                {/* Kép */}
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-xl cursor-pointer mb-2 border border-tifo-primary/20 shadow"
                    onClick={() => {
                      setSelectedImage(event.image!);
                      setShowImageModal(true);
                    }}
                  />
                )}

                {/* Cím */}
                <div className="font-extrabold text-xl mb-1 text-tifo-primary group-hover:text-tifo-secondary transition-colors duration-200 truncate drop-shadow-sm">
                  {event.title}
                </div>

                {/* Rövid leírás */}
                {event.description && (
                  <div className="mt-1 text-gray-700 text-base line-clamp-2">
                    <EventDescription text={event.description} />
                  </div>
                )}

                {/* Érdekel gomb */}
                <button
                  className="mt-auto w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-tifo-primary to-tifo-secondary text-white font-extrabold shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-200 text-base tracking-wide drop-shadow-sm"
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

      {/* MODAL: teljes esemény */}
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

      {/* MODAL: nagy kép */}
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