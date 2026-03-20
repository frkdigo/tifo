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
};

export default function Esemeneink() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

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
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        {event.image && (
          <img
            src={event.image}
            className="w-full h-44 object-cover"
            alt={event.title}
          />
        )}
        <div className="p-5 flex flex-col gap-2">
          <h3 className="text-lg font-bold mb-1">{event.title}</h3>
          <p className="text-sm text-gray-500 mb-1">{new Date(event.date).toLocaleDateString("hu-HU")}</p>
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">{event.description}</p>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setActiveEvent(event)}
              className="bg-blue-900 text-white font-bold px-6 py-2 rounded-[16px] hover:bg-blue-800 transition text-base w-full"
            >
              Érdekel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      {/* HERO CARD */}
      <section className="max-w-2xl mx-auto mb-8">
        <div className="rounded-[32px] bg-gradient-to-br from-[#eaf3fa] via-[#dbeafe] to-[#e0e7ef] p-1">
          <div className="rounded-[28px] bg-gradient-to-br from-[#0a1a2f] via-[#1e293b] to-[#0a1a2f] p-6 md:p-8 text-white">
            <p className="uppercase tracking-[0.18em] text-xs text-gray-200 mb-2">Programok</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Eseményeink</h1>
            <p className="text-base md:text-lg text-gray-200 mb-6">Kövesd a közelgő programokat, nézd vissza a korábbi eseményeket, és csatlakozz a közösséghez.</p>
            <div className="flex gap-3 mt-2">
              <div className="flex-1 rounded-2xl border border-gray-300 bg-white/10 py-4 text-center">
                <div className="text-2xl font-bold">{upcoming.length}</div>
                <div className="text-xs text-gray-200 mt-1">Közelgő</div>
              </div>
              <div className="flex-1 rounded-2xl border border-gray-300 bg-white/10 py-4 text-center">
                <div className="text-2xl font-bold">{past.length}</div>
                <div className="text-xs text-gray-200 mt-1">Korábbi</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* KIEMELT ESEMÉNY */}
      {featuredEvent && (
        <section className="mb-10">
          <div
            onClick={() => setActiveEvent(featuredEvent)}
            className="cursor-pointer rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md grid md:grid-cols-2"
          >
            <div className="h-56 md:h-auto">
              {featuredEvent.image && (
                <img
                  src={featuredEvent.image}
                  className="w-full h-full object-cover"
                  alt={featuredEvent.title}
                />
              )}
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-700 font-bold">KIEMELT ESEMÉNY</span>
                <h2 className="text-xl md:text-2xl font-black mt-2 mb-1">{featuredEvent.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{new Date(featuredEvent.date).toLocaleDateString("hu-HU")}</p>
                <p className="text-gray-700 line-clamp-4 leading-[1.6]">{featuredEvent.description}</p>
              </div>
              <div className="mt-6">
                <button className="bg-blue-900 text-white font-bold px-6 py-2 rounded-[16px] hover:bg-blue-800 transition w-full text-base">
                  Érdekel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* KÖZELGŐ ESEMÉNYEK */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Közelgő események</h2>
        {loading ? (
          <p className="text-gray-500">Betöltés...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.slice(1).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* KORÁBBI ESEMÉNYEK */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-2">Korábbi események</h2>
        {past.length === 0 ? (
          <p className="text-gray-400">Még nincsenek korábbi események.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-black hover:bg-gray-100 transition"
              >
                ✕
              </button>
              {activeEvent.image && (
                <img
                  src={activeEvent.image}
                  className="w-full h-60 object-cover"
                  alt={activeEvent.title}
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-1">{activeEvent.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{new Date(activeEvent.date).toLocaleDateString("hu-HU")}</p>
                <p className="text-gray-700">{activeEvent.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
