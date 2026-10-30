import {
  Building2,
  Landmark,
  BookOpen,
  Utensils,
  Home,
  Dumbbell,
  Siren,
  SquareParking,
  MapPin,
} from 'lucide-react';

// Maps the icon key stored per-category (see backend/utils/seed.js) to a
// lucide-react component. Falls back to a generic pin for anything unknown,
// so new categories added via the admin dashboard never crash the UI.
const ICONS = {
  'building-2': Building2,
  landmark: Landmark,
  'book-open': BookOpen,
  utensils: Utensils,
  home: Home,
  dumbbell: Dumbbell,
  siren: Siren,
  'square-parking': SquareParking,
};

export function getCategoryIcon(key) {
  return ICONS[key] || MapPin;
}
