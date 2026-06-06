import { useState } from 'react';
import { CATEGORIES } from '../store/useVaultStore';
import { FilterIcon, SortIcon, XIcon } from './icons';

const defaultFilters = {
  category: '',
  subcategory: '',
  location: '',
  ratingMin: 1,
  ratingMax: 10,
  dateFrom: '',
  dateTo: '',
};

const defaultSort = { field: 'date', order: 'desc' };

function FilterBar({ filters, setFilters, sort, setSort, totalCount, filteredCount }) {
  const [expanded, setExpanded] = useState(false);

  const subcategories = filters.category ? CATEGORIES[filters.category] || [] : [];
  const hasActiveFilters =
    filters.category ||
    filters.subcategory ||
    filters.location ||
    filters.ratingMin !== 1 ||
    filters.ratingMax !== 10 ||
    filters.dateFrom ||
    filters.dateTo;

  const reset = () => {
    setFilters(defaultFilters);
    setSort(defaultSort);
  };

  return (
    <div className="bg-cream-50 border border-cream-300 rounded-xl mb-6 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-cream-200">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors cursor-pointer font-ui"
          aria-expanded={expanded}
        >
          <FilterIcon size={16} className="text-terra-500" />
          Filters
          {hasActiveFilters && (
            <span className="bg-terra-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
              !
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <SortIcon size={16} className="text-ink-500" />
          <select
            value={`${sort.field}-${sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSort({ field, order });
            }}
            className="text-sm border-0 bg-transparent text-ink-700 font-ui cursor-pointer focus:outline-none pr-1"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="rating-desc">Highest rated</option>
            <option value="rating-asc">Lowest rated</option>
            <option value="title-asc">A → Z</option>
            <option value="title-desc">Z → A</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-terra-500 hover:text-terra-600 font-medium font-ui cursor-pointer transition-colors ml-2"
              title="Clear all filters"
            >
              <XIcon size={14} />
              Clear
            </button>
          )}
        </div>

        <span className="text-xs text-ink-500 font-ui ml-2 whitespace-nowrap">
          {filteredCount !== totalCount
            ? `${filteredCount} of ${totalCount}`
            : `${totalCount} entries`}
        </span>
      </div>

      {expanded && (
        <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-ui">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, subcategory: '' })}
              className="w-full text-sm border border-cream-300 rounded-lg px-2.5 py-1.5 bg-white text-ink-900 font-ui focus:outline-none focus:border-terra-400 focus:ring-1 focus:ring-terra-200"
            >
              <option value="">All categories</option>
              {Object.keys(CATEGORIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-ui">Subcategory</label>
            <select
              value={filters.subcategory}
              onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
              disabled={!filters.category}
              className="w-full text-sm border border-cream-300 rounded-lg px-2.5 py-1.5 bg-white text-ink-900 font-ui focus:outline-none focus:border-terra-400 focus:ring-1 focus:ring-terra-200 disabled:opacity-50"
            >
              <option value="">All types</option>
              {subcategories.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-ui">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="City or country..."
              className="w-full text-sm border border-cream-300 rounded-lg px-2.5 py-1.5 bg-white text-ink-900 font-ui placeholder:text-ink-300 focus:outline-none focus:border-terra-400 focus:ring-1 focus:ring-terra-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-ui">
              Rating: {filters.ratingMin}–{filters.ratingMax}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1} max={10}
                value={filters.ratingMin}
                onChange={(e) => setFilters({ ...filters, ratingMin: Number(e.target.value) })}
                className="w-16 text-sm border border-cream-300 rounded-lg px-2 py-1.5 bg-white text-ink-900 font-ui text-center focus:outline-none focus:border-terra-400"
              />
              <span className="text-ink-400 text-xs font-ui">to</span>
              <input
                type="number"
                min={1} max={10}
                value={filters.ratingMax}
                onChange={(e) => setFilters({ ...filters, ratingMax: Number(e.target.value) })}
                className="w-16 text-sm border border-cream-300 rounded-lg px-2 py-1.5 bg-white text-ink-900 font-ui text-center focus:outline-none focus:border-terra-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-ui">Date from</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full text-sm border border-cream-300 rounded-lg px-2.5 py-1.5 bg-white text-ink-900 font-ui focus:outline-none focus:border-terra-400 focus:ring-1 focus:ring-terra-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-ui">Date to</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full text-sm border border-cream-300 rounded-lg px-2.5 py-1.5 bg-white text-ink-900 font-ui focus:outline-none focus:border-terra-400 focus:ring-1 focus:ring-terra-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { defaultFilters, defaultSort };
export default FilterBar;
