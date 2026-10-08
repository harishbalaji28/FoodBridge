const fs = require("fs");
const path = require("path");

const DB_FILE = process.env.VERCEL
  ? path.join("/tmp", "db.json")
  : path.join(__dirname, "db.json");

const EMPTY_DB = { posts: [] };

function ensureDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_DB, null, 2));
  }
}

function readDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getPosts() {
  return readDB().posts;
}

function savePosts(posts) {
  const db = readDB();
  db.posts = posts;
  writeDB(db);
}

module.exports = { getPosts, savePosts };