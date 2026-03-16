import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

// GET: összes csapattag lekérése
export async function GET() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('displayorder', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PATCH: csapattag szerkesztése (bio, image, stb.)
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, bio, image } = body;

  if (!id) {
    return NextResponse.json({ error: 'Hiányzó ID.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('team_members')
    .update({ bio, image })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ member: data });
}
