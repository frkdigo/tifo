import React, { useState } from 'react';

// Példa képek (cseréld le a sajátjaidra)
const images = [
  {
    src: '/images/450386206_992128892703656_8737641397939424641_n.jpg',
    title: 'SILENT BLOOM',
    subtitle: 'photography / creative direction',
    info: 'Ez egy példa leírás a galéria képhez.'
  },
  // További képek hozzáadhatók ide
];

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const image = images[current];

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
        <span className="font-bold tracking-widest text-gray-700 text-lg">DIRECTOR</span>
        <div className="text-xs text-gray-400">MEDIA GALLERY SLIDER</div>
      </div>

      {/* Kép */}
      <div className="w-full max-w-4xl aspect-video flex items-center justify-center relative">
        <img
          src={image.src}
          alt={image.title}
          className="object-cover w-full h-full rounded-xl shadow-lg border border-gray-200"
        />
        {/* Bal nyíl */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow z-10"
          aria-label="Előző kép"
        >
          &#8592;
        </button>
        {/* Jobb nyíl */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow z-10"
          aria-label="Következő kép"
        >
          &#8594;
        </button>
        {/* Overlay szöveg */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60">
          <span className="uppercase text-sm tracking-widest text-gray-500 mb-2">IMAGE</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-2 text-center drop-shadow-lg">{image.title}</h1>
          <div className="text-gray-700 text-base mb-4">{image.subtitle}</div>
          {showInfo && (
            <div className="text-gray-600 text-sm mb-4 max-w-md text-center">{image.info}</div>
          )}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-4 py-1 bg-gray-900 text-white rounded-full text-xs shadow hover:bg-gray-700 transition"
          >
            {showInfo ? 'HIDE INFO' : 'SHOW INFO'}
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-6">
        {images.map((img, idx) => (
          <button
            key={img.src}
            onClick={() => setCurrent(idx)}
            className={`w-16 h-10 rounded border-2 ${idx === current ? 'border-gray-900' : 'border-gray-200'} overflow-hidden`}
          >
            <img src={img.src} alt={img.title} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
