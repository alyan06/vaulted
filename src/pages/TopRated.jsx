import useVaultStore, { CATEGORY_COLORS } from '../store/useVaultStore';
import EntryCard from '../components/EntryCard';
import { StarIcon } from '../components/icons';

function RankBadge({ rank }) {
  if (rank === 1) return (
    <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-gold-500 text-white font-bold font-ui text-sm rounded-full flex items-center justify-center shadow-md">
      #1
    </div>
  );
  if (rank === 2) return (
    <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-ink-300 text-white font-bold font-ui text-xs rounded-full flex items-center justify-center shadow-sm">
      #2
    </div>
  );
  if (rank === 3) return (
    <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-terra-400 text-white font-bold font-ui text-xs rounded-full flex items-center justify-center shadow-sm">
      #3
    </div>
  );
  return null;
}

function TopRated() {
  const entries = useVaultStore((s) => s.entries);

  const sorted = [...entries].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const byRating = sorted.reduce((acc, e) => {
    const r = e.rating;
    if (!acc[r]) acc[r] = [];
    acc[r].push(e);
    return acc;
  }, {});

  const ratingGroups = Object.entries(byRating)
    .sort((a, b) => Number(b[0]) - Number(a[0]));

  let rankCounter = 0;

  const getRatingLabel = (r) => {
    const num = Number(r);
    if (num === 10) return 'Perfect';
    if (num >= 9) return 'Outstanding';
    if (num >= 8) return 'Excellent';
    if (num >= 7) return 'Very Good';
    if (num >= 6) return 'Good';
    if (num >= 5) return 'Decent';
    return 'Below Average';
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <StarIcon size={28} className="text-gold-500" />
        <h1 className="font-display text-ink-900 text-3xl font-bold">Top Rated</h1>
      </div>
      <p className="text-ink-500 font-ui text-sm mb-8">Your best experiences, ranked by rating.</p>

      {sorted.length > 0 ? (
        <div className="space-y-8">
          {ratingGroups.map(([rating, group]) => (
            <div key={rating}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-ink-900 text-white px-3 py-1 rounded-full">
                  <StarIcon size={13} className="text-gold-400" />
                  <span className="font-ui font-bold text-sm">{rating}</span>
                </div>
                <span className="font-display text-ink-700 text-lg font-semibold">{getRatingLabel(rating)}</span>
                <span className="text-xs text-ink-400 font-ui">
                  {group.length} {group.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.map((entry) => {
                  rankCounter++;
                  const rank = rankCounter;
                  return (
                    <div key={entry.id} className="relative">
                      {rank <= 3 && <RankBadge rank={rank} />}
                      <EntryCard entry={entry} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <StarIcon size={40} className="text-cream-400 mx-auto mb-4" />
          <p className="font-display text-ink-400 text-xl">No entries yet</p>
          <p className="text-ink-400 font-ui text-sm mt-2">Add entries and rate them to see your top picks here.</p>
        </div>
      )}
    </div>
  );
}

export default TopRated;
