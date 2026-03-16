import Database from 'better-sqlite3';
import path from 'path';

// Az adatbázis a projekt gyökerében lesz
const dbPath = path.join(process.cwd(), 'tifo.sqlite');
const db = new Database(dbPath);

function hasColumn(table: string, column: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return columns.some((c) => c.name === column);
}

// Felhasználók tábla
// id, name, nickname, rank, profileImage, email, passwordHash, isAdmin
// Posztok tábla
// id, userId, text, image, createdAt, status ('pending'|'approved'|'rejected')
// Reakciók tábla
// id, postId, userId, type
// Események tábla
// id, title, date, description, image, location

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '',
  nickname TEXT NOT NULL DEFAULT '',
  rank TEXT NOT NULL DEFAULT '',
  profileImage TEXT,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  isAdmin INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  text TEXT,
  image TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  postId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  type TEXT NOT NULL,
  UNIQUE(postId, userId),
  FOREIGN KEY(postId) REFERENCES posts(id),
  FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  image TEXT,
  location TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  bio TEXT DEFAULT '',
  image TEXT,
  displayOrder INTEGER DEFAULT 0
);
`);

// Keep older local databases compatible with the current API queries.
if (!hasColumn('users', 'passwordHash')) {
  db.exec("ALTER TABLE users ADD COLUMN passwordHash TEXT DEFAULT ''");
}

if (!hasColumn('users', 'name')) {
  db.exec("ALTER TABLE users ADD COLUMN name TEXT DEFAULT ''");
}

if (!hasColumn('users', 'nickname')) {
  db.exec("ALTER TABLE users ADD COLUMN nickname TEXT DEFAULT ''");
}

if (!hasColumn('users', 'rank')) {
  db.exec("ALTER TABLE users ADD COLUMN rank TEXT DEFAULT ''");
}

if (!hasColumn('users', 'profileImage')) {
  db.exec('ALTER TABLE users ADD COLUMN profileImage TEXT');
}

if (!hasColumn('users', 'isAdmin')) {
  db.exec('ALTER TABLE users ADD COLUMN isAdmin INTEGER DEFAULT 0');
}

if (!hasColumn('posts', 'status')) {
  db.exec("ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'approved'");
}

if (!hasColumn('events', 'status')) {
  db.exec("ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'approved'");
}

if (!hasColumn('events', 'createdAt')) {
  db.exec("ALTER TABLE events ADD COLUMN createdAt TEXT");
  db.exec("UPDATE events SET createdAt = CURRENT_TIMESTAMP WHERE createdAt IS NULL");
}

// Backfill NULL status values to avoid filtering everything out.
db.exec("UPDATE posts SET status = 'approved' WHERE status IS NULL");
db.exec("UPDATE events SET status = 'approved' WHERE status IS NULL");

// Title system disabled: keep rank empty for every account.
db.exec("UPDATE users SET rank = ''");

const teamSeed = [
  { name: 'Furkó Norbert', role: 'Elnök', displayOrder: 1 },
  { name: 'Balogh Levente', role: 'Alelnök', displayOrder: 2 },
  { name: 'Toldi Emma', role: 'Képviselő', displayOrder: 3 },
  { name: 'Gaál Krisztián', role: 'Képviselő', displayOrder: 4 },
  { name: 'Forgács Dina', role: 'Képviselő', displayOrder: 5 },
  { name: 'McGuinness Daniel', role: 'Képviselő', displayOrder: 6 },
];

const insertTeamMember = db.prepare(
  'INSERT OR IGNORE INTO team_members (name, role, bio, image, displayOrder) VALUES (?, ?, ?, ?, ?)'
);
const updateTeamRole = db.prepare('UPDATE team_members SET role = ?, displayOrder = ? WHERE name = ?');

for (const member of teamSeed) {
  insertTeamMember.run(member.name, member.role, '', null, member.displayOrder);
  updateTeamRole.run(member.role, member.displayOrder, member.name);
}

export default db;
