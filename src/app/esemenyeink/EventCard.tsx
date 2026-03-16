import { Event } from '../../lib/mockEvents'
import { useAuth } from '../../../app/components/AuthProvider';

export default function EventCard({ event }: { event: Event }) {
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between">
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-semibold text-lg mb-1">{event.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString('hu-HU')}</p>
          <p className="text-gray-700 mb-2">{event.description}</p>
          {event.location && <p className="text-xs text-gray-400">Helyszín: {event.location}</p>}
        </div>
        {user && user.isAdmin && (
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold">Szerkesztés</button>
        )}
      </div>
    </div>
  )
}
