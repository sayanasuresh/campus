/**
 * Minimal file-backed JSON database.
 *
 * This project uses a flat JSON file instead of a full database engine so the
 * whole backend can run with zero native dependencies and zero external
 * services — ideal for a college project or a quick local demo. Swapping this
 * module out for a real database (Postgres/Mongo) later only requires
 * changing the functions below; every route calls these, never the file
 * directly.
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error('Database file not found. Run "npm run seed" first.');
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function getCollection(name) {
  const db = readDb();
  return db[name] || [];
}

function saveCollection(name, items) {
  const db = readDb();
  db[name] = items;
  writeDb(db);
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

module.exports = { readDb, writeDb, getCollection, saveCollection, nextId };
