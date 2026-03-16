"use client";
import HeroSection from './components/HeroSection'
import PostsSection from './components/PostsSection'
import HomeHighlights from './components/HomeHighlights'

export default function Home() {
  return (
    <main>
      <HeroSection />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="premium-surface rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Aktuális</p>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900">Mi történik most a TIFO-nál?</h2>
            </div>
            <a
              href="/esemenyeink"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Összes esemény
            </a>
          </div>

          <HomeHighlights />

          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
            <a href="/rolunk" className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700">Rólunk</a>
            <a href="/kapcsolat" className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700">Kapcsolat</a>
            <a href="/posts" className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700">Közösségi posztok</a>
          </div>
        </div>
      </section>

      <PostsSection />
    </main>
  )
}
