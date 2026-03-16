import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';





// POST /api/auth/register { email, password }
export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: 'Név, email és jelszó kötelező' }, { status: 400 });
  // Ellenőrizzük, hogy van-e már ilyen email
  const { data: existingUsers, error: getUserError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .limit(1);
  if (getUserError) {
    return NextResponse.json({ error: 'Adatbázis hiba: ' + getUserError.message }, { status: 500 });
  }
  if (existingUsers && existingUsers.length > 0) {
    return NextResponse.json({ error: 'Ezzel az email címmel már létezik fiók. Kérlek, jelentkezz be vagy használj másik email címet!' }, { status: 400 });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const { data: insertData, error: insertError } = await supabase
    .from('users')
    .insert([{ name, nickname: name, email, passwordHash, isadmin: false, profileimage: null }])
    .select('id, name, nickname, profileimage, email, isadmin');
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  // TODO: session kezelése (cookie, JWT, stb.)
  return NextResponse.json({ user: insertData && insertData[0] });
}

// POST /api/auth/login { email, password }
export async function PUT(req: NextRequest) {
  const { email, password } = await req.json();
  const { data: users, error: getUserError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);
  if (getUserError) return NextResponse.json({ error: getUserError.message }, { status: 500 });
  const user = users && users[0];
  if (!user) return NextResponse.json({ error: 'Hibás email vagy jelszó' }, { status: 401 });
  if (!bcrypt.compareSync(password, user.passwordHash)) return NextResponse.json({ error: 'Hibás email vagy jelszó' }, { status: 401 });
  // TODO: session kezelése (cookie, JWT, stb.)
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      nickname: user.nickname || user.name,
      profileimage: user.profileimage,
      email: user.email,
      isadmin: !!user.isadmin,
    },
  });
}
