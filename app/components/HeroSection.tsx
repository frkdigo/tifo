"use client";
import React, { useEffect, useRef, useState } from "react";

const heroImages = [
  "/images/herokep_1.jpg",
  "/images/herokep_2.jpg",
  "/images/herokep_3.jpg",
  "/images/herokep_4.jpg",
  "/images/herokep_5.jpg",
  "/images/herokep_6.jpg",
  "/images/herokep_7.jpg",
  "/images/herokep_8.jpg",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Automatikus váltás 5 másodpercenként
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);


  // Kattintásra váltson a következő képre
  const nextImage = () => setCurrent((prev) => (prev + 1) % heroImages.length);

  return (
    <section className="relative overflow-hidden flex items-center justify-center min-h-[87svh] text-center" onClick={nextImage} style={{cursor: 'pointer'}}>
      {/* Képek fade animációval */}
      <div className="absolute inset-0 w-full h-full z-0">
        {heroImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt="Hero background"
            className={`w-full h-full object-cover absolute inset-0 brightness-[0.38] contrast-95 saturate-80 transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
            style={{zIndex: idx === current ? 1 : 0}}
            draggable={false}
          />
        ))}
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-black/40 to-black/65" aria-hidden="true" />

      <div className="relative z-20 w-full flex flex-col items-center justify-center py-28 px-4">
        {/* Live badge */}
        <span className="hero-badge mb-8">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Törökbálint &bull; Ifjúsági Önkormányzat
        </span>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.92] tracking-tight mb-6 drop-shadow-2xl">
          Törökbálinti<br />
          <span className="text-sky-300">Ifjúsági</span><br />
          Önkormányzat
        </h1>

        <p className="text-lg md:text-xl mb-10 text-white/80 max-w-xl font-medium leading-relaxed">
          Fiatalokért, közösségben, Törökbálinton
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="/kapcsolat"
            className="inline-flex items-center gap-2 bg-sky-400 text-slate-900 font-black px-8 py-4 rounded-full shadow-xl hover:bg-sky-300 hover:scale-105 active:scale-95 transition-all duration-200 text-base tracking-tight"
          >
            Csatlakozz most
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </a>
          <a
            href="/esemenyeink"
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/25 transition-all duration-200 text-base"
          >
            Eseményeink megtekintése
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 pointer-events-none" aria-hidden="true">
        <span className="text-[10px] tracking-widest uppercase">Görgetés</span>
        <div className="w-px h-8 bg-white/25" />
      </div>
    </section>
  )
}
