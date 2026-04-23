// import { Event } from '../../lib/mockEvents'
// Az Event típust a Supabase-ből kapott adatok alapján határozzuk meg

import { motion } from "framer-motion";
import { useAuth } from '../components/AuthProvider';

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
    <motion.div
      className="group bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_32px_-12px_rgba(15,23,42,0.18)] hover:shadow-[0_16px_40px_-10px_rgba(56,189,248,0.18)] transition-all duration-200 flex flex-col overflow-hidden h-full border border-slate-100 dark:border-slate-800 hover:scale-[1.025] focus-within:scale-[1.025]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      tabIndex={0}
    >
      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover bg-slate-100 dark:bg-slate-800 transition-all duration-200 group-hover:brightness-95 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 text-4xl font-bold">
          ?
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col gap-2">
        <h2 className="font-extrabold text-xl md:text-2xl text-slate-900 dark:text-white mb-1 truncate" title={event.title}>{event.title}</h2>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-sky-500 bg-sky-100 dark:bg-sky-900/40 rounded-full px-3 py-1">
            {new Date(event.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          {event.location && (
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 truncate" title={event.location}>
              <svg className="inline w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 10c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z" /></svg>
              {event.location}
            </span>
          )}
        </div>
        <p className="text-slate-700 dark:text-slate-200 mb-2 line-clamp-3 min-h-[72px] leading-relaxed">{event.description}</p>
        {user && user.isAdmin && (
          <button className="mt-2 w-full bg-blue-900 text-white py-2 rounded-xl hover:bg-blue-800 transition-colors font-semibold text-sm shadow-sm">
            Szerkesztés
          </button>
        )}
      </div>
    </motion.div>
  );
}
