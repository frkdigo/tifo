import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST metódus engedélyezett.' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező.' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: 'Kapcsolat űrlap <onboarding@resend.dev>',
      to: ['info.tifo@gmail.com'],
      subject: `Új üzenet a kapcsolat űrlapról - ${name}`,
      replyTo: email,
      text: `Név: ${name}\nEmail: ${email}\n\nÜzenet:\n${message}`,
    });
    console.log('RESEND API VÁLASZ:', result);
    return res.status(200).json({ success: true, resend: result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Nem sikerült elküldeni az üzenetet.' });
  }
}
