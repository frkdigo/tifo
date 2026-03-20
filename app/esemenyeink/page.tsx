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
      className="cursor-pointer bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-2xl"
    >
      {event.image && (
        <div
          className="h-48 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
          onClick={onShowImage}
        />
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs font-semibold text-gray-500 mb-1 uppercase">
          {new Date(event.date).toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <h3 className="text-xl font-extrabold text-tifo-primary mb-2">{event.title}</h3>
        {event.location && <p className="text-blue-600 mb-2">📍 {event.location}</p>}
        {event.description && <p className="text-gray-700 line-clamp-3 mb-4">{event.description}</p>}
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

  const now = new Date();
  const upcomingEvent = events.find((e) => new Date(e.date) >= now);
  const otherEvents = events.filter((e) => e.id !== upcomingEvent?.id);

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-100 text-black min-h-screen py-12">
      {/* Page Header */}
      <section className="text-center mb-16 px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-black text-blue-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Eseményeink
        </motion.h1>
        <motion.p
          className="max-w-xl mx-auto text-lg text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Fedezd fel a legújabb programokat, közösségi eseményeket és rendezvényeket!
        </motion.p>
      </section>

      {/* Highlighted Upcoming Event */}
      {upcomingEvent && (
        <section className="max-w-4xl mx-auto mb-16 px-4">
          <motion.div
            className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-blue-400 shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelected(upcomingEvent) || setShowModal(true)}
          >
            {upcomingEvent.image && (
              <div
                className="h-64 md:h-48 md:w-1/3 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url(${upcomingEvent.image})` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageSrc(upcomingEvent.image!);
                  setShowImageModal(true);
                }}
              />
            )}
            <div className="flex-1">
              <p className="text-white/90 font-semibold uppercase mb-2">
                Közelgő esemény
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                {upcomingEvent.title}
              </h2>
              {upcomingEvent.location && (
                <p className="text-white/90 mb-2">📍 {upcomingEvent.location}</p>
              )}
              <p className="text-white/95 line-clamp-3">{upcomingEvent.description}</p>
            </div>
          </motion.div>
        </section>
      )}

      {/* Other Events Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.h3
          className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          További események
        </motion.h3>
        {loading ? (
          <p className="text-center text-gray-400">Betöltés...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : otherEvents.length === 0 ? (
          <p className="text-center text-gray-400">Nincs további esemény.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherEvents.map((ev) => (
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
      </section>

      {/* Event Modal */}
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
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-y-auto"
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
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{selected.title}</h2>
              <p className="text-gray-500 mb-2">
                {new Date(selected.date).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {selected.location && <p className="text-gray-700 mb-2">📍 {selected.location}</p>}
              {selected.description && <p className="text-gray-800">{selected.description}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {showImageModal && imageSrc && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
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