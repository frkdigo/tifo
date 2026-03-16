module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$better$2d$sqlite3$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs, [project]/node_modules/better-sqlite3)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
// Az adatbázis a projekt gyökerében lesz
const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'tifo.sqlite');
const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$better$2d$sqlite3$29$__["default"](dbPath);
function hasColumn(table, column) {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();
    return columns.some((c)=>c.name === column);
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
    {
        name: 'Furkó Norbert',
        role: 'Elnök',
        displayOrder: 1
    },
    {
        name: 'Balogh Levente',
        role: 'Alelnök',
        displayOrder: 2
    },
    {
        name: 'Toldi Emma',
        role: 'Képviselő',
        displayOrder: 3
    },
    {
        name: 'Gaál Krisztián',
        role: 'Képviselő',
        displayOrder: 4
    },
    {
        name: 'Forgács Dina',
        role: 'Képviselő',
        displayOrder: 5
    },
    {
        name: 'McGuinness Daniel',
        role: 'Képviselő',
        displayOrder: 6
    }
];
const insertTeamMember = db.prepare('INSERT OR IGNORE INTO team_members (name, role, bio, image, displayOrder) VALUES (?, ?, ?, ?, ?)');
const updateTeamRole = db.prepare('UPDATE team_members SET role = ?, displayOrder = ? WHERE name = ?');
for (const member of teamSeed){
    insertTeamMember.run(member.name, member.role, '', null, member.displayOrder);
    updateTeamRole.run(member.role, member.displayOrder, member.name);
}
const __TURBOPACK__default__export__ = db;
}),
"[project]/app/api/posts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET(req) {
    try {
        const pending = req.nextUrl.searchParams.get('pending');
        let posts;
        if (pending) {
            posts = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare(`SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.name) AS authorName, users.profileImage AS authorProfileImage
           FROM posts
           LEFT JOIN users ON users.id = posts.userId
           WHERE posts.status = 'pending'
           ORDER BY posts.createdAt DESC`).all();
        } else {
            posts = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare(`SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.name) AS authorName, users.profileImage AS authorProfileImage
           FROM posts
           LEFT JOIN users ON users.id = posts.userId
           WHERE posts.status = 'approved'
           ORDER BY posts.createdAt DESC`).all();
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(posts, {
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
async function PATCH(req) {
    try {
        const { id, action } = await req.json();
        if (action === 'approve') {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare("UPDATE posts SET status = 'approved' WHERE id = ?").run(id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (action === 'delete') {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare('DELETE FROM posts WHERE id = ?').run(id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Ismeretlen muvelet'
        }, {
            status: 400
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const { text, image, email } = await req.json();
        if (!email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Nincs email, nem vagy bejelentkezve.'
            }, {
                status: 401
            });
        }
        const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Ismeretlen felhasználó.'
            }, {
                status: 401
            });
        }
        const userId = user.id;
        const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare("INSERT INTO posts (userId, text, image, status) VALUES (?, ?, ?, 'pending')");
        const info = stmt.run(userId, text, image);
        const post = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(post);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fc6050e8._.js.map