import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Clock, Building, CalendarDays, X } from 'lucide-react';
import { locationsApi, categoriesApi, eventsApi } from '../services/api';
import { makeMarkerIcon } from '../utils/markerIcon';
import CategoryFilter from '../components/CategoryFilter';
import FlyTo from '../components/FlyTo';

// Placeholder campus center — replace with your institution's real
// coordinates (see backend/utils/seed.js for the matching note).
const CAMPUS_CENTER = [10.856, 76.654];

export default function MapPage() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeIds, setActiveIds] = useState([]);
  const [search, setSearch] = useState('');
  const [flyTarget, setFlyTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([categoriesApi.list(), locationsApi.list(), eventsApi.list()])
      .then(([cats, locs, evts]) => {
        setCategories(cats);
        setActiveIds(cats.map((c) => c.id));
        setLocations(locs);
        setEvents(evts);
      })
      .catch(() =>
        setError('Could not reach the CampusConnect API. Is the backend running on port 5000?')
      )
      .finally(() => setLoading(false));
  }, []);

  const categoryById = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const filteredLocations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return locations.filter((loc) => {
      const inCategory = activeIds.includes(loc.categoryId);
      const matchesSearch =
        !term ||
        loc.name.toLowerCase().includes(term) ||
        (loc.building || '').toLowerCase().includes(term);
      return inCategory && matchesSearch;
    });
  }, [locations, activeIds, search]);

  const upcomingEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4),
    [events]
  );

  function toggleCategory(id) {
    setActiveIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full flex-col border-b border-line bg-white md:h-full md:w-80 md:border-b-0 md:border-r">
        <div className="border-b border-line p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buildings, offices..."
              className="w-full rounded-md border border-line bg-sand py-2 pl-9 pr-3 text-sm outline-none focus:border-ink"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <CategoryFilter
            categories={categories}
            activeIds={activeIds}
            onToggle={toggleCategory}
            onReset={() => setActiveIds(categories.map((c) => c.id))}
          />

          <div className="mt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate/60">
              {filteredLocations.length} {filteredLocations.length === 1 ? 'place' : 'places'}
            </h2>
            <div className="mt-3 flex flex-col gap-1">
              {filteredLocations.map((loc) => {
                const cat = categoryById.get(loc.categoryId);
                return (
                  <button
                    key={loc.id}
                    onClick={() => setFlyTarget({ lat: loc.lat, lng: loc.lng, id: loc.id })}
                    className="rounded-md px-3 py-2 text-left text-sm text-slate hover:bg-ink/5"
                  >
                    <span className="font-medium">{loc.name}</span>
                    <span className="ml-2 text-xs text-slate/50">{cat?.name}</span>
                  </button>
                );
              })}
              {!loading && filteredLocations.length === 0 && (
                <p className="px-3 py-2 text-sm text-slate/50">
                  Nothing matches — try a different search or category.
                </p>
              )}
            </div>
          </div>

          {upcomingEvents.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate/60">
                Upcoming events
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {upcomingEvents.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() =>
                      evt.location && setFlyTarget({ lat: evt.location.lat, lng: evt.location.lng })
                    }
                    disabled={!evt.location}
                    className="rounded-md border border-line px-3 py-2 text-left hover:bg-ink/5 disabled:opacity-50"
                  >
                    <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      <CalendarDays size={13} /> {evt.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate/60">
                      {evt.date} {evt.time && `· ${evt.time}`}
                      {evt.location && ` · ${evt.location.name}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Map */}
      <div className="relative flex-1">
        {error && (
          <div className="absolute inset-x-0 top-0 z-[1000] flex items-center justify-between gap-3 bg-alert px-4 py-2 text-sm text-white">
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <X size={16} />
            </button>
          </div>
        )}
        <MapContainer center={CAMPUS_CENTER} zoom={17} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo target={flyTarget} />
          {filteredLocations.map((loc) => {
            const cat = categoryById.get(loc.categoryId);
            return (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={makeMarkerIcon(cat?.color)}
              >
                <Popup>
                  <p className="font-display text-sm font-semibold text-ink">{loc.name}</p>
                  {cat && (
                    <p className="mt-0.5 text-xs font-medium" style={{ color: cat.color }}>
                      {cat.name}
                    </p>
                  )}
                  {loc.description && (
                    <p className="mt-2 text-xs text-slate/70">{loc.description}</p>
                  )}
                  <div className="mt-2 space-y-1 text-xs text-slate/60">
                    {loc.building && (
                      <p className="flex items-center gap-1.5">
                        <Building size={12} /> {loc.building}
                        {loc.floor && loc.floor !== '—' ? ` · ${loc.floor}` : ''}
                      </p>
                    )}
                    {loc.hours && (
                      <p className="flex items-center gap-1.5">
                        <Clock size={12} /> {loc.hours}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
