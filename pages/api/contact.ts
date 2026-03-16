import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST metódus engedélyezett.' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Kapcsolat űrlap <${process.env.MAIL_USER}>`,
      to: 'info.tifo@gmail.com',
      subject: `Új üzenet a kapcsolat űrlapról - ${name}`,
      replyTo: email,
      text: `Név: ${name}\nEmail: ${email}\n\nÜzenet:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Nodemailer válasz:', info);
    return res.status(200).json({ success: true, nodemailer: info });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Nem sikerült elküldeni az üzenetet.' });
  }
}
