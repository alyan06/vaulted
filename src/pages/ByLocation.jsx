import { useState } from 'react';
import useVaultStore, { CATEGORY_COLORS } from '../store/useVaultStore';
import EntryCard from '../components/EntryCard';
import { MapPinIcon, ChevronRightIcon } from '../components/icons';

function CountryGroup({ country, entries }) {
  const [openCities, setOpenCities] = useState({});

  const byCity = entries.reduce((acc, e) => {
    const city = e.location?.city || 'Unknown City';
    if (!acc[city]) acc[city] = [];
    acc[city].push(e);
    return acc;
  }, {});

  const toggle = (city) => setOpenCities((v) => ({ ...v, [city]: !v[city] }));
  const avgRating = (entries.reduce((s, e) => s + e.rating, 0) / entries.length).toFixed(1);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-cream-300">
        <MapPinIcon size={18} className="text-terra-400" />
        <h2 className="font-display text-ink-900 text-xl font-bold">{country}</h2>
        <span className="text-xs font-ui text-ink-400">
          {entries.length} {entries.length === 1 ? 'memory' : 'memories'} · avg {avgRating}/10
        </span>
      </div>

      <div className="space-y-3 pl-6 border-l-2 border-cream-300">
        {Object.entries(byCity)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([city, cityEntries]) => {
            const isOpen = openCities[city] !== false;
            return (
              <div key={city} className="bg-cream-50 rounded-xl border border-cream-300 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                <button
                  onClick={() => toggle(city)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-ui font-semibold text-ink-900 text-sm">{city}</span>
                    <div className="flex gap-1 flex-wrap">
                      {[...new Set(cityEntries.map((e) => e.category))].map((cat) => {
                        const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
                        return (
                          <span key={cat} className={`text-[10px] px-1.5 py-0.5 rounded-full font-ui font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {cat}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-xs text-ink-400 font-ui ml-1">
                      {cityEntries.length} {cityEntries.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                  <ChevronRightIcon
                    size={16}
                    className={`text-ink-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 grid sm:grid-cols-2 gap-3">
                    {cityEntries
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

function ByLocation() {
  const entries = useVaultStore((s) => s.entries);

  const byCountry = entries.reduce((acc, e) => {
    const country = e.location?.country || 'Unknown Country';
    if (!acc[country]) acc[country] = [];
    acc[country].push(e);
    return acc;
  }, {});

  const sorted = Object.entries(byCountry).sort((a, b) => b[1].length - a[1].length);
  const countriesCount = sorted.length;
  const citiesCount = entries.reduce((acc, e) => {
    if (e.location?.city) acc.add(`${e.location.city}-${e.location.country}`);
    return acc;
  }, new Set()).size;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-ink-900 text-3xl font-bold mb-1">By Location</h1>
        {entries.length > 0 && (
          <p className="text-ink-500 font-ui text-sm">
            {countriesCount} {countriesCount === 1 ? 'country' : 'countries'} · {citiesCount} {citiesCount === 1 ? 'city' : 'cities'}
          </p>
        )}
      </div>

      {sorted.length > 0 ? (
        sorted.map(([country, countryEntries]) => (
          <CountryGroup key={country} country={country} entries={countryEntries} />
        ))
      ) : (
        <div className="text-center py-20">
          <MapPinIcon size={40} className="text-cream-400 mx-auto mb-4" />
          <p className="font-display text-ink-400 text-xl">No locations yet</p>
          <p className="text-ink-400 font-ui text-sm mt-2">Add location info to your entries to see them here.</p>
        </div>
      )}
    </div>
  );
}

export default ByLocation;
