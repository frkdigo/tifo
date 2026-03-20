"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

  useEffect(() => {
    fetchEvents();
  }, []);

  function toLocalDay(dateValue: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return new Date(`${dateValue}T00:00:00`);
    }
    return new Date(dateValue);
  }

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(
        data.sort((a: EventItem, b: EventItem) => toLocalDay(a.date).getTime() - toLocalDay(b.date).getTime())
      );
    } catch {
      setError("Nem sikerült betölteni az eseményeket.");
    }
    setLoading(false);
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextEvent = events.length > 0 ? events.find(e => toLocalDay(e.date) >= todayStart) || events[0] : null;

  return (
    <main className="relative overflow-hidden bg-white text-black">
      {/* Prémium háttér, overlay, mint a Rólunk oldalon */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(15,23,42,0.22),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_34%,#f6f9fc_34%,#ffffff_100%)]" />

      {/* Főcím szekció prémium stílussal */}
      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-8 md:p-12 text-center">
          <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 14% -6%, rgba(135,206,235,0.22), transparent 28%), radial-gradient(circle at 88% 8%, rgba(40,167,69,0.18), transparent 25%), radial-gradient(circle at 52% 120%, rgba(13,59,102,0.35), transparent 40%)' }} />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20">
              TiFO események
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white">Eseményeink</h1>
            <p className="mt-5 text-white/90 text-lg md:text-xl max-w-3xl leading-[1.58] mx-auto">
              Fedezd fel legújabb közösségi eseményeinket, programjainkat és rendezvényeinket! Kattints az "Érdekel" gombra a részletekért.
            </p>
          </div>
        </div>
      </section>

      {/* Közelgő esemény doboz */}
      {nextEvent && (
        <section className="max-w-2xl mx-auto px-4 mb-12">
          <div className="relative bg-gradient-to-r from-tifo-primary to-tifo-secondary rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-white/20">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/80 mb-1">Közelgő esemény</div>
              <div className="font-bold text-2xl md:text-3xl text-white mb-1 truncate">{nextEvent.title}</div>
              {nextEvent.location && (
                <div className="flex items-center gap-1 text-sm text-white/90 mb-1">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/></svg>
                  {nextEvent.location}
                </div>
              )}
              <div className="text-white/80 text-sm mb-2">
                {toLocalDay(nextEvent.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              {nextEvent.description && (
                <div className="text-white/90 text-base leading-relaxed line-clamp-3">
                  <EventDescription text={nextEvent.description} />
                </div>
              )}
            </div>
            <button
              className="mt-4 md:mt-0 w-full md:w-auto py-2 px-6 rounded-xl bg-white text-tifo-primary font-bold shadow hover:scale-[1.03] hover:shadow-xl transition-all duration-200 text-base tracking-wide"
              onClick={() => { setSelected(nextEvent); setShowModal(true); }}
            >
              Érdekel
            </button>
          </div>
        </section>
      )}

      {/* Események listája */}
      <motion.section
        className="max-w-6xl mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {loading ? (
          <div className="text-center text-gray-400 text-lg font-medium animate-pulse">Betöltés...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-400 text-lg font-medium">Nincs megjeleníthető esemény.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                className="relative group bg-white/95 rounded-2xl shadow-lg p-5 flex flex-col gap-2 border border-tifo-primary/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[220px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Dátum badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-block bg-gradient-to-r from-tifo-primary to-tifo-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {toLocalDay(event.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {/* Cím */}
                <div className="font-bold text-lg mb-1 text-tifo-primary group-hover:text-tifo-secondary transition-colors duration-200 truncate">
                  {event.title}
                </div>
                {/* Helyszín */}
                {event.location && (
                  <div className="flex items-center gap-1 text-xs text-tifo-secondary font-medium mb-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/></svg>
                    {event.location}
                  </div>
                )}
                {/* Rövid leírás (max 2 sor) */}
                {event.description && (
                  <div className="mt-1 text-gray-700 text-sm line-clamp-2">
                    <EventDescription text={event.description} />
                  </div>
                )}
                {/* Érdekel gomb */}
                <button
                  className="mt-auto w-full py-2 px-4 rounded-xl bg-gradient-to-r from-tifo-primary to-tifo-secondary text-white font-bold shadow hover:scale-[1.03] hover:shadow-xl transition-all duration-200 text-sm tracking-wide"
                  onClick={() => { setSelected(event); setShowModal(true); }}
                >
                  Érdekel
                </button>
                {/* Színes háttér animáció */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                  <div className="absolute -top-10 -left-10 w-28 h-28 bg-tifo-primary/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-tifo-secondary/20 rounded-full blur-2xl animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* MODÁL: Esemény részletek */}
      {showModal && selected && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 flex flex-col gap-4 animate-in max-h-[80vh]"
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-tifo-primary text-2xl font-bold focus:outline-none z-10"
              onClick={() => setShowModal(false)}
              aria-label="Bezárás"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-2 overflow-y-auto w-full" style={{ maxHeight: '60vh' }}>
              {/* Kép, ha van */}
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="rounded-xl w-full max-h-64 object-cover mb-2 border border-tifo-primary/20 shadow"
                />
              )}
              <div className="text-xs text-gray-400 mb-1">
                {toLocalDay(selected.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <div className="font-bold text-2xl text-tifo-primary mb-1 text-center">
                {selected.title}
              </div>
              {selected.location && (
                <div className="flex items-center gap-1 text-sm text-tifo-secondary font-medium mb-1">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/></svg>
                  {selected.location}
                </div>
              )}
              {selected.description && (
                <div className="mt-2 text-gray-700 text-base leading-relaxed text-center">
                  <EventDescription text={selected.description} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}