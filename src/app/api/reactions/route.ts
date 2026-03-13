import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: összes reakció lekérdezése (posztId szerint)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const postId = searchParams.get('postId');
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });
  const { data, error } = await supabase
    .from('reactions')
    .select('type')
    .eq('postId', postId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Count reactions by type
  const counts: Record<string, number> = {};
  (data || []).forEach((r) => {
    counts[r.type] = (counts[r.type] || 0) + 1;
  });
  const reactions = Object.entries(counts).map(([type, count]) => ({ type, count }));
  return NextResponse.json(reactions);
}

// POST: reakció hozzáadása/módosítása (userId most mock, később auth)
export async function POST(req: NextRequest) {
  const { postId, type, userId } = await req.json();
  // TODO: userId-t sessionből/authból vedd, most mock, most paraméterből vagy 1
  const realUserId = userId || 1;
  // Egy user csak egy reakciót adhat egy posztra
  const { error } = await supabase
    .from('reactions')
    .upsert({ postId, userId: realUserId, type }, { onConflict: 'postId,userId' });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
