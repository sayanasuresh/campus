export default function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate/70">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>CampusConnect — Interactive Campus Navigation &amp; Spatial Resource Module</p>
          <p>Built with React, Leaflet.js &amp; Express</p>
        </div>
      </div>
    </footer>
  );
}
