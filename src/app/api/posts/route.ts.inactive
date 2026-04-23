import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';



// GET: összes poszt lekérdezése (csak jóváhagyottak vagy pending, ha admin)
export async function GET(req: NextRequest) {
  const pending = req.nextUrl.searchParams.get('pending');
  const status = pending ? 'pending' : 'approved';
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', status)
    .order('createdAt', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Szerző adatok hozzácsatolása minden poszthoz
  const postsWithAuthor = await Promise.all(
    (posts || []).map(async (post) => {
      const { data: user } = await supabase
        .from('users')
        .select('nickname,name,profileImage,email')
        .eq('id', post.userId)
        .single();
      return {
        ...post,
        authorName: user?.nickname || user?.name || '',
        authorProfileImage: user?.profileImage || null,
        authorEmail: user?.email || null,
        // kompatibilitás kedvéért image/media mezők
        media: post.media || post.image || null,
        mediaType: post.mediaType || (post.image ? "image" : null),
      };
    })
  );
  return NextResponse.json(postsWithAuthor, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
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
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    if (action === 'delete') {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Ismeretlen muvelet' }, { status: 400 });
  } catch (e: any) {
    const message = e?.message || 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: új poszt létrehozása (bejelentkezett user kell)
export async function POST(req: NextRequest) {
  try {
    const { text, media, mediaType, email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Nincs email, nem vagy bejelentkezve.' }, { status: 401 });
    }
    // Felhasználó keresése email alapján
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (userError || !user) {
      return NextResponse.json({ error: 'Ismeretlen felhasználó.' }, { status: 401 });
    }
    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert({ userId: user.id, text, media, mediaType, status: 'pending' })
      .select()
      .single();
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json(insertData);
  } catch (e: any) {
    const message = e?.message || 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
