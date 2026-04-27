
"use client";
import HeroSection from './components/HeroSection'
import PostsSection from './components/PostsSection'
import HomeHighlights from './components/HomeHighlights'
// import Gallery from '../components/Gallery'
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <HeroSection />

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="premium-surface rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="section-label">Aktuális</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Mi történik most<br className="sm:hidden" /> a{' '}
                <span className="text-sky-500">TIFO</span>-nál?
              </h2>
            </div>
            <a
              href="/esemenyeink"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-800 transition-colors shrink-0 group"
            >
              Összes esemény
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </div>

          <HomeHighlights />

          <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
            <a href="/rolunk" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all text-slate-700 font-medium flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-semibold text-slate-900">Rólunk</div>
                <div className="text-xs text-slate-400 mt-0.5">Ki is a TIFO?</div>
              </div>
            </a>
            <a href="/kapcsolat" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all text-slate-700 font-medium flex items-center gap-3">
              <span className="text-2xl">✉️</span>
              <div>
                <div className="font-semibold text-slate-900">Kapcsolat</div>
                <div className="text-xs text-slate-400 mt-0.5">Írj nekünk!</div>
              </div>
            </a>
            <a href="/posts" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all text-slate-700 font-medium flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-semibold text-slate-900">Közösségi posztok</div>
                <div className="text-xs text-slate-400 mt-0.5">A közösség hangja</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Galéria szekció ideiglenesen eltávolítva */}

      <PostsSection />
    </motion.main>
  )
}
      {/* Galéria szekció ideiglenesen eltávolítva */}
