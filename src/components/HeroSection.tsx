export default function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-[600px] text-center">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.45] contrast-90 saturate-75"
        src="/images/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 z-10 bg-black/45" aria-hidden="true" />
      <div className="relative z-20 w-full flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">Törökbálinti Ifjúsági Önkormányzat</h1>
        <p className="text-lg md:text-2xl mb-8 text-white drop-shadow">Fiatalokért, közösségben, Törökbálinton</p>
        <a href="/esemenyeink" className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-secondary hover:text-white transition-all">Eseményeink megtekintése</a>
      </div>
    </section>
  )
}