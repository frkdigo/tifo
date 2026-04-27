"use client";
import React, { useState, useEffect } from 'react';
import GalleryUpload, { GalleryTopic, GalleryImage } from './GalleryUpload';
import { useUser } from '../app/lib/useUser';
import { uploadGalleryImageToStorage } from '../lib/uploadGalleryImageToStorage';
import { supabase } from '../lib/supabaseClient';


// Dummy témák és képek
const initialTopics: GalleryTopic[] = [
  { id: '1', name: 'Alapértelmezett téma' },
];
const initialImages: GalleryImage[] = [
  {
    src: '/images/450386206_992128892703656_8737641397939424641_n.jpg',
    title: 'TIFO',
    subtitle: 'photography / creative direction',
    info: 'Ez egy példa leírás a galéria képhez.',
    topicId: '1',
  },
];

export default function Gallery() {
  const { user } = useUser();
  const [topics, setTopics] = useState<GalleryTopic[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
    // Témák betöltése
    async function fetchTopics() {
      const { data, error } = await supabase.from('gallery_topics').select('*').order('name');
      if (!error && data) setTopics(data);
    }

    // Képek betöltése
    async function fetchImages() {
      const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
      if (!error && data) setImages(data);
    }

    useEffect(() => {
      fetchTopics();
      fetchImages();
    }, []);
  const [current, setCurrent] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const image = images[current];

  // Téma létrehozása Supabase-ben
  async function handleCreateTopic(name: string) {
    const { data, error } = await supabase
      .from('gallery_topics')
      .insert([{ name }])
      .select()
      .single();
    if (error) {
      alert('Hiba a téma létrehozásakor: ' + error.message);
      return;
    }
    await fetchTopics();
    alert(`Új téma létrehozva: ${name}`);
  }

  // Kép feltöltése Supabase storage-ba és DB-be
  async function handleUploadImage(file: File, topicId: string) {
    if (!user) return;
    try {
      // 1. Kép feltöltése storage-ba
      const publicUrl = await uploadGalleryImageToStorage(file, topicId, user.email);
      // 2. Metaadat beszúrása DB-be
      const { error } = await supabase
        .from('gallery_images')
        .insert([
          {
            src: publicUrl,
            title: file.name,
            subtitle: 'Feltöltött kép',
            info: '',
            topic_id: topicId,
          },
        ]);
      if (error) {
        alert('Hiba a kép mentésekor: ' + error.message);
        return;
      }
      await fetchImages();
      alert(`Kép feltöltve: ${file.name}`);
    } catch (e: any) {
      alert('Hiba a feltöltés során: ' + e.message);
    }
  }

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
        <span className="font-bold tracking-widest text-gray-700 text-lg">DIRECTOR</span>
        <div className="text-xs text-gray-400">TÖRÖKBÁLINTI IFJÚSÁGI ÖNKORMÁNYZAT</div>
      </div>

      {/* Admin feltöltő */}
      {user?.isAdmin && (
        <>
          {!showUpload && (
            <button
              className="px-6 py-2 rounded bg-black text-white font-semibold mt-8 mb-4 hover:bg-gray-800 transition"
              onClick={() => setShowUpload(true)}
            >
              Kép feltöltés
            </button>
          )}
          {showUpload && (
            <GalleryUpload
              topics={topics}
              onCreateTopic={handleCreateTopic}
              onUploadImage={handleUploadImage}
            />
          )}
        </>
      )}
  // ...
  const [showUpload, setShowUpload] = useState(false);

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
            key={img.src + idx}
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
