import useVaultStore, { CATEGORY_COLORS } from '../store/useVaultStore';
import EntryCard from '../components/EntryCard';
import { StarIcon, MapPinIcon, VaultIcon, PlusIcon } from '../components/icons';

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-cream-50 rounded-xl border border-cream-300 px-5 py-4" style={{ boxShadow: 'var(--shadow-card)' }}>
      <p className="text-xs font-ui font-semibold text-ink-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-display text-3xl font-bold ${accent || 'text-ink-900'}`}>{value}</p>
      {sub && <p className="text-xs text-ink-400 font-ui mt-1">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const entries = useVaultStore((s) => s.entries);
  const openForm = useVaultStore((s) => s.openForm);

  const recent = [...entries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const topRated = [...entries]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const avgRating = entries.length
    ? (entries.reduce((sum, e) => sum + e.rating, 0) / entries.length).toFixed(1)
    : '—';

  const topCountry = (() => {
    if (!entries.length) return '—';
    const counts = {};
    entries.forEach((e) => {
      const c = e.location?.country;
      if (c) counts[c] = (counts[c] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || '—';
  })();

  const categoryCounts = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const lastAdded = entries.length
    ? new Date(Math.max(...entries.map((e) => new Date(e.createdAt)))).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short',
      })
    : null;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <div className="flex items-end gap-3 mb-1">
          <VaultIcon size={32} className="text-terra-500 mb-0.5" />
          <h1 className="font-display text-ink-900 text-4xl font-bold">Your Vault</h1>
        </div>
        <p className="text-ink-500 font-ui text-base mt-1">
          Every restaurant, film, place, and flavour — all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Memories" value={entries.length} sub={lastAdded ? `Last added ${lastAdded}` : 'None yet'} accent="text-terra-500" />
        <StatCard label="Avg Rating" value={avgRating} sub="across all entries" accent="text-gold-500" />
        <StatCard label="Top Country" value={topCountry} sub="most visited" accent="text-ink-900" />
        <StatCard label="Categories" value={Object.keys(categoryCounts).length} sub={Object.keys(categoryCounts).join(', ') || '—'} />
      </div>

      {/* Category breakdown */}
      {entries.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-ink-900 text-xl font-semibold mb-3">By Category</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => {
                const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
                return (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border font-ui ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    {cat}
                    <span className={`font-bold ${colors.text} opacity-70`}>{count}</span>
                  </span>
                );
              })}
          </div>
        </div>
      )}

      {/* Top Rated */}
      {topRated.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <StarIcon size={20} className="text-gold-500" />
            <h2 className="font-display text-ink-900 text-xl font-semibold">Top Rated</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRated.map((entry, i) => (
              <div key={entry.id} className="relative">
                {i === 0 && (
                  <div className="absolute -top-2 -right-2 z-10 bg-gold-500 text-white text-xs font-bold font-ui w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                    #1
                  </div>
                )}
                <EntryCard entry={entry} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Added */}
      {recent.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-ink-900 text-xl font-semibold mb-4">Recently Added</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {recent.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-20">
          <VaultIcon size={48} className="text-cream-400 mx-auto mb-4" />
          <h2 className="font-display text-ink-900 text-2xl font-semibold mb-2">Your vault is empty</h2>
          <p className="text-ink-500 font-ui mb-6">Start logging the experiences that matter to you.</p>
          <button
            onClick={() => openForm(null)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-terra-500 hover:bg-terra-600 text-white rounded-xl font-semibold font-ui transition-colors cursor-pointer shadow-sm"
          >
            <PlusIcon size={18} />
            Add Your First Memory
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
