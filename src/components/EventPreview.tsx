

"use client";
import { useEffect, useState } from 'react';

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

function EventModal({ event, onClose }: { event: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-5 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl" onClick={onClose}>&times;</button>
        {event.image && <img src={event.image} alt={event.title} className="w-full h-44 object-cover rounded mb-4" />}
        <h2 className="text-xl font-bold mb-2 text-center">{event.title}</h2>
        <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString('hu-HU')}</p>
        <EventDescription text={event.description || ''} />
        {event.location && <p className="text-xs text-gray-400 mb-2">Helyszín: {event.location}</p>}
      </div>
    </div>
  );
}

export default function EventPreview() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  function toLocalDay(dateValue: string) {
    // Keep date-only values stable across timezones.
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return new Date(`${dateValue}T00:00:00`);
    }
    return new Date(dateValue);
  }

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      // Csak jövőbeli vagy mai események, idő szerint növekvő
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      setEvents(
        data
          .filter((e: any) => toLocalDay(e.date) >= todayStart)
          .sort((a: any, b: any) => toLocalDay(a.date).getTime() - toLocalDay(b.date).getTime())
      );
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const nearestEvent = events.length > 0 ? [events[0]] : [];

  return (
    <section className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Közelgő eseményeink</h2>
      {loading ? (
        <div className="text-center">Betöltés...</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500">Nincs közelgő esemény.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {nearestEvent.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col items-stretch w-full min-h-[220px]">
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-2xl mb-1 break-words text-left">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString('hu-HU')}</p>
                  <p className="text-gray-700 mb-2 line-clamp-3">{event.description}</p>
                  {event.location && <p className="text-xs text-gray-400">Helyszín: {event.location}</p>}
                </div>
                <button
                  className="mt-4 w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors font-semibold"
                  onClick={() => setSelected(event)}
                >
                  Érdekel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}