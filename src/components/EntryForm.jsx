import { useState, useEffect } from 'react';
import useVaultStore, { CATEGORIES } from '../store/useVaultStore';
import { useShallow } from 'zustand/shallow';
import { XIcon, VaultIcon } from './icons';

const BLANK = {
  title: '',
  category: 'Food',
  subcategory: '',
  location: { city: '', country: '' },
  date: new Date().toISOString().slice(0, 10),
  rating: 7,
  notes: '',
};

function EntryForm() {
  const { formModal, closeForm, addEntry, updateEntry } = useVaultStore(useShallow((s) => ({
    formModal: s.formModal,
    closeForm: s.closeForm,
    addEntry: s.addEntry,
    updateEntry: s.updateEntry,
  })));

  const isEdit = !!formModal.entry;
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (formModal.entry) {
      setForm({ ...BLANK, ...formModal.entry, location: { ...BLANK.location, ...formModal.entry.location } });
    } else {
      setForm(BLANK);
    }
    setErrors({});
    setSubmitError(null);
  }, [formModal.entry]);

  const subcategories = CATEGORIES[form.category] || [];

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setLoc = (key, val) => setForm((f) => ({ ...f, location: { ...f.location, [key]: val } }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.subcategory) e.subcategory = 'Please select a type';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (isEdit) {
        await updateEntry(formModal.entry.id, form);
      } else {
        await addEntry(form);
      }
      closeForm();
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full border border-cream-300 rounded-lg px-3 py-2 text-ink-900 bg-white font-ui text-sm focus:outline-none focus:border-terra-400 focus:ring-2 focus:ring-terra-400/20 transition-colors placeholder:text-ink-300 disabled:opacity-60';
  const labelClass = 'block text-xs font-semibold text-ink-500 mb-1 font-ui uppercase tracking-wide';
  const errorClass = 'text-xs text-red-500 mt-1 font-ui';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26, 12, 6, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) closeForm(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit entry' : 'Add new entry'}
    >
      <div
        className="bg-cream-50 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative"
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 sticky top-0 bg-cream-50 rounded-t-2xl z-10">
          <div className="flex items-center gap-2.5">
            <VaultIcon size={22} className="text-terra-500" />
            <h2 className="font-display text-ink-900 text-lg font-semibold">
              {isEdit ? 'Edit Memory' : 'Vault a Memory'}
            </h2>
          </div>
          <button
            onClick={closeForm}
            disabled={submitting}
            className="p-1.5 text-ink-500 hover:text-ink-900 hover:bg-cream-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
            title="Close"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="ef-title" className={labelClass}>Title *</label>
              <input
                id="ef-title"
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Café Barbera, Oppenheimer, Clifton Beach..."
                className={inputClass}
                disabled={submitting}
                autoFocus
              />
              {errors.title && <p className={errorClass}>{errors.title}</p>}
            </div>

            {/* Category + Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ef-category" className={labelClass}>Category *</label>
                <select
                  id="ef-category"
                  value={form.category}
                  onChange={(e) => { set('category', e.target.value); set('subcategory', ''); }}
                  className={inputClass}
                  disabled={submitting}
                >
                  {Object.keys(CATEGORIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ef-subcategory" className={labelClass}>Type *</label>
                <select
                  id="ef-subcategory"
                  value={form.subcategory}
                  onChange={(e) => set('subcategory', e.target.value)}
                  className={inputClass}
                  disabled={submitting}
                >
                  <option value="">Select type…</option>
                  {subcategories.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.subcategory && <p className={errorClass}>{errors.subcategory}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ef-city" className={labelClass}>City</label>
                <input
                  id="ef-city"
                  type="text"
                  value={form.location.city}
                  onChange={(e) => setLoc('city', e.target.value)}
                  placeholder="e.g. Lahore"
                  className={inputClass}
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="ef-country" className={labelClass}>Country</label>
                <input
                  id="ef-country"
                  type="text"
                  value={form.location.country}
                  onChange={(e) => setLoc('country', e.target.value)}
                  placeholder="e.g. Pakistan"
                  className={inputClass}
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="ef-date" className={labelClass}>Date</label>
              <input
                id="ef-date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={inputClass}
                disabled={submitting}
              />
            </div>

            {/* Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="ef-rating" className={labelClass}>Rating</label>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-2xl font-bold text-terra-500">{form.rating}</span>
                  <span className="text-ink-400 text-sm font-ui">/10</span>
                </div>
              </div>
              <input
                id="ef-rating"
                type="range"
                min={1} max={10} step={1}
                value={form.rating}
                onChange={(e) => set('rating', Number(e.target.value))}
                disabled={submitting}
                style={{
                  background: `linear-gradient(to right, var(--color-terra-500) 0%, var(--color-terra-500) ${(form.rating - 1) / 9 * 100}%, var(--color-cream-300) ${(form.rating - 1) / 9 * 100}%, var(--color-cream-300) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-ink-300 mt-1 font-ui">
                <span>1 · Meh</span>
                <span>5 · Good</span>
                <span>10 · Perfect</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="ef-notes" className={labelClass}>Notes</label>
              <textarea
                id="ef-notes"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="What made it memorable? Describe the experience..."
                rows={4}
                className={`${inputClass} resize-none leading-relaxed`}
                disabled={submitting}
              />
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <p className="text-sm text-red-700 font-ui">{submitError}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream-200 bg-cream-100/60 rounded-b-2xl">
            <button
              type="button"
              onClick={closeForm}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-cream-200 rounded-lg transition-colors cursor-pointer font-ui disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-terra-500 hover:bg-terra-600 disabled:bg-terra-400 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer font-ui shadow-sm disabled:cursor-not-allowed"
            >
              {submitting && (
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {submitting ? 'Saving…' : (isEdit ? 'Save Changes' : 'Vault It')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntryForm;
