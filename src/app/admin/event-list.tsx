// Eseménylista admin felülethez (mock, Supabase integrációhoz előkészítve)
import { mockEvents } from '../../lib/mockEvents'

export default function AdminEventList() {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Események</h2>
      <ul className="space-y-4">
        {mockEvents.map(event => (
          <li key={event.id} className="bg-gray-50 rounded p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{event.title}</div>
              <div className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('hu-HU')}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-secondary hover:underline">Szerkesztés</button>
              <button className="text-red-500 hover:underline">Törlés</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
