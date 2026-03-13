import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: összes esemény lekérdezése (pending param támogatás)
export async function GET(req: NextRequest) {
  const pending = req.nextUrl.searchParams.get('pending');
  const status = pending ? 'pending' : 'approved';
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', status)
    .order('date', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(events);
}

// POST: új esemény létrehozása (admin jogosultság kell, most mock, státusz approved)
export async function POST(req: NextRequest) {
  try {
    const { title, date, description, image, location } = await req.json();
    if (!title || !date || !description) {
      return NextResponse.json({ error: 'Cím, dátum és leírás kötelező.' }, { status: 400 });
    }
    // Duplikáció ellenőrzése: 15 másodpercen belül ugyanolyan event
    const { data: recentDuplicate, error: dupError } = await supabase
      .from('events')
      .select('id,createdAt')
      .eq('title', title)
      .eq('date', date)
      .eq('description', description)
      .eq('location', location || '')
      .order('id', { ascending: false })
      .limit(1);
    if (dupError) {
      return NextResponse.json({ error: dupError.message }, { status: 500 });
    }
    if (recentDuplicate && recentDuplicate.length > 0) {
      const createdAt = new Date(recentDuplicate[0].createdAt);
      const now = new Date();
      if ((now.getTime() - createdAt.getTime()) / 1000 < 15) {
        return NextResponse.json({ error: 'Az esemény már mentés alatt van. Kérlek várj pár másodpercet.' }, { status: 409 });
      }
    }
    // TODO: admin jogosultság ellenőrzése (most mock)
    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert({ title, date, description, image, location, status: 'approved' })
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
// PATCH: esemény jóváhagyása
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action, title, date, description, image, location } = body;
  try {
    if (action === 'approve') {
      const { error } = await supabase
        .from('events')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    if (action === 'delete') {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    if (action === 'update') {
      const { error } = await supabase
        .from('events')
        .update({ title, date, description, image, location })
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Ismeretlen művelet' }, { status: 400 });
  } catch (e: any) {
    const message = e?.message || 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: esemény törlése (admin jogosultság kell, most mock)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  // TODO: admin jogosultság ellenőrzése (most mock)
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    const message = e?.message || 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
