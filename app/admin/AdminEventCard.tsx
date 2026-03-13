import { useAuth } from '../components/AuthProvider';
import { useState } from 'react';
import EditEventModal from './EditEventModal';

export default function AdminEventCard({ event, onUpdated }: { event: any, onUpdated?: () => void }) {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between h-[410px]">
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-lg mb-1">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString('hu-HU')}</p>
            <p className="text-gray-700 mb-2 line-clamp-3 min-h-[72px]">{event.description}</p>
            {event.location && <p className="text-xs text-gray-400">Helyszín: {event.location}</p>}
          </div>
          {user && user.isAdmin && (
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold" onClick={() => setEditOpen(true)}>Szerkesztés</button>
          )}
        </div>
      </div>
      {editOpen && (
        <EditEventModal event={event} onClose={() => setEditOpen(false)} onDeleted={onUpdated || (() => {})} onUpdated={onUpdated || (() => {})} />
      )}
    </>
  );
}
