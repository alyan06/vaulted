import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const CATEGORIES = {
  Food: ['Restaurant', 'Ice Cream', 'Chocolate', 'Pakistani Food', 'Chinese Food', 'Street Food', 'Café', 'Bakery', 'Dessert', 'Fast Food'],
  Places: ['Beach', 'City', 'Park', 'Mall', 'Museum', 'Market', 'Mountain', 'Landmark', 'Hotel'],
  Entertainment: ['Movie', 'Show', 'Concert', 'Exhibition', 'Event', 'Book', 'Game'],
  Other: ['Experience', 'Activity', 'Product', 'Service', 'Tradition'],
};

export const CATEGORY_COLORS = {
  Food: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  Places: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
  Entertainment: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400' },
  Other: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-400' },
};

const SAMPLE_ENTRIES = [
  {
    id: 'sample-1',
    title: 'Café Barbera',
    category: 'Food',
    subcategory: 'Restaurant',
    location: { city: 'Lahore', country: 'Pakistan' },
    date: '2024-03-15',
    rating: 9,
    notes: 'Incredible Italian-inspired ambiance with the most perfectly brewed espresso. The tiramisu was divine — light, creamy, and not overly sweet. The dimly lit space with exposed brick walls made for a perfect evening. The barista clearly takes their craft seriously.',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'sample-2',
    title: 'Black Raspberry Ripple Soft Serve',
    category: 'Food',
    subcategory: 'Ice Cream',
    location: { city: 'London', country: 'United Kingdom' },
    date: '2023-08-20',
    rating: 8,
    notes: 'Found this at a tiny artisan parlour near Borough Market. The colour was a stunning deep purple, almost black. The flavour — intensely fruity, with a slight tartness that balanced the sweetness perfectly. Topped with crushed roasted pistachios. Genuinely surprising.',
    createdAt: '2023-08-20T14:00:00Z',
  },
  {
    id: 'sample-3',
    title: 'Oppenheimer',
    category: 'Entertainment',
    subcategory: 'Movie',
    location: { city: 'Lahore', country: 'Pakistan' },
    date: '2023-07-22',
    rating: 10,
    notes: 'Cillian Murphy is breathtaking. Watched in IMAX — the Trinity test felt physically overwhelming. Three hours felt like thirty minutes. Nolan weaponises non-linear storytelling at its finest. The score by Ludwig Göransson is haunting long after the credits. A genuine masterpiece.',
    createdAt: '2023-07-22T19:00:00Z',
  },
  {
    id: 'sample-4',
    title: 'Clifton Beach at Sunset',
    category: 'Places',
    subcategory: 'Beach',
    location: { city: 'Karachi', country: 'Pakistan' },
    date: '2023-12-10',
    rating: 7,
    notes: 'Golden hour light hits different here — the Arabian Sea stretching to the horizon, painted in orange and rose. Chaotic and electric with street food vendors selling chaat and bhutta. Not the cleanest beach but the energy is raw and uniquely Karachi. Something to return to.',
    createdAt: '2023-12-10T17:30:00Z',
  },
  {
    id: 'sample-5',
    title: 'Lindt Excellence 90% Dark',
    category: 'Food',
    subcategory: 'Chocolate',
    location: { city: 'Geneva', country: 'Switzerland' },
    date: '2024-01-05',
    rating: 9,
    notes: 'Picked up at duty-free in Geneva. Intensely dark — almost no sweetness, just deep cocoa with a faint floral note. A single square is all you need and it satisfies completely. Has permanently raised my bar for dark chocolate. Nothing else compares at this price point.',
    createdAt: '2024-01-05T12:00:00Z',
  },
  {
    id: 'sample-6',
    title: 'Istanbul Old City',
    category: 'Places',
    subcategory: 'City',
    location: { city: 'Istanbul', country: 'Turkey' },
    date: '2024-05-18',
    rating: 10,
    notes: 'Between Hagia Sophia and the Grand Bazaar lies this impossibly layered city where continents meet. Simit sellers weaving through crowds, the call to prayer echoing across the Bosphorus, saffron light at dusk on the Galata Tower. No city has moved me like this. I left part of myself here.',
    createdAt: '2024-05-18T09:00:00Z',
  },
];

const useVaultStore = create(
  persist(
    (set, get) => ({
      entries: SAMPLE_ENTRIES,
      formModal: { open: false, entry: null },
      detailId: null,

      addEntry: (data) =>
        set((state) => ({
          entries: [
            { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
            ...state.entries,
          ],
        })),

      updateEntry: (id, data) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
          detailId: state.detailId === id ? null : state.detailId,
        })),

      openForm: (entry = null) => set({ formModal: { open: true, entry } }),
      closeForm: () => set({ formModal: { open: false, entry: null } }),

      openDetail: (id) => set({ detailId: id }),
      closeDetail: () => set({ detailId: null }),
    }),
    {
      name: 'vaulted-v1',
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);

export default useVaultStore;
