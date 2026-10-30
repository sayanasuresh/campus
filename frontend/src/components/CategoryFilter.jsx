import { getCategoryIcon } from '../utils/icons';

export default function CategoryFilter({ categories, activeIds, onToggle, onReset }) {
  const allActive = activeIds.length === categories.length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate/60">
          Categories
        </h2>
        {!allActive && (
          <button onClick={onReset} className="text-xs font-medium text-amber hover:underline">
            Show all
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          const active = activeIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onToggle(cat.id)}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                active ? 'bg-ink text-white' : 'text-slate/70 hover:bg-ink/5'
              }`}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: active ? cat.color : `${cat.color}22` }}
              >
                <Icon size={13} color={active ? 'white' : cat.color} strokeWidth={2.25} />
              </span>
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
