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

  const heroBg = heroImages[Math.floor(Math.random() * heroImages.length)];

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] w-full text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: "brightness(0.4) blur(1px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center py-24 px-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-white uppercase">
            Eseményeink
          </h1>
          <p className="text-lg md:text-2xl font-medium text-white/80 mb-8 max-w-2xl mx-auto">
            Fedezd fel a legjobb bulikat, programokat és rendezvényeket!
            <br />
            Válassz, és éld át a felejthetetlen élményeket!
          </p>
        </div>
      </section>

      {/* ESEMÉNYEK */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 uppercase">
          Közelgő események
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Betöltés...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">Nincs esemény.</p>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-6"
            columnClassName="flex flex-col gap-6"
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 group"
              >
                {event.image && (
                  <div
                    className="h-64 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${event.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                )}

                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {event.category || "Esemény"}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(event.date).toLocaleDateString("hu-HU")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-1 line-clamp-2">
                    {event.title}
                  </h3>

                  {event.location && (
                    <p className="text-sm text-purple-600">
                      📍 {event.location}
                    </p>
                  )}

                  {event.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setSelected(event);
                        setShowModal(true);
                      }}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 text-white font-bold px-4 py-2 rounded-lg"
                    >
                      Részletek
                    </button>

                    {event.image && (
                      <button
                        onClick={() => {
                          setImageSrc(event.image!);
                          setShowImageModal(true);
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
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

      {/* MODAL */}
      <AnimatePresence>
        {showModal && selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image && (
                <img
                  src={selected.image}
                  className="rounded-xl mb-4"
                />
              )}

              <h2 className="text-xl font-bold mb-2">
                {selected.title}
              </h2>

              <p className="text-purple-600 mb-2">
                {selected.location}
              </p>

              <p className="text-gray-500 mb-2">
                {new Date(selected.date).toLocaleDateString("hu-HU")}
              </p>

              {selected.description && (
                <p>{selected.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
