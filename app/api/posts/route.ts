
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';


type UserIdRow = {
  id: number;
};

// GET: összes poszt lekérdezése (csak jóváhagyottak vagy pending, ha admin)
export async function GET(req: NextRequest) {
  try {
    const pending = req.nextUrl.searchParams.get('pending');
    let query = supabase
      .from('posts')
      .select(`*, users:users!posts_userId_fkey(nickname, name, profileImage)`)
      .order('createdAt', { ascending: false });

    if (pending) {
      query = query.eq('status', 'pending');
    } else {
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    // posts = data; // már a data-ban van
    return NextResponse.json(data || [], {
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
      const { error } = await supabase
        .from('posts')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
      return NextResponse.json({ success: true });
    }
    if (action === 'delete') {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
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
