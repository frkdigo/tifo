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
  category?: string;
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
      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
      className="cursor-pointer bg-white rounded-3xl overflow-hidden flex flex-col transition-transform duration-300"
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
        {event.location && <p className="text-orange-500 mb-2">📍 {event.location}</p>}
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

  // Tab szűrőhöz kategóriák kigyűjtése
  const categories = Array.from(new Set(events.map(e => e.category || "Egyéb")));
  const [activeTab, setActiveTab] = useState<string>(categories[0] || "");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  // Szűrt és lapozott események
  const filteredEvents = otherEvents.filter(e => (e.category || "Egyéb") === activeTab);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

  return (
    <main className="bg-gradient-to-b from-gray-50 via-white to-gray-100 text-black min-h-screen py-12">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 mb-4 text-sm text-gray-500 flex items-center gap-2">
        <span className="hover:underline cursor-pointer" onClick={() => window.location.href = '/'}>Főoldal</span>
        <span className="mx-1">&gt;</span>
        <span className="text-blue-700 font-semibold">Eseményeink</span>
      </nav>

      {/* Header */}
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
        <section className="max-w-5xl mx-auto mb-16 px-4 relative">
          <motion.div
            className="relative rounded-3xl bg-gradient-to-r from-blue-700 to-orange-500 shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              setSelected(upcomingEvent);
              setShowModal(true);
            }}
          >
            {upcomingEvent.image && (
              <div
                className="h-64 md:h-48 md:w-1/3 bg-cover bg-center rounded-2xl transform transition-transform duration-300 hover:scale-105"
                style={{ backgroundImage: `url(${upcomingEvent.image})` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageSrc(upcomingEvent.image!);
                  setShowImageModal(true);
                }}
              />
            )}
            <div className="flex-1 relative z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl animate-pulse-slow pointer-events-none" />
              <p className="text-white font-semibold uppercase mb-2 z-10 relative">
                Közelgő esemény
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 z-10 relative">
                {upcomingEvent.title}
              </h2>
              {upcomingEvent.location && (
                <p className="text-white/90 mb-2 relative z-10">📍 {upcomingEvent.location}</p>
              )}
              <p className="text-white/95 line-clamp-3 relative z-10">{upcomingEvent.description}</p>
            </div>
          </motion.div>
        </section>
      )}

      {/* Tabos szűrő */}
      <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-semibold border transition-all duration-150 ${activeTab === cat ? 'bg-blue-700 text-white border-blue-700 shadow' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => { setActiveTab(cat); setCurrentPage(1); }}
          >
            {cat}
          </button>
        ))}
      </div>

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
        ) : paginatedEvents.length === 0 ? (
          <p className="text-center text-gray-400">Nincs további esemény.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEvents.map((ev) => (
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
        {/* Lapozó */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1 rounded-full border bg-white text-blue-700 font-bold disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded-full border font-bold ${currentPage === i + 1 ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-full border bg-white text-blue-700 font-bold disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
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