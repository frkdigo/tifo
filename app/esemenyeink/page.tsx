"use client";
import React, { useEffect, useRef, useState } from "react";
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

export default function Esemeneink() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hero kép váltás
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);

  const nextHeroImage = () => setCurrent((prev) => (prev + 1) % heroImages.length);

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

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section
        className="relative overflow-hidden flex items-center justify-center min-h-screen text-center cursor-pointer"
        onClick={nextHeroImage}
      >
        <div className="absolute inset-0 w-full h-full z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Hero background"
              className={`w-full h-full object-cover absolute inset-0 brightness-[0.38] contrast-95 saturate-80 transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
              style={{ zIndex: idx === current ? 1 : 0 }}
              draggable={false}
            />
          ))}
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-black/40 to-black/65" />

        <div className="relative z-20 w-full flex flex-col items-center justify-center py-28 px-4">
          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.92] tracking-tight mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Eseményeink
          </motion.h1>

          <p className="text-lg md:text-xl mb-10 text-white/80 max-w-xl font-medium leading-relaxed">
            Fedezd fel a legjobb bulikat, programokat és rendezvényeket!<br />
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
                    className="relative h-64 w-full"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                    />
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

              <h2 className="text-xl font-bold mb-2">{selected.title}</h2>

              <p className="text-purple-600 mb-2">{selected.location}</p>

              <p className="text-gray-500 mb-2">
                {new Date(selected.date).toLocaleDateString("hu-HU")}
              </p>

              {selected.description && <p>{selected.description}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}