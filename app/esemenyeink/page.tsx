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

function EventCard({
  event,
  onSelect,
  onShowImage,
}: {
  event: EventItem;
  onSelect: () => void;
  onShowImage: () => void;
}) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-200"
    >
      {event.image && (
        <div
          className="h-44 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
          onClick={onShowImage}
        />
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-semibold text-gray-500 mb-1 uppercase">
          {new Date(event.date).toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <h3 className="text-xl font-extrabold text-tifo-primary mb-2">{event.title}</h3>
        {event.location && (
          <div className="text-sm text-blue-700 mb-2 truncate">
            📍 {event.location}
          </div>
        )}
        <p className="text-gray-700 line-clamp-3 mb-4">{event.description}</p>
        <button
          onClick={onSelect}
          className="mt-auto py-2 px-4 bg-tifo-secondary text-white font-bold rounded-xl hover:scale-105 transition-transform"
        >
          Részletek
        </button>
      </div>
    </motion.div>
  );
}

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

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white text-black min-h-screen py-12">
      {/* Page Header */}
      <section className="text-center mb-16 px-4">
        <h1 className="text-5xl md:text-6xl font-black text-blue-800 mb-4">
          Eseményeink
        </h1>
        <p className="max-w-xl mx-auto text-lg text-gray-700">
          Fedezd fel a legújabb programokat, közösségi eseményeket és rendezvényeket!
        </p>
      </section>

      {/* Event Grid */}
      {loading ? (
        <p className="text-center text-gray-400">Betöltés...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onSelect={() => {
                setSelected(ev);
                setShowModal(true);
              }}
              onShowImage={() => {
                if (ev.image) {
                  setImageSrc(ev.image);
                  setShowImageModal(true);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Event Details Modal */}
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
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full rounded-xl mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                {selected.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(selected.date).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {selected.location && (
                <p className="text-gray-700 mb-2">📍 {selected.location}</p>
              )}
              <p className="text-gray-800">{selected.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {showImageModal && imageSrc && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
          >
            <motion.img
              src={imageSrc}
              className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}