import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET: összes esemény lekérdezése (pending param támogatás)
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
      }
    }
  );
  const pending = req.nextUrl.searchParams.get('pending');
  let query = supabase.from('events').select('*').order('date', { ascending: false });
  if (pending) {
    query = query.eq('status', 'pending');
  } else {
    query = query.eq('status', 'approved');
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST: új esemény létrehozása (admin jogosultság kell, most mock, státusz approved)
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (key: string) => cookieStore.get(key)?.value,
        }
      }
    );
    const body = await req.json();
    // DEBUG: logoljuk a kapott body-t
    console.log('EVENT POST BODY:', body);
    const { title, date, description, image, location } = body;
    if (!title || !date || !description) {
      return NextResponse.json({ error: 'Cím, dátum és leírás kötelező.' }, { status: 400 });
    }
    // Duplikáció ellenőrzés Supabase-ben
    const { data: recentDuplicate, error: dupError } = await supabase
      .from('events')
      .select('id')
      .eq('title', title)
      .eq('date', date)
      .eq('description', description)
      .eq('location', location || '')
      .gte('createdAt', new Date(Date.now() - 15000).toISOString())
      .order('id', { ascending: false })
      .limit(1);
    if (dupError) {
      return NextResponse.json({ error: dupError.message }, { status: 500 });
    }
    if (recentDuplicate && recentDuplicate.length > 0) {
      return NextResponse.json({ error: 'Az esemény már mentés alatt van. Kérlek várj pár másodpercet.' }, { status: 409 });
    }
    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert([{ title, date, description, image, location, status: 'approved' }])
      .select();
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json(insertData && insertData[0]);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
// PATCH: esemény jóváhagyása
export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
      }
    }
  );
  const body = await req.json();
  const { id, action } = body;
  if (action === 'approve') {
    const { error } = await supabase.from('events').update({ status: 'approved' }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  if (action === 'delete') {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  if (action === 'update') {
    const { title, date, description, image, location } = body;
    const { error } = await supabase.from('events').update({ title, date, description, image, location }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Ismeretlen művelet' }, { status: 400 });
}

// DELETE: esemény törlése (admin jogosultság kell, most mock)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  // TODO: admin jogosultság ellenőrzése (most mock)
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
