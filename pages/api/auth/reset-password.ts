import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token és jelszó szükséges' });
  }
  // Token ellenőrzése
  const { data: tokenRow, error: tokenError } = await supabase
    .from('password_reset_tokens')
    .select('user_id, expires_at')
    .eq('token', token)
    .single();
  if (tokenError || !tokenRow) {
    return res.status(400).json({ error: 'Érvénytelen vagy lejárt token' });
  }
  if (new Date(tokenRow.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Token lejárt' });
  }
  // Jelszó frissítése
  const { error: updateError } = await supabase
    .from('users')
    .update({ password })
    .eq('id', tokenRow.user_id);
  if (updateError) {
    return res.status(500).json({ error: 'Jelszó frissítése sikertelen' });
  }
  // Token törlése
  await supabase
    .from('password_reset_tokens')
    .delete()
    .eq('token', token);
  return res.status(200).json({ success: true });
}
