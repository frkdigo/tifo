import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email kötelező' }, { status: 400 });
  }
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, nickname, profileImage, email, isAdmin')
    .eq('email', email)
    .single();
  if (error || !user) {
    return NextResponse.json({ error: 'Felhasznalo nem talalhato' }, { status: 404 });
  }
  return NextResponse.json(user, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { email, nickname, profileImage } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email kötelező' }, { status: 400 });
    }
    if (typeof nickname === 'string' || profileImage !== undefined) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ nickname: nickname || '', profileImage: profileImage || null })
        .eq('email', email);
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }
    const { data: updated, error } = await supabase
      .from('users')
      .select('id, name, nickname, profileImage, email, isAdmin')
      .eq('email', email)
      .single();
    return NextResponse.json({ user: updated });
  } catch (e: any) {
    const message = e?.message || 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
