import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

type UserIdRow = {
  id: number;
};

// GET: összes poszt lekérdezése (csak jóváhagyottak vagy pending, ha admin)
export async function GET(req: NextRequest) {
  try {
    const pending = req.nextUrl.searchParams.get('pending');
    let posts;
    if (pending) {
      posts = db
        .prepare(
          `SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.name) AS authorName, users.profileImage AS authorProfileImage
           FROM posts
           LEFT JOIN users ON users.id = posts.userId
           WHERE posts.status = 'pending'
           ORDER BY posts.createdAt DESC`
        )
        .all();
    } else {
      posts = db
        .prepare(
          `SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.name) AS authorName, users.profileImage AS authorProfileImage
           FROM posts
           LEFT JOIN users ON users.id = posts.userId
           WHERE posts.status = 'approved'
           ORDER BY posts.createdAt DESC`
        )
        .all();
    }
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
// PATCH: poszt jóváhagyása
export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (action === 'approve') {
      db.prepare("UPDATE posts SET status = 'approved' WHERE id = ?").run(id);
      return NextResponse.json({ success: true });
    }
    if (action === 'delete') {
      db.prepare('DELETE FROM posts WHERE id = ?').run(id);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Ismeretlen muvelet' }, { status: 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: új poszt létrehozása (bejelentkezett user kell)
export async function POST(req: NextRequest) {
  try {
    const { text, image, email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Nincs email, nem vagy bejelentkezve.' }, { status: 401 });
    }
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as UserIdRow | undefined;
    if (!user) {
      return NextResponse.json({ error: 'Ismeretlen felhasználó.' }, { status: 401 });
    }
    const userId = user.id;
    const stmt = db.prepare("INSERT INTO posts (userId, text, image, status) VALUES (?, ?, ?, 'pending')");
    const info = stmt.run(userId, text, image);
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
    return NextResponse.json(post);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
