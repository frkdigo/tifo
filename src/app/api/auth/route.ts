import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';





// POST /api/auth/register { email, password }
export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: 'Név, email és jelszó kötelező' }, { status: 400 });
  // Supabase auth regisztráció
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }
  // Felhasználó adatainak beszúrása a users táblába (ha szükséges)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({ name, nickname: name, email })
    .select()
    .single();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }
  return NextResponse.json({ user: userData });
}

// POST /api/auth/login { email, password }
export async function PUT(req: NextRequest) {
  const { email, password } = await req.json();
  // Supabase auth login
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError || !signInData.user) {
    return NextResponse.json({ error: 'Hibás email vagy jelszó' }, { status: 401 });
  }
  // Felhasználó adatainak lekérése a users táblából
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, nickname, profileImage, email, isAdmin')
    .eq('email', email)
    .single();
  if (userError || !user) {
    return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
  }
  return NextResponse.json({ user });
}
