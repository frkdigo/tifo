import React, { useState } from "react";

export type GalleryTopic = {
  id: string;
  name: string;
};

export type GalleryImage = {
  src: string;
  title: string;
  subtitle: string;
  info: string;
  topicId: string;
};

export type GalleryUploadProps = {
  topics: GalleryTopic[];
  onCreateTopic: (name: string) => void;
  onUploadImage: (file: File, topicId: string) => void;
};

export default function GalleryUpload({ topics, onCreateTopic, onUploadImage }: GalleryUploadProps) {
  const [mode, setMode] = useState<'new' | 'existing' | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "new" && newTopic && file) {
      onCreateTopic(newTopic);
      // Feltételezzük, hogy a backend visszaadja az új topic id-t, ezt tovább kell fejleszteni
      // onUploadImage(file, newTopicId)
    } else if (mode === "existing" && selectedTopic && file) {
      onUploadImage(file, selectedTopic);
    }
  }

  return (
    <form className="bg-white p-6 rounded-xl shadow max-w-md mx-auto mt-8 border border-gray-200" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Kép feltöltése</h2>
      <div className="flex gap-4 mb-4">
        <button type="button" className={`flex-1 py-2 rounded ${mode === 'new' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMode('new')}>Új téma</button>
        <button type="button" className={`flex-1 py-2 rounded ${mode === 'existing' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMode('existing')}>Meglévő téma</button>
      </div>
      {mode === 'new' && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Téma neve</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={newTopic} onChange={e => setNewTopic(e.target.value)} required />
        </div>
      )}
      {mode === 'existing' && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Téma kiválasztása</label>
          <select className="w-full border rounded px-3 py-2" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} required>
            <option value="">Válassz témát...</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Kép kiválasztása</label>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
      </div>
      <button type="submit" className="w-full py-2 rounded bg-sky-600 text-white font-semibold hover:bg-sky-700 transition">Feltöltés</button>
    </form>
  );
}
