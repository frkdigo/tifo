import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Debug: listázzuk ki az összes tokent, amit az API lát
    const allTokensResult = await supabase
      .from('password_reset_tokens')
      .select('id, user_id, token, expires_at');
    console.log('Összes token a táblában (API-ból):', allTokensResult.data);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token és jelszó szükséges' });
  }
  // Token ellenőrzése - debug logokkal
  console.log('Kapott token:', token);
  const { data: tokenRow, error: tokenError } = await supabase
    .from('password_reset_tokens')
    .select('user_id, expires_at, token')
    .eq('token', token)
    .single();
  console.log('Token lekérdezés eredménye:', { tokenRow, tokenError });
  if (tokenError || !tokenRow) {
    return res.status(400).json({ error: 'Érvénytelen vagy lejárt token', debug: { token, tokenRow, tokenError } });
  }
  // Időzóna és formátum debug
  const expiresAtUtc = new Date(tokenRow.expires_at).toISOString();
  const nowUtc = new Date().toISOString();
  console.log('expires_at (UTC):', expiresAtUtc, 'now (UTC):', nowUtc);
  if (new Date(expiresAtUtc) < new Date(nowUtc)) {
    return res.status(400).json({ error: 'Token lejárt', debug: { expires_at: expiresAtUtc, now: nowUtc } });
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
