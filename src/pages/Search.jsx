import { useState, useMemo } from 'react';
import useVaultStore from '../store/useVaultStore';
import EntryCard from '../components/EntryCard';
import { SearchIcon } from '../components/icons';

function highlight(text, query) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-gold-400/30 text-ink-900 rounded px-0.5">{part}</mark>
      : part
  );
}

function SearchPage() {
  const entries = useVaultStore((s) => s.entries);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return entries.filter((e) => {
      return (
        e.title?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.subcategory?.toLowerCase().includes(q) ||
        e.notes?.toLowerCase().includes(q) ||
        e.location?.city?.toLowerCase().includes(q) ||
        e.location?.country?.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      const aTitle = a.title?.toLowerCase().includes(q) ? 1 : 0;
      const bTitle = b.title?.toLowerCase().includes(q) ? 1 : 0;
      if (bTitle !== aTitle) return bTitle - aTitle;
      return b.rating - a.rating;
    });
  }, [entries, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="font-display text-ink-900 text-3xl font-bold mb-2">Search</h1>
      <p className="text-ink-500 font-ui text-sm mb-6">Search across titles, categories, locations, and notes.</p>

      {/* Search input */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <SearchIcon size={20} className="text-ink-300" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your vault..."
          autoFocus
          className="w-full pl-11 pr-4 py-3.5 bg-cream-50 border border-cream-300 rounded-xl font-ui text-ink-900 text-base placeholder:text-ink-300 focus:outline-none focus:border-terra-400 focus:ring-2 focus:ring-terra-400/20 transition-colors"
          style={{ boxShadow: 'var(--shadow-card)' }}
        />
        {query && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="text-xs text-ink-400 font-ui">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}
      </div>

      {/* Results */}
      {hasQuery && results.length > 0 && (
        <div className="space-y-3">
          {results.map((entry) => (
            <SearchResult key={entry.id} entry={entry} query={query.trim()} />
          ))}
        </div>
      )}

      {hasQuery && results.length === 0 && (
        <div className="text-center py-16">
          <SearchIcon size={36} className="text-cream-400 mx-auto mb-3" />
          <p className="font-display text-ink-400 text-lg mb-1">No results found</p>
          <p className="text-ink-400 font-ui text-sm">
            Try searching for a title, place, category, or something from your notes.
          </p>
        </div>
      )}

      {!hasQuery && (
        <div className="text-center py-16">
          <SearchIcon size={40} className="text-cream-300 mx-auto mb-4" />
          <p className="font-display text-ink-400 text-xl mb-2">Ask your vault anything</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['restaurant', 'beach', 'movie', 'Pakistan', 'ice cream', 'London'].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 bg-cream-200 hover:bg-cream-300 text-ink-700 rounded-full text-sm font-ui font-medium transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResult({ entry, query }) {
  const openDetail = useVaultStore((s) => s.openDetail);

  return (
    <button
      onClick={() => openDetail(entry.id)}
      className="w-full text-left bg-cream-50 border border-cream-300 rounded-xl p-4 hover:border-cream-400 transition-all duration-150 cursor-pointer group"
      style={{ boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-display font-semibold text-ink-900 text-base group-hover:text-terra-600 transition-colors">
          {highlight(entry.title, query)}
        </h3>
        <span className="text-xs font-ui font-bold text-gold-500 shrink-0">{entry.rating}/10</span>
      </div>
      <p className="text-xs text-ink-400 font-ui mb-1">
        {highlight(entry.category, query)} · {highlight(entry.subcategory, query)}
        {(entry.location?.city || entry.location?.country) && (
          <> · {highlight([entry.location.city, entry.location.country].filter(Boolean).join(', '), query)}</>
        )}
      </p>
      {entry.notes && (
        <p className="text-sm text-ink-500 font-ui line-clamp-2 mt-1.5">
          {highlight(entry.notes, query)}
        </p>
      )}
    </button>
  );
}

export default SearchPage;
