import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email kötelező' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, nickname, profileimage, email, isadmin')
    .eq('email', email)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Felhasználó nem található' }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { email, nickname, profileimage } = await req.json();
    console.log("PATCH body:", { email, nickname, profileimage: profileimage?.slice?.(0, 100) });
    if (!email) {
      return NextResponse.json({ error: 'Email kötelező' }, { status: 400 });
    }

    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        nickname: typeof nickname === 'string' ? nickname : undefined,
        profileimage: profileimage !== undefined ? profileimage : undefined,
      })
      .eq('email', email);
    console.log("Supabase update result:", { updateData, updateError });
    if (updateError) {
      console.error("Supabase update error:", updateError);
    }

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, nickname, profileimage, email, isadmin')
      .eq('email', email)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Felhasználó nem található' }, { status: 404 });
    }

    return NextResponse.json({ user: data });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
