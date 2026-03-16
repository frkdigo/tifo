"use client";
import { useEffect, useState } from "react";

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

function EventModal({ event, onClose }: { event: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-5 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl" onClick={onClose}>
          &times;
        </button>
        {event.image && <img src={event.image} alt={event.title} className="w-full h-44 object-cover rounded mb-4" />}
        <h2 className="text-xl font-bold mb-2 text-center">{event.title}</h2>
        <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString("hu-HU")}</p>
        <EventDescription text={event.description || ""} />
        {event.location && <p className="text-xs text-gray-400 mb-2">Helyszín: {event.location}</p>}
      </div>
    </div>
  );
}

export default function Esemeneink() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EventItem | null>(null);

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
  const upcoming = events.filter((event) => toLocalDay(event.date) >= todayStart);
  const past = events.filter((event) => toLocalDay(event.date) < todayStart).reverse();
  const featured = upcoming[0] || events[0] || null;

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <section className="premium-surface rounded-3xl p-6 md:p-8 mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Programok</p>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900">Eseményeink</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Kövesd a közelgő programokat, nézd vissza a korábbi eseményeket, és csatlakozz a közösséghez.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-slate-900 text-white px-4 py-3 min-w-[120px]">
              <div className="text-xl font-bold">{upcoming.length}</div>
              <div className="text-slate-300 text-xs">Közelgő</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 min-w-[120px]">
              <div className="text-xl font-bold text-slate-900">{past.length}</div>
              <div className="text-slate-500 text-xs">Korábbi</div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center">Betöltés...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500">Jelenleg nincsenek események.</div>
      ) : (
        <div className="space-y-8">
          {featured && (
            <section className="rounded-3xl overflow-hidden shadow-[0_24px_55px_-30px_rgba(15,23,42,0.55)] border border-slate-200 bg-white">
              <div className="grid md:grid-cols-[1.2fr,0.8fr]">
                <div className="relative min-h-[260px] md:min-h-[320px]">
                  {featured.image ? (
                    <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 text-white">
                    <p className="text-xs uppercase tracking-[0.16em] text-sky-200 mb-2">Kiemelt esemény</p>
                    <h2 className="text-2xl md:text-3xl font-black mb-2">{featured.title}</h2>
                    <p className="text-sm text-slate-200">{new Date(featured.date).toLocaleDateString("hu-HU")}</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between">
                  <p className="text-slate-700 leading-relaxed line-clamp-6">{featured.description || "Részletek hamarosan..."}</p>
                  <div className="mt-4">
                    {featured.location && <p className="text-xs text-slate-500 mb-3">Helyszín: {featured.location}</p>}
                    <button
                      className="w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                      onClick={() => setSelected(featured)}
                    >
                      Részletek megnyitása
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Közelgő események</h3>
            {upcoming.length === 0 ? (
              <div className="text-gray-500">Jelenleg nincs közelgő esemény.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {upcoming.map((event) => (
                  <article key={event.id} className="premium-surface rounded-2xl overflow-hidden flex flex-col h-full">
                    {event.image && <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />}
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-bold text-lg text-slate-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-slate-500 mb-2">{new Date(event.date).toLocaleDateString("hu-HU")}</p>
                      <p className="text-slate-700 text-sm line-clamp-3">{event.description || "Részletek hamarosan..."}</p>
                      <button
                        className="mt-auto pt-3 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                        onClick={() => setSelected(event)}
                      >
                        Érdekel
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Korábbi események</h3>
            {past.length === 0 ? (
              <div className="text-gray-500">Még nincsenek korábbi események.</div>
            ) : (
              <div className="space-y-3">
                {past.slice(0, 6).map((event) => (
                  <div key={event.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{event.title}</div>
                      <div className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString("hu-HU")}</div>
                    </div>
                    <button
                      className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                      onClick={() => setSelected(event)}
                    >
                      Megnézem
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
