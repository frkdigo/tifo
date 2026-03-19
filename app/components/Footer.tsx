import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Főoldal' },
  { href: '/esemenyeink', label: 'Eseményeink' },
  { href: '/rolunk', label: 'Rólunk' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-black bg-black text-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <section>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300 mb-1.5">TIFO</p>
            <h2 className="text-base font-black text-white mb-1">Törökbálinti Ifjúsági Önkormányzat</h2>
            <p className="text-xs text-slate-300 leading-snug max-w-md">
              Fiatalok által, fiatalokért. Közösségi események, aktív részvétel és helyi értékteremtés Törökbálinton.
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-semibold text-white mb-1 uppercase tracking-wide">Gyors linkek</h3>
            <ul className="space-y-1">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-slate-300 hover:text-sky-300 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[10px] font-semibold text-white mb-1 uppercase tracking-wide">Kapcsolat</h3>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>
                Email:{' '}
                <a href="mailto:info@tifo.hu" className="hover:text-sky-300 transition-colors">info@tifo.hu</a>
              </li>
            </ul>
          </section>
        </div>
        <div className="mt-6 text-xs text-slate-400 text-center">&copy; {year} TIFO. Minden jog fenntartva.</div>
      </div>
    </footer>
  );
}
