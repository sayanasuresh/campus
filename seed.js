/**
 * Seeds data/db.json with a default admin account and sample campus data.
 * Run with: npm run seed
 *
 * NOTE: The lat/lng values below are placeholders spread around a single
 * point. Replace them with your actual campus coordinates in the admin
 * dashboard (or directly in data/db.json) after seeding — see the README.
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

// Placeholder campus center — update to your institution's real coordinates.
const CAMPUS_CENTER = { lat: 10.856, lng: 76.654 };
const jitter = (n = 0.004) => (Math.random() - 0.5) * n;

const categories = [
  { id: 1, name: 'Academic Blocks', icon: 'building-2', color: '#3E7C74' },
  { id: 2, name: 'Administration', icon: 'landmark', color: '#1B2A4A' },
  { id: 3, name: 'Library', icon: 'book-open', color: '#5B4B8A' },
  { id: 4, name: 'Canteen & Food', icon: 'utensils', color: '#E8A33D' },
  { id: 5, name: 'Hostels', icon: 'home', color: '#3E7C74' },
  { id: 6, name: 'Sports & Recreation', icon: 'dumbbell', color: '#2E86AB' },
  { id: 7, name: 'Emergency & Medical', icon: 'siren', color: '#C1443C' },
  { id: 8, name: 'Parking', icon: 'square-parking', color: '#6B7280' },
];

const locations = [
  { id: 1, name: 'Main Academic Block', categoryId: 1, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Block A', floor: 'Ground - 3rd', hours: '8:00 AM - 5:00 PM', description: 'Core lecture halls and department offices for engineering programs.', image: '' },
  { id: 2, name: 'Computer Science Department', categoryId: 1, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Block C', floor: '2nd Floor', hours: '9:00 AM - 4:30 PM', description: 'CSE labs, faculty cabins, and the cybersecurity research lab.', image: '' },
  { id: 3, name: 'Central Library', categoryId: 3, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Library Block', floor: 'All floors', hours: '8:30 AM - 8:00 PM', description: 'Reading halls, digital archive, and group study rooms.', image: '' },
  { id: 4, name: 'Administrative Office', categoryId: 2, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Block A', floor: 'Ground Floor', hours: '9:30 AM - 4:00 PM', description: 'Admissions, fee payments, and general administration.', image: '' },
  { id: 5, name: 'Main Canteen', categoryId: 4, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Canteen Block', floor: 'Ground Floor', hours: '7:30 AM - 6:30 PM', description: 'Primary dining hall serving breakfast, lunch, and snacks.', image: '' },
  { id: 6, name: "Boys' Hostel", categoryId: 5, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Hostel Block B', floor: '—', hours: '24 hours', description: 'Resident hostel with warden office at the entrance.', image: '' },
  { id: 7, name: "Girls' Hostel", categoryId: 5, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Hostel Block G', floor: '—', hours: '24 hours', description: 'Resident hostel with warden office at the entrance.', image: '' },
  { id: 8, name: 'Sports Ground & Gymnasium', categoryId: 6, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Sports Complex', floor: '—', hours: '6:00 AM - 8:00 PM', description: 'Football/cricket ground, indoor courts, and gym.', image: '' },
  { id: 9, name: 'Health Centre', categoryId: 7, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Block D', floor: 'Ground Floor', hours: '24 hours', description: 'First aid, resident nurse, and ambulance dispatch point.', image: '' },
  { id: 10, name: 'Visitor Parking', categoryId: 8, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Main Gate', floor: '—', hours: '24 hours', description: 'Parking for visitors and guests; security checkpoint at entry.', image: '' },
  { id: 11, name: 'Auditorium', categoryId: 1, lat: CAMPUS_CENTER.lat + jitter(), lng: CAMPUS_CENTER.lng + jitter(), building: 'Block E', floor: 'Ground Floor', hours: 'Event hours', description: '800-seat auditorium used for symposiums, fests, and seminars.', image: '' },
];

const events = [
  { id: 1, title: 'Annual Tech Symposium', locationId: 11, date: '2026-10-15', time: '10:00 AM', description: 'Department-wide tech symposium with guest talks and project expos.' },
  { id: 2, title: 'Inter-College Cybersecurity CTF', locationId: 2, date: '2026-11-02', time: '9:00 AM', description: 'A capture-the-flag competition hosted by the CSE department.' },
  { id: 3, title: 'Freshers Sports Meet', locationId: 8, date: '2026-10-05', time: '4:00 PM', description: 'Athletics and team sports events for first-year students.' },
];

async function seed() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const users = [
    { id: 1, username: 'admin', passwordHash, role: 'admin', name: 'Campus Admin' },
  ];

  const db = { users, categories, locations, events };
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

  console.log('Database seeded at', DB_PATH);
  console.log('Default admin login -> username: admin | password: admin123');
  console.log('IMPORTANT: change this password before deploying anywhere public.');
}

seed();
