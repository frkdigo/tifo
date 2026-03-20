"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";

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
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
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

  const heroBg = events[0]?.image || "/images/hero-bg.jpg";

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] w-full text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroBg})`, filter: 'brightness(0.4) blur(1px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center py-24 px-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg text-white uppercase">
            Eseményeink
          </h1>
          <p className="text-lg md:text-2xl font-medium text-white/80 mb-8 max-w-2xl mx-auto drop-shadow">
            Fedezd fel a legjobb bulikat, programokat és rendezvényeket!<br />
            Válassz, és éld át a felejthetetlen élményeket!
          </p>
        </div>
      </section>

      {/* Pinterest-stílusú események */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-wide text-white uppercase drop-shadow-lg">
          Közelgő események
        </h2>

        {loading ? (
          <p className="text-center text-white/60">Betöltés...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-white/60">Nincs esemény.</p>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-6"
            columnClassName="flex flex-col gap-6"
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="relative rounded-2xl overflow-hidden shadow-2xl group bg-gray-800/80 border border-gray-700"
              >
                {event.image && (
                  <div
                    className="h-64 w-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${event.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6 flex flex-col gap-2 relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow">
                      {event.category || "Esemény"}
                    </span>
                    <span className="text-xs text-white/70 ml-auto">
                      {new Date(event.date).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-1 line-clamp-2 drop-shadow">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="text-sm text-purple-300 mb-1">📍 {event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-white/80 text-base line-clamp-3 mb-2">{event.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setSelected(event); setShowModal(true); }}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold px-5 py-2 rounded-lg shadow hover:from-blue-500 hover:via-pink-500 hover:to-purple-500 transition-all duration-200 uppercase tracking-wide"
                    >
                      Részletek
                    </button>
                    {event.image && (
                      <button
                        onClick={() => { setImageSrc(event.image!); setShowImageModal(true); }}
                        className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition"
                      >
                        Kép
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        )}
      </section>

      {/* Event Modal */}
      <AnimatePresence>
        {showModal && selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-y-auto border border-gray-700 text-white"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full rounded-2xl mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-white mb-2">{selected.title}</h2>
              <p className="text-purple-300 mb-2">
                {selected.location}
              </p>
              <p className="text-white/70 mb-2">
                {new Date(selected.date).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {selected.description && <p className="text-white/90">{selected.description}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {showImageModal && imageSrc && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
          >
            <motion.img
              src={imageSrc}
              className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}