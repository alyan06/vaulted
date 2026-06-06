import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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

// Supabase uses created_at (snake_case); the app uses createdAt (camelCase).
const normalize = (row) => ({ ...row, createdAt: row.created_at });

const useVaultStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  formModal: { open: false, entry: null },
  detailId: null,

  fetchEntries: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ entries: data.map(normalize), loading: false });
    }
  },

  // Throws on failure so callers (e.g. EntryForm) can catch and show inline errors.
  addEntry: async (data) => {
    // Strip client-only / generated fields before inserting.
    const { id: _id, createdAt: _ca, created_at: _ca2, ...payload } = data;

    const { data: row, error } = await supabase
      .from('entries')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);

    set((state) => ({ entries: [normalize(row), ...state.entries] }));
  },

  updateEntry: async (id, data) => {
    const { id: _id, createdAt: _ca, created_at: _ca2, ...payload } = data;

    const { data: row, error } = await supabase
      .from('entries')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? normalize(row) : e)),
    }));
  },

  deleteEntry: async (id) => {
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) throw new Error(error.message);

    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
      detailId: state.detailId === id ? null : state.detailId,
    }));
  },

  clearError: () => set({ error: null }),
  openForm: (entry = null) => set({ formModal: { open: true, entry } }),
  closeForm: () => set({ formModal: { open: false, entry: null } }),
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),
}));

export default useVaultStore;
