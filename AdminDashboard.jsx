import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, MapPinned, Tags, CalendarDays } from 'lucide-react';
import { locationsApi, categoriesApi, eventsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const TABS = [
  { key: 'locations', label: 'Locations', icon: MapPinned },
  { key: 'categories', label: 'Categories', icon: Tags },
  { key: 'events', label: 'Events', icon: CalendarDays },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('locations');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate/60">Signed in as {user?.name || user?.username}</p>
      </div>

      <div className="mb-8 flex gap-1 border-b border-line">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === key ? 'border-amber text-ink' : 'border-transparent text-slate/50 hover:text-slate'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'locations' && <LocationsTab />}
      {tab === 'categories' && <CategoriesTab />}
      {tab === 'events' && <EventsTab />}
    </div>
  );
}

/* ---------------------------- Locations ---------------------------- */

function LocationsTab() {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [loading, setLoading] = useState(true);

  function refresh() {
    return Promise.all([locationsApi.list(), categoriesApi.list()]).then(([locs, cats]) => {
      setLocations(locs);
      setCategories(cats);
    });
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleSave(form) {
    if (form.id) {
      await locationsApi.update(form.id, form);
    } else {
      await locationsApi.create(form);
    }
    setEditing(null);
    refresh();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this location?')) return;
    await locationsApi.remove(id);
    refresh();
  }

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—';

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-inkdeep"
        >
          <Plus size={15} /> Add location
        </button>
      </div>

      {!loading && (
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand text-xs uppercase tracking-wide text-slate/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Building</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{loc.name}</td>
                  <td className="px-4 py-3 text-slate/70">{categoryName(loc.categoryId)}</td>
                  <td className="px-4 py-3 text-slate/70">{loc.building}</td>
                  <td className="px-4 py-3 text-slate/70">{loc.hours}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(loc)} className="text-slate/50 hover:text-ink">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(loc.id)} className="text-slate/50 hover:text-alert">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <LocationFormModal
          initial={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function LocationFormModal({ initial, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    categoryId: initial.categoryId || categories[0]?.id || '',
    lat: initial.lat ?? '',
    lng: initial.lng ?? '',
    building: initial.building || '',
    floor: initial.floor || '',
    hours: initial.hours || '',
    description: initial.description || '',
    id: initial.id,
  });
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, categoryId: Number(form.categoryId), lat: Number(form.lat), lng: Number(form.lng) });
    setSaving(false);
  }

  return (
    <Modal title={initial.id ? 'Edit location' : 'Add location'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Name">
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required className="input" />
        </Field>
        <Field label="Category">
          <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            <input type="number" step="any" value={form.lat} onChange={(e) => set('lat', e.target.value)} required className="input" />
          </Field>
          <Field label="Longitude">
            <input type="number" step="any" value={form.lng} onChange={(e) => set('lng', e.target.value)} required className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Building">
            <input value={form.building} onChange={(e) => set('building', e.target.value)} className="input" />
          </Field>
          <Field label="Floor">
            <input value={form.floor} onChange={(e) => set('floor', e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Operating hours">
          <input value={form.hours} onChange={(e) => set('hours', e.target.value)} className="input" placeholder="9:00 AM - 5:00 PM" />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="input" />
        </Field>

        <button type="submit" disabled={saving} className="mt-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-inkdeep disabled:opacity-60">
          {saving ? 'Saving...' : 'Save location'}
        </button>
      </form>
    </Modal>
  );
}

/* ---------------------------- Categories ---------------------------- */

function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  function refresh() {
    return categoriesApi.list().then(setCategories);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleSave(form) {
    if (form.id) await categoriesApi.update(form.id, form);
    else await categoriesApi.create(form);
    setEditing(null);
    refresh();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? Locations using it will keep the old category id.')) return;
    await categoriesApi.remove(id);
    refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing({})} className="flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-inkdeep">
          <Plus size={15} /> Add category
        </button>
      </div>

      {!loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-lg border border-line bg-white p-4">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm font-medium text-ink">{cat.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(cat)} className="text-slate/50 hover:text-ink">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="text-slate/50 hover:text-alert">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CategoryFormModal initial={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}

function CategoryFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    color: initial.color || '#3E7C74',
    icon: initial.icon || 'map-pin',
    id: initial.id,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <Modal title={initial.id ? 'Edit category' : 'Add category'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Name">
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="input" />
        </Field>
        <Field label="Color">
          <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="h-10 w-16 rounded border border-line" />
        </Field>
        <Field label="Icon key (lucide)">
          <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className="input" placeholder="e.g. building-2, book-open, utensils" />
        </Field>
        <button type="submit" disabled={saving} className="mt-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-inkdeep disabled:opacity-60">
          {saving ? 'Saving...' : 'Save category'}
        </button>
      </form>
    </Modal>
  );
}

/* ---------------------------- Events ---------------------------- */

function EventsTab() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  function refresh() {
    return Promise.all([eventsApi.list(), locationsApi.list()]).then(([evts, locs]) => {
      setEvents(evts);
      setLocations(locs);
    });
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleSave(form) {
    if (form.id) await eventsApi.update(form.id, form);
    else await eventsApi.create(form);
    setEditing(null);
    refresh();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return;
    await eventsApi.remove(id);
    refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing({})} className="flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-inkdeep">
          <Plus size={15} /> Add event
        </button>
      </div>

      {!loading && (
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand text-xs uppercase tracking-wide text-slate/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{evt.title}</td>
                  <td className="px-4 py-3 text-slate/70">{evt.location?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate/70">{evt.date} {evt.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(evt)} className="text-slate/50 hover:text-ink">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(evt.id)} className="text-slate/50 hover:text-alert">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EventFormModal initial={editing} locations={locations} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}

function EventFormModal({ initial, locations, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    locationId: initial.locationId || locations[0]?.id || '',
    date: initial.date || '',
    time: initial.time || '',
    description: initial.description || '',
    id: initial.id,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, locationId: Number(form.locationId) });
    setSaving(false);
  }

  return (
    <Modal title={initial.id ? 'Edit event' : 'Add event'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Title">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="input" />
        </Field>
        <Field label="Venue">
          <select value={form.locationId} onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))} className="input">
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required className="input" />
          </Field>
          <Field label="Time">
            <input value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="input" placeholder="10:00 AM" />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="input" />
        </Field>
        <button type="submit" disabled={saving} className="mt-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-inkdeep disabled:opacity-60">
          {saving ? 'Saving...' : 'Save event'}
        </button>
      </form>
    </Modal>
  );
}

/* ---------------------------- Shared ---------------------------- */

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate">{label}</span>
      {children}
    </label>
  );
}
