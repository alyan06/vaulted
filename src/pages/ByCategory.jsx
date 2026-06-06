import { useState } from 'react';
import useVaultStore, { CATEGORIES, CATEGORY_COLORS } from '../store/useVaultStore';
import EntryCard from '../components/EntryCard';
import { ChevronRightIcon } from '../components/icons';

function CategoryGroup({ category, entries }) {
  const [openSubs, setOpenSubs] = useState({});
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  const bySubcategory = entries.reduce((acc, e) => {
    const key = e.subcategory || 'Uncategorised';
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const toggle = (sub) => setOpenSubs((v) => ({ ...v, [sub]: !v[sub] }));

  if (!entries.length) return null;

  return (
    <div className="mb-8">
      <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${colors.border}`}>
        <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
        <h2 className="font-display text-ink-900 text-2xl font-bold">{category}</h2>
        <span className={`text-xs font-semibold font-ui px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
          {entries.length}
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(bySubcategory)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([sub, subEntries]) => {
            const isOpen = openSubs[sub] !== false;
            return (
              <div key={sub} className="bg-cream-50 rounded-xl border border-cream-300 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                <button
                  onClick={() => toggle(sub)}
                  className="flex items-center justify-between w-full px-5 py-3 text-left hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-ui font-semibold text-ink-900">{sub}</span>
                    <span className="text-xs text-ink-400 font-ui">
                      {subEntries.length} {subEntries.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                  <ChevronRightIcon
                    size={16}
                    className={`text-ink-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subEntries
                      .sort((a, b) => b.rating - a.rating)
                      .map((entry) => (
                        <EntryCard key={entry.id} entry={entry} />
                      ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function ByCategory() {
  const entries = useVaultStore((s) => s.entries);

  const byCategory = Object.keys(CATEGORIES).reduce((acc, cat) => {
    acc[cat] = entries.filter((e) => e.category === cat);
    return acc;
  }, {});

  const otherEntries = entries.filter((e) => !Object.keys(CATEGORIES).includes(e.category));
  if (otherEntries.length) byCategory['Other'] = [...(byCategory['Other'] || []), ...otherEntries];

  const hasEntries = entries.length > 0;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="font-display text-ink-900 text-3xl font-bold mb-2">By Category</h1>
      <p className="text-ink-500 font-ui text-sm mb-8">Browse your vault organised by category and type.</p>

      {hasEntries ? (
        Object.entries(byCategory).map(([cat, catEntries]) =>
          catEntries.length ? (
            <CategoryGroup key={cat} category={cat} entries={catEntries} />
          ) : null
        )
      ) : (
        <div className="text-center py-20">
          <p className="font-display text-ink-400 text-xl">Nothing here yet</p>
          <p className="text-ink-400 font-ui text-sm mt-2">Add entries to see them grouped by category.</p>
        </div>
      )}
    </div>
  );
}

export default ByCategory;
