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
  // ...további implementáció...
}
