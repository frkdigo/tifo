import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { sendMail } from '../../../lib/sendMail';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email szükséges' });
  }
  // Ellenőrizd, hogy létezik-e user csak email alapján
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  if (userError || !user) {
    return res.status(404).json({ error: 'Nincs ilyen felhasználó' });
  }
  // Előző tokenek törlése ehhez a userhez (mindig új linket küldjünk)
  await supabase
    .from('password_reset_tokens')
    .delete()
    .eq('user_id', user.id);

  // Generálj új token-t
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 perc
  // Mentsd el az új token-t, és logoljunk mindent
  const { error: insertError, data: insertData } = await supabase
    .from('password_reset_tokens')
    .insert([{ user_id: user.id, token, expires_at: expires }]);
  console.log('Token beszúrás:', { user_id: user.id, token, expires_at: expires });
  if (insertError) {
    console.error('Token beszúrási hiba:', insertError);
    return res.status(500).json({ error: 'Token beszúrási hiba', details: insertError });
  }
  // Küldj emailt
  const resetUrl = `https://tifo.hu/auth/reset-password?token=${token}`;
  try {
    await sendMail(email, resetUrl);
  } catch (mailErr) {
    console.error('Email küldési hiba:', mailErr);
    return res.status(500).json({ error: 'Email küldése sikertelen' });
  }
  return res.status(200).json({ success: true });
}
