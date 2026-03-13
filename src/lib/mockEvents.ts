export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  location?: string;
};

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tavaszi Ifjúsági Piknik',
    date: '2026-04-20',
    description: 'Csatlakozz hozzánk egy vidám, tavaszi piknikre a Törökbálinti tóparton! Zene, játékok, jó társaság.',
    image: '/images/piknik.jpg',
    location: 'Törökbálinti tó',
  },
  {
    id: '2',
    title: 'Közösségi Filmest',
    date: '2026-05-10',
    description: 'Vetítés a szabadban, popcorn, barátok és jó hangulat. Hozd el a kedvenc pléded!',
    image: '/images/filmest.jpg',
    location: 'Művelődési Ház kertje',
  },
  {
    id: '3',
    title: 'Nyári Buli',
    date: '2026-07-01',
    description: 'Fergeteges nyári buli DJ-vel, tánccal, fényekkel és meglepetésekkel! Ne maradj le az év legjobb estéjéről!',
    image: '/images/buli.jpg',
    location: 'Ifjúsági Klub',
  },
];
