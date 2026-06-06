import { useState } from 'react';
import useVaultStore, { CATEGORY_COLORS } from '../store/useVaultStore';
import { XIcon, EditIcon, TrashIcon, MapPinIcon, CalendarIcon, TagIcon, StarIcon } from './icons';

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }, (_, i) => (
        <StarIcon
          key={i}
          size={16}
          filled={i < rating}
          className={i < rating ? 'text-gold-500' : 'text-cream-300'}
        />
      ))}
      <span className="ml-2 font-display text-2xl font-bold text-ink-900">{rating}</span>
      <span className="text-ink-400 text-sm font-ui ml-0.5">/10</span>
    </div>
  );
}

function EntryDetail() {
  const { detailId, entries, closeDetail, openForm, deleteEntry } = useVaultStore((s) => ({
    detailId: s.detailId,
    entries: s.entries,
    closeDetail: s.closeDetail,
    openForm: s.openForm,
    deleteEntry: s.deleteEntry,
  }));

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const entry = entries.find((e) => e.id === detailId);
  if (!entry) return null;

  const colors = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Other;

  const formattedDate = entry.date
    ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  const createdDate = new Date(entry.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleClose = () => {
    if (!deleting) { closeDetail(); setConfirmDelete(false); setDeleteError(null); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteEntry(entry.id);
    } catch (err) {
      setDeleteError(err.message || 'Delete failed. Please try again.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26, 12, 6, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={entry.title}
    >
      <div
        className="bg-cream-50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        {/* Category accent bar */}
        <div className={`h-1.5 rounded-t-2xl ${colors.dot}`} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border font-ui ${colors.bg} ${colors.text} ${colors.border}`}>
                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  {entry.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cream-200 text-ink-700 border border-cream-300 font-ui">
                  <TagIcon size={11} />
                  {entry.subcategory}
                </span>
              </div>
              <h2 className="font-display text-ink-900 text-2xl font-bold leading-tight">
                {entry.title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={deleting}
              className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-cream-200 rounded-lg transition-colors cursor-pointer shrink-0 mt-1 disabled:opacity-40"
              title="Close"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="px-6 pb-4 border-b border-cream-200">
          <StarRow rating={entry.rating} />
        </div>

        {/* Meta */}
        <div className="px-6 py-4 flex flex-wrap gap-4 border-b border-cream-200">
          {(entry.location?.city || entry.location?.country) && (
            <div className="flex items-start gap-2">
              <MapPinIcon size={16} className="text-terra-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-400 font-ui uppercase tracking-wide">Location</p>
                <p className="text-sm font-medium text-ink-900 font-ui">
                  {[entry.location.city, entry.location.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}
          {formattedDate && (
            <div className="flex items-start gap-2">
              <CalendarIcon size={16} className="text-ink-300 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-400 font-ui uppercase tracking-wide">Date</p>
                <p className="text-sm font-medium text-ink-900 font-ui">{formattedDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {entry.notes && (
          <div className="px-6 py-5">
            <p className="text-xs text-ink-400 font-ui uppercase tracking-wide mb-2">Notes</p>
            <p className="text-ink-700 text-sm leading-relaxed font-ui whitespace-pre-line">
              {entry.notes}
            </p>
          </div>
        )}

        {/* Delete error */}
        {deleteError && (
          <div className="mx-6 mb-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-xs text-red-700 font-ui">{deleteError}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cream-200 bg-cream-100/60 rounded-b-2xl flex items-center justify-between gap-3">
          <p className="text-xs text-ink-400 font-ui">Added {createdDate}</p>
          <div className="flex items-center gap-2">
            {confirmDelete ? (
              <>
                <span className="text-xs text-red-600 font-ui font-medium">Are you sure?</span>
                <button
                  onClick={() => { setConfirmDelete(false); setDeleteError(null); }}
                  disabled={deleting}
                  className="px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-cream-200 rounded-lg transition-colors cursor-pointer font-ui border border-cream-300 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer font-ui disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : <TrashIcon size={14} />}
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors cursor-pointer font-ui border border-transparent hover:border-red-200"
                  title="Delete entry"
                >
                  <TrashIcon size={14} />
                  Delete
                </button>
                <button
                  onClick={() => { closeDetail(); openForm(entry); }}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-terra-500 hover:bg-terra-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer font-ui shadow-sm"
                >
                  <EditIcon size={14} />
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryDetail;
