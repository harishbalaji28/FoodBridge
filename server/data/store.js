// ─────────────────────────────────────────────
//  FoodBridge – Simple JSON "Database"
//  File: server/data/store.js
//
//  How it works:
//    • All data lives in db.json (auto-created if missing)
//    • We read from that file whenever we need data
//    • We write to it whenever data changes
//    • This means data survives server restarts!
// ─────────────────────────────────────────────

const fs   = require("fs");
const path = require("path");

// Path to our JSON "database" file
const DB_FILE = path.join(__dirname, "db.json");

// Starting shape of the database
const EMPTY_DB = { posts: [] };

// ── Helpers ──────────────────────────────────

/** Make sure the db.json file exists with a valid structure */
function ensureDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_DB, null, 2));
  }
}

/** Read the entire database from disk */
function readDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

/** Write the entire database to disk */
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── Public API ───────────────────────────────

/** Get all posts */
function getPosts() {
  return readDB().posts;
}

/** Replace all posts (used after any mutation) */
function savePosts(posts) {
  const db = readDB();
  db.posts = posts;
  writeDB(db);
}

module.exports = { getPosts, savePosts };
