import useVaultStore, { CATEGORY_COLORS } from '../store/useVaultStore';
import { CalendarIcon, MapPinIcon, TagIcon, StarIcon } from './icons';

function RatingBadge({ rating }) {
  const getColor = () => {
    if (rating >= 9) return 'bg-terra-500 text-white';
    if (rating >= 7) return 'bg-gold-500 text-white';
    if (rating >= 5) return 'bg-amber-100 text-amber-800';
    return 'bg-cream-300 text-ink-700';
  };
  return (
    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold font-ui ${getColor()}`}>
      <StarIcon size={11} />
      {rating}
    </span>
  );
}

function EntryCard({ entry }) {
  const openDetail = useVaultStore((s) => s.openDetail);
  const colors = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Other;

  const formattedDate = entry.date
    ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  return (
    <article
      onClick={() => openDetail(entry.id)}
      className="group bg-cream-50 rounded-xl border border-cream-300 cursor-pointer transition-all duration-200 hover:border-cream-400 overflow-hidden"
      style={{
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display text-ink-900 font-semibold text-lg leading-snug flex-1 group-hover:text-terra-600 transition-colors">
            {entry.title}
          </h3>
          <RatingBadge rating={entry.rating} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border font-ui ${colors.bg} ${colors.text} ${colors.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {entry.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cream-200 text-ink-700 border border-cream-300 font-ui">
            <TagIcon size={11} />
            {entry.subcategory}
          </span>
        </div>

        {entry.notes && (
          <p className="text-ink-500 text-sm leading-relaxed line-clamp-2 mb-3 font-ui">
            {entry.notes}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {(entry.location?.city || entry.location?.country) && (
            <span className="inline-flex items-center gap-1 text-xs text-ink-500 font-ui">
              <MapPinIcon size={13} className="text-terra-400 shrink-0" />
              {[entry.location.city, entry.location.country].filter(Boolean).join(', ')}
            </span>
          )}
          {formattedDate && (
            <span className="inline-flex items-center gap-1 text-xs text-ink-500 font-ui">
              <CalendarIcon size={13} className="text-ink-300 shrink-0" />
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      <div className={`h-0.5 w-full ${colors.dot} opacity-40 group-hover:opacity-80 transition-opacity`} />
    </article>
  );
}

export default EntryCard;
