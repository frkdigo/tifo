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
    <footer className="relative mt-8 border-t border-slate-800 bg-slate-950 text-slate-200 overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[72%]"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(125,211,252,0.75) 50%, transparent 100%)',
          boxShadow: '0 0 18px rgba(56,189,248,0.45)',
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 12% -10%, rgba(56,189,248,0.25), transparent 35%), radial-gradient(circle at 82% 120%, rgba(30,41,59,0.65), transparent 38%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-5">
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
