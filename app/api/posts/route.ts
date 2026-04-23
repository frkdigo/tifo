
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
      .select(`*, users:users!posts_userId_fkey(nickname, name, profileImage, email)`)
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
    // Egységes media/mediaType mezők hozzáadása
    const posts = (data || []).map(post => ({
      ...post,
      media: post.media || post.image || null,
      mediaType: post.mediaType || (post.image ? "image" : null),
    }));
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
    const { text, media, mediaType, image, email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Nincs email, nem vagy bejelentkezve.' }, { status: 401 });
    }
    // Supabase user lookup
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (userError || !userData) {
      return NextResponse.json({ error: 'Ismeretlen felhasználó.' }, { status: 401 });
    }
    const userId = userData.id;
    // Supabase insert
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([{ userId, text, media: media || image || null, mediaType: mediaType || (image ? "image" : null), status: 'pending' }])
      .select('*')
      .single();
    if (postError || !postData) {
      throw new Error(postError?.message || 'Nem sikerült létrehozni a posztot');
    }
    return NextResponse.json(postData);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
