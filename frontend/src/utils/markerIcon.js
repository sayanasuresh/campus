import L from 'leaflet';

const cache = new Map();

/**
 * Builds a small colored teardrop marker as a Leaflet divIcon. Cached per
 * color so repeated markers of the same category don't rebuild the same SVG.
 */
export function makeMarkerIcon(color = '#3E7C74') {
  if (cache.has(color)) return cache.get(color);

  const icon = L.divIcon({
    className: '',
    html: `
      <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23C30 6.7 23.3 0 15 0z"
              fill="${color}" stroke="white" stroke-width="1.5"/>
        <circle cx="15" cy="15" r="5.5" fill="white"/>
      </svg>
    `,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });

  cache.set(color, icon);
  return icon;
}
