// import { Event } from '../../lib/mockEvents'
// Az Event típust a Supabase-ből kapott adatok alapján határozzuk meg
import { useAuth } from '../components/AuthProvider';

// Az EventItem típust a page.tsx-ből használjuk, mert abban van image property
type EventItem = {
  id: number;
  title: string;
  date: string;
  description?: string;
  image?: string | null;
  location?: string | null;
};

export default function EventCard({ event }: { event: EventItem }) {
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between h-[410px]">
      <img src={event.image ?? undefined} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-semibold text-lg mb-1">{event.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString('hu-HU')}</p>
          <p className="text-gray-700 mb-2 line-clamp-3 min-h-[72px]">{event.description}</p>
          {event.location && <p className="text-xs text-gray-400">Helyszín: {event.location}</p>}
        </div>
        {user && user.isAdmin && (
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold">Szerkesztés</button>
        )}
      </div>
    </div>
  )
}
