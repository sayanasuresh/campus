import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Renders nothing — just reacts to `target` changing and flies the map there.
export default function FlyTo({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 18, { duration: 0.8 });
    }
  }, [target, map]);

  return null;
}
