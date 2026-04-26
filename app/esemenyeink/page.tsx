"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type EventItem = {
  id: number;
  title: string;
  date: string;
  description?: string;
  image?: string | null;
  location?: string | null;
  category?: string;
  eventLink?: string | null;
  eventLinkName?: string | null;
};

// Parseol szöveget és konvertálja az URL-eket kattintható linkekké
function parseTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, idx) => {
    if (/^https?:\/\/[^\s]+$/i.test(part)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 hover:text-sky-700 underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function Esemeneink() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const modalOpen = Boolean(activeEvent || imagePreview);
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (modalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [activeEvent, imagePreview]);

  async function fetchEvents() {
    setLoading(true);
    const res = await fetch("/api/events", { cache: "no-store" });
    const data = await res.json();

    setEvents(
      Array.isArray(data)
        ? data.sort(
            (a: EventItem, b: EventItem) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        : []
    );

    setLoading(false);
  }

  // Szétválogatás: közelgő és korábbi események
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.date) >= now);
  const past = events.filter(e => new Date(e.date) < now);
  const featuredEvent = upcoming[0];

  function EventCard({ event }: { event: EventItem }) {
    return (
      <motion.article
        whileHover={{ y: -5 }}
        transition={{ duration: 0.25 }}
        className="bg-white border border-slate-200 rounded-[1.75rem] overflow-hidden shadow-[0_18px_35px_-25px_rgba(2,6,23,0.45)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              className="w-full h-full object-cover"
              alt={event.title}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full bg-slate-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
            <h3 className="text-2xl md:text-3xl font-black leading-tight drop-shadow-md line-clamp-2">{event.title}</h3>
            <div className="mt-1 text-sm md:text-base font-semibold text-white/90 drop-shadow">
              {new Date(event.date).toLocaleDateString("hu-HU")} · {new Date(event.date).toLocaleTimeString("hu-HU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <span className="mt-2 inline-flex items-center rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold text-white border border-white/30">
              {event.category || "Program"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExpandedEventId((prev) => (prev === event.id ? null : event.id))}
            className="absolute right-4 bottom-4 sm:right-5 sm:bottom-5 bg-black/35 hover:bg-black/50 border border-white/40 text-white font-bold px-5 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            Érdekel
          </button>
        </div>

        <AnimatePresence initial={false}>
          {expandedEventId === event.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 py-4 border-t border-slate-200 bg-white">
                <div className="text-slate-700 text-sm sm:text-base leading-[1.62]">
                  {(event.description || "Nincs leírás.").split("\n").map((line, idx) => (
                    <p key={idx} className="mb-2 last:mb-0">{parseTextWithLinks(line)}</p>
                  ))}
                </div>
                {event.eventLink && event.eventLinkName && (
                  <a
                    href={event.eventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sky-600 hover:text-sky-700 underline font-semibold"
                  >
                    {event.eventLinkName}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    );
  }

  return (
    <main className="w-full mx-auto px-3 sm:px-4 md:px-6 py-8 md:py-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

      {/* HERO CARD */}
      <motion.section
        className="w-full px-0 pt-8 md:pt-14 pb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0.2, 0.2, 1] }}
      >
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#020618] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-4 sm:p-6 md:p-12 mx-0">
          <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true" style={{ background: '#020618' }} />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0">
            <div className="md:text-left text-center md:max-w-xl flex-1">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-4 sm:px-5 py-2 sm:py-2.5 mb-4 sm:mb-6 shadow-lg shadow-black/20 text-center sm:text-left">
                Törökbálinti Ifjúsági Önkormányzat
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-2">Eseményeink</h1>
              <p className="mt-4 sm:mt-5 text-white/90 text-base sm:text-lg md:text-xl max-w-3xl leading-[1.58] md:mx-0 mx-auto px-1 sm:px-0">
                Kövesd a közelgő programokat, nézd vissza a korábbi eseményeket, és csatlakozz a közösséghez.
              </p>
            </div>
            <div className="flex flex-row md:flex-col items-center justify-center md:justify-end flex-shrink-0 md:ml-12 mt-6 md:mt-0 w-full md:w-auto px-2 sm:px-0">
              <div className="flex flex-row md:flex-col gap-2 sm:gap-3 md:gap-6 w-full md:w-auto justify-center">
                <div className="flex-1 md:w-32 rounded-lg sm:rounded-2xl border border-white/20 bg-white/10 py-3 sm:py-4 text-center min-w-[100px]">
                  <div className="text-xl sm:text-2xl font-bold text-white">{upcoming.length}</div>
                  <div className="text-xs text-white/80 mt-1">Közelgő</div>
                </div>
                <div className="w-px h-8 sm:h-10 bg-white/20 self-center hidden md:block" />
                <div className="flex-1 md:w-32 rounded-lg sm:rounded-2xl border border-white/20 bg-white/10 py-3 sm:py-4 text-center min-w-[100px]">
                  <div className="text-xl sm:text-2xl font-bold text-white">{past.length}</div>
                  <div className="text-xs text-white/80 mt-1">Korábbi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>


      {/* KIEMELT ESEMÉNY */}
      {featuredEvent && (
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <motion.article
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-slate-200 rounded-[1.75rem] overflow-hidden shadow-[0_18px_35px_-25px_rgba(2,6,23,0.45)]"
          >
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              {featuredEvent.image ? (
                <img
                  src={featuredEvent.image}
                  className="w-full h-full object-cover"
                  alt={featuredEvent.title}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 text-white">
                <span className="mb-2 inline-flex items-center rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold text-white border border-white/30">
                  KIEMELT ESEMÉNY
                </span>
                <h2 className="text-2xl md:text-4xl font-black leading-tight drop-shadow-md line-clamp-2">{featuredEvent.title}</h2>
                <div className="mt-1 text-sm md:text-base font-semibold text-white/90 drop-shadow">
                  {new Date(featuredEvent.date).toLocaleDateString("hu-HU")} · {new Date(featuredEvent.date).toLocaleTimeString("hu-HU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpandedEventId((prev) => (prev === featuredEvent.id ? null : featuredEvent.id))}
                className="absolute right-4 bottom-4 sm:right-5 sm:bottom-5 bg-black/35 hover:bg-black/50 border border-white/40 text-white font-bold px-5 py-2 rounded-full backdrop-blur-sm transition-colors"
              >
                Érdekel
              </button>
            </div>

            <AnimatePresence initial={false}>
              {expandedEventId === featuredEvent.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 py-4 border-t border-slate-200 bg-white">
                    <div className="text-slate-700 text-sm sm:text-base leading-[1.62]">
                      {(featuredEvent.description || "Nincs leírás.").split("\n").map((line, idx) => (
                        <p key={idx} className="mb-2 last:mb-0">{parseTextWithLinks(line)}</p>
                      ))}
                    </div>
                    {featuredEvent.eventLink && featuredEvent.eventLinkName && (
                      <a
                        href={featuredEvent.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sky-600 hover:text-sky-700 underline font-semibold"
                      >
                        {featuredEvent.eventLinkName}
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        </motion.section>
      )}

      {/* KÖZELGŐ ESEMÉNYEK */}
      <section className="mb-12">
        <h2 className="text-base sm:text-lg md:text-2xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight px-1 sm:px-0">További események</h2>
        {loading ? (
          <p className="text-gray-500">Betöltés...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7 lg:gap-8">
            {upcoming.slice(1).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* KORÁBBI ESEMÉNYEK */}
      <section className="mb-8 sm:mb-10">
        <h2 className="text-base sm:text-lg md:text-2xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight px-1 sm:px-0">Korábbi események</h2>
        {past.length === 0 ? (
          <p className="text-gray-400">Még nincsenek korábbi események.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7 lg:gap-8">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 md:p-4 overflow-y-auto"
            onClick={() => setActiveEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white w-full max-w-xs sm:max-w-md md:max-w-2xl rounded-lg sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-black hover:bg-gray-100 transition"
              >
                ✕
              </button>
              {activeEvent.image && (
                <img
                  src={activeEvent.image}
                  className="w-full h-32 sm:h-40 md:h-60 object-cover cursor-zoom-in"
                  alt={activeEvent.title}
                  onClick={() => setImagePreview(activeEvent.image!)}
                />
              )}
              <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1 min-h-0">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 pr-6">{activeEvent.title}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-3">
                  <span className="text-xs sm:text-sm text-gray-500">{new Date(activeEvent.date).toLocaleDateString("hu-HU")}</span>
                  {activeEvent.location && (
                    <span className="text-xs sm:text-sm text-gray-400 sm:ml-4">Helyszín: {activeEvent.location}</span>
                  )}
                </div>
                {activeEvent.description && (
                  <div className="prose prose-sm max-w-none text-gray-800 text-sm sm:text-base">
                    {activeEvent.description.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">{parseTextWithLinks(line)}</p>
                    ))}
                  </div>
                )}
                {activeEvent.eventLink && activeEvent.eventLinkName && (
                  <a
                    href={activeEvent.eventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 underline text-sm font-semibold mt-3 inline-block break-all"
                  >
                    {activeEvent.eventLinkName}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Fullscreen image preview */}
        {imagePreview && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImagePreview(null)}
          >
            <img
              src={imagePreview}
              alt="Esemény borítókép nagyban"
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border-2 border-white"
              onClick={e => { e.stopPropagation(); setImagePreview(null); }}
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow text-gray-700 text-3xl hover:bg-white"
              aria-label="Bezárás"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </main>
  );
}
