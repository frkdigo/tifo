import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type TeamMemberRow = {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  displayOrder: number;
};


export async function GET(req: NextRequest) {
  const { data: team, error } = await supabase
    .from('team_members')
    .select('id, name, role, bio, image, displayOrder')
    .order('displayOrder', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(team, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, bio, image, actorEmail } = await req.json();
    if (!id || !actorEmail) {
      return NextResponse.json({ error: 'Hiányzó adat.' }, { status: 400 });
    }
    // Admin ellenőrzés
    const { data: actor, error: actorError } = await supabase
      .from('users')
      .select('isAdmin')
      .eq('email', actorEmail)
      .single();
    if (actorError || !actor?.isAdmin) {
      return NextResponse.json({ error: 'Csak admin szerkesztheti.' }, { status: 403 });
    }
    // Előző kép lekérése
    const { data: prev, error: prevError } = await supabase
      .from('team_members')
      .select('image')
      .eq('id', id)
      .single();
    if (prevError || !prev) {
      return NextResponse.json({ error: 'Személy nem található.' }, { status: 404 });
    }
    const nextBio = typeof bio === 'string' ? bio : '';
    const nextImage = image === undefined ? prev.image : image || null;
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ bio: nextBio, image: nextImage })
      .eq('id', id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    const { data: updated } = await supabase
      .from('team_members')
      .select('id, name, role, bio, image, displayOrder')
      .eq('id', id)
      .single();
    return NextResponse.json({ member: updated });
  } catch (e: any) {
    const message = e?.message || 'Ismeretlen hiba';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
