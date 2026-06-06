import { useState, useMemo } from 'react';
import useVaultStore from '../store/useVaultStore';
import EntryCard from '../components/EntryCard';
import FilterBar, { defaultFilters, defaultSort } from '../components/FilterBar';
import { PlusIcon } from '../components/icons';

function applyFilters(entries, filters, sort) {
  let result = [...entries];

  if (filters.category) result = result.filter((e) => e.category === filters.category);
  if (filters.subcategory) result = result.filter((e) => e.subcategory === filters.subcategory);
  if (filters.location) {
    const q = filters.location.toLowerCase();
    result = result.filter(
      (e) =>
        e.location?.city?.toLowerCase().includes(q) ||
        e.location?.country?.toLowerCase().includes(q)
    );
  }
  result = result.filter(
    (e) => e.rating >= filters.ratingMin && e.rating <= filters.ratingMax
  );
  if (filters.dateFrom) result = result.filter((e) => e.date >= filters.dateFrom);
  if (filters.dateTo) result = result.filter((e) => e.date <= filters.dateTo);

  result.sort((a, b) => {
    let cmp = 0;
    if (sort.field === 'date') cmp = (a.date || '').localeCompare(b.date || '');
    if (sort.field === 'rating') cmp = a.rating - b.rating;
    if (sort.field === 'title') cmp = a.title.localeCompare(b.title);
    return sort.order === 'desc' ? -cmp : cmp;
  });

  return result;
}

function AllEntries() {
  const entries = useVaultStore((s) => s.entries);
  const openForm = useVaultStore((s) => s.openForm);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState(defaultSort);

  const filtered = useMemo(() => applyFilters(entries, filters, sort), [entries, filters, sort]);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-ink-900 text-3xl font-bold">All Entries</h1>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 px-4 py-2 bg-terra-500 hover:bg-terra-600 text-white rounded-lg text-sm font-semibold font-ui transition-colors cursor-pointer shadow-sm"
        >
          <PlusIcon size={16} />
          Add Entry
        </button>
      </div>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        totalCount={entries.length}
        filteredCount={filtered.length}
      />

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-display text-ink-400 text-xl mb-2">No entries found</p>
          <p className="text-ink-400 font-ui text-sm">Try adjusting your filters or add a new entry.</p>
        </div>
      )}
    </div>
  );
}

export default AllEntries;
