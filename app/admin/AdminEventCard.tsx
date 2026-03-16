import { useAuth } from '../components/AuthProvider';
import { useState } from 'react';
import EditEventModal from './EditEventModal';

export default function AdminEventCard({ event, onUpdated, onDeleted }: { event: any, onUpdated?: () => void, onDeleted?: () => void }) {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-[430px]">
        <img src={event.image} alt={event.title} className="w-full h-44 object-cover" />
        <div className="p-4 flex-1 min-h-0 flex flex-col">
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <h2 className="font-semibold text-lg mb-1">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString('hu-HU')}</p>
            <p className="text-gray-700 mb-2 whitespace-pre-line">{event.description}</p>
            {event.location && <p className="text-xs text-gray-400">Helyszín: {event.location}</p>}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
          </div>
          {user && user.isAdmin && (
            <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold shrink-0" onClick={() => setEditOpen(true)}>Szerkesztés</button>
          )}
        </div>
      </div>
      {editOpen && (
        <EditEventModal event={event} onClose={() => setEditOpen(false)} onDeleted={onDeleted || onUpdated || (() => {})} onUpdated={onUpdated || (() => {})} />
      )}
    </>
  );
}
