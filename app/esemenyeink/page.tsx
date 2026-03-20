"use client";
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

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
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setCurrent((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearTimeout(timeout);
  }, [current]);

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

  const activeIndex = useMemo(() => {
    if (!activeEvent) return -1;
    return events.findIndex((e) => e.id === activeEvent.id);
  }, [activeEvent, events]);

  function navigateEvent(direction: -1 | 1) {
    if (!activeEvent || events.length === 0) return;
    const currentIndex = events.findIndex((e) => e.id === activeEvent.id);
    const nextIndex = (currentIndex + direction + events.length) % events.length;
    setActiveEvent(events[nextIndex]);
  }

  function EventCard({ event, onSelect }: {
    event: EventItem;
    onSelect: () => void;
  }) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl group bg-black/80 border border-white/10"
      >
        {event.image && (
          <div
            className="h-56 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${event.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}
        <div className="p-6 flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-gradient-to-r from-pink-500 to-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow">
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
            <p className="text-sm text-blue-300 mb-1">📍 {event.location}</p>
          )}
          {event.description && (
            <p className="text-white/80 text-base line-clamp-3 mb-4">{event.description}</p>
          )}
          <div className="flex justify-center mt-4">
            <button
              onClick={onSelect}
              className="bg-[#0a2259] hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200 uppercase tracking-wide"
            >
              Érdekel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative overflow-hidden bg-white text-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(15,23,42,0.22),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_34%,#f6f9fc_34%,#ffffff_100%)]" />

      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-8 md:p-12 text-center">
          <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 14% -6%, rgba(135,206,235,0.22), transparent 28%), radial-gradient(circle at 88% 8%, rgba(40,167,69,0.18), transparent 25%), radial-gradient(circle at 52% 120%, rgba(13,59,102,0.35), transparent 40%)' }} />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20">
              Törökbálinti Ifjúsági Önkormányzat
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white">Eseményeink</h1>
            <p className="mt-5 text-white/90 text-lg md:text-xl max-w-3xl leading-[1.58] mx-auto">
              Fedezd fel a legjobb bulikat, programokat és rendezvényeket! Válassz, és éld át a felejthetetlen élményeket!
            </p>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-white/70 col-span-full text-center">Betöltés...</p>
              ) : error ? (
                <p className="text-red-400 col-span-full text-center">{error}</p>
              ) : events.length === 0 ? (
                <p className="text-white/70 col-span-full text-center">Nincs esemény.</p>
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={() => setActiveEvent(event)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeEvent && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px] p-4 flex items-center justify-center" onClick={() => setActiveEvent(null)}>
            <div
              className="w-full max-w-2xl rounded-[1.75rem] overflow-hidden bg-white shadow-[0_30px_80px_-35px_rgba(0,0,0,0.55)] border border-slate-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 bg-gradient-to-r from-slate-950 via-[#87ceeb] to-[#28a745]" />
              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl leading-none bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-slate-200"
                onClick={() => setActiveEvent(null)}
                aria-label="Bezárás"
              >
                &times;
              </button>

              <div className="p-6 md:p-7">
                {activeEvent.image && (
                  <img
                    src={activeEvent.image}
                    alt={activeEvent.title}
                    className="w-full h-64 object-cover rounded-2xl mb-5"
                  />
                )}
                <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">{activeEvent.title}</h2>
                {activeEvent.location && <p className="mt-1 text-gray-700">{activeEvent.location}</p>}
                <p className="mt-2 text-gray-500 text-sm">{new Date(activeEvent.date).toLocaleDateString("hu-HU")}</p>
                {activeEvent.description && <p className="mt-4 text-gray-700">{activeEvent.description}</p>}

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => navigateEvent(-1)}
                    className="px-4 py-2 rounded-xl border bg-blue-900 text-white hover:bg-blue-800 transition-colors"
                  >
                    Előző esemény
                  </button>
                  <span className="text-sm text-gray-500">{activeIndex + 1} / {events.length}</span>
                  <button
                    type="button"
                    onClick={() => navigateEvent(1)}
                    className="px-4 py-2 rounded-xl border bg-blue-900 text-white hover:bg-blue-800 transition-colors"
                  >
                    Következő esemény
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}