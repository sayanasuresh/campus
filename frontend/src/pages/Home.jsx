import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Navigation, CalendarDays, ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <BlueprintPattern />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-amber/90">
              Campus navigation, solved
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl">
              Every building, office and event — one map, no guesswork.
            </h1>
            <p className="mt-6 max-w-prose text-lg text-white/70">
              CampusConnect replaces scattered text directions with a live, searchable map of
              your institution — lecture halls, offices, hostels, and the events happening in
              them today.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/map"
                className="rounded-md bg-amber px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
              >
                Open the campus map
              </Link>
              <Link
                to="/admin/login"
                className="rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/90 hover:bg-white/5"
              >
                Administrator login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights — deliberately uneven grid, not identical cards */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl border border-line bg-white p-8">
            <Navigation className="text-teal" size={28} strokeWidth={1.75} />
            <h3 className="mt-5 text-xl font-semibold text-ink">Filter by what you need</h3>
            <p className="mt-2 max-w-prose text-slate/75">
              Academic blocks, libraries, canteens, hostels, medical points and parking — toggle
              categories on and off to cut through the clutter and see only what matters right
              now.
            </p>
          </div>
          <div className="rounded-xl bg-ink p-8 text-white">
            <ShieldCheck className="text-amber" size={28} strokeWidth={1.75} />
            <h3 className="mt-5 text-xl font-semibold">Emergency points, always visible</h3>
            <p className="mt-2 text-white/70">
              Health centres and emergency services are pinned distinctly so help is never more
              than a glance away.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-8">
            <CalendarDays className="text-violet" size={28} strokeWidth={1.75} />
            <h3 className="mt-5 text-xl font-semibold text-ink">Events, tied to their venue</h3>
            <p className="mt-2 text-slate/75">
              Every registered event links straight to its location — one click from the events
              list to the exact pin on the map.
            </p>
          </div>
          <div className="md:col-span-2 rounded-xl border border-line bg-white p-8">
            <LayoutDashboard className="text-amber" size={28} strokeWidth={1.75} />
            <h3 className="mt-5 text-xl font-semibold text-ink">A dashboard for the people who maintain it</h3>
            <p className="mt-2 max-w-prose text-slate/75">
              Administrators manage coordinates, operating hours and facility details from a
              single dashboard — no code changes, no waiting on developers to move a pin.
            </p>
          </div>
        </div>
      </section>

      {/* How it works — a genuine 3-step sequence, numbered because it is one */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-semibold text-ink">How students find a place</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            <Step number="01" icon={Search} title="Search or browse">
              Type a building name, or scan the map for what's nearby.
            </Step>
            <Step number="02" icon={SlidersHorizontal} title="Filter by category">
              Narrow to academic blocks, food, hostels, or any facility type.
            </Step>
            <Step number="03" icon={Navigation} title="Get the exact pin">
              See hours, floor, and building details, then walk straight there.
            </Step>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-ink">Ready to find your way?</h2>
        <p className="mx-auto mt-3 max-w-md text-slate/70">
          Open the live map and start exploring the campus.
        </p>
        <Link
          to="/map"
          className="mt-7 inline-block rounded-md bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-inkdeep"
        >
          Open the campus map
        </Link>
      </section>
    </>
  );
}

function Step({ number, icon: Icon, title, children }) {
  return (
    <div className="flex gap-4">
      <span className="font-display text-3xl font-semibold text-amber">{number}</span>
      <div>
        <Icon className="text-ink" size={20} strokeWidth={2} />
        <h3 className="mt-2 font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-slate/70">{children}</p>
      </div>
    </div>
  );
}

// A quiet blueprint-style grid with a few pin markers, standing in for a
// literal photograph of "a campus" — this is the one bold visual moment.
function BlueprintPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" stroke="#E8A33D" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(#grid)" />
      <path d="M120 380 L120 220 L320 220 L320 120 L560 120" stroke="#E8A33D" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="120" cy="380" r="6" fill="#E8A33D" />
      <circle cx="320" cy="220" r="6" fill="#E8A33D" />
      <circle cx="560" cy="120" r="8" fill="#E8A33D" />
    </svg>
  );
}
