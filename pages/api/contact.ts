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


    // HTML email body
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; background: #f8fafc; padding: 32px;">
        <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(15,23,42,0.10); padding: 32px 28px 18px 28px;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 18px;">
            <img src='https://tifo.hu/images/tifo-logo.png' alt='TIFO logó' style='height: 48px; width: 48px; border-radius: 12px; background: #f1f5f9; border: 1px solid #e2e8f0;' />
            <div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a; letter-spacing: -1px;">Törökbálinti Ifjúsági Önkormányzat</div>
              <div style="font-size: 0.95rem; color: #64748b; font-weight: 500;">Kapcsolat űrlap üzenet</div>
            </div>
          </div>
          <div style="margin-bottom: 18px;">
            <div style="font-size: 1.1rem; color: #0f172a; font-weight: 700; margin-bottom: 6px;">Feladó:</div>
            <div style="color: #334155; font-size: 1rem; margin-bottom: 2px;"><b>Név:</b> ${name}</div>
            <div style="color: #334155; font-size: 1rem;"><b>Email:</b> <a href='mailto:${email}' style='color: #0ea5e9;'>${email}</a></div>
          </div>
          <div style="margin-bottom: 24px;">
            <div style="font-size: 1.1rem; color: #0f172a; font-weight: 700; margin-bottom: 6px;">Üzenet:</div>
            <div style="color: #334155; font-size: 1.05rem; white-space: pre-line; background: #f1f5f9; border-radius: 10px; padding: 16px;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>
        </div>
        <div style="max-width: 520px; margin: 0 auto; text-align: center; color: #64748b; font-size: 0.95rem; padding: 18px 0 0 0;">
          <hr style='border: none; border-top: 1px solid #e2e8f0; margin-bottom: 10px;' />
          <div style="margin-bottom: 4px;">
            <img src='https://tifo.hu/images/tifo-logo.png' alt='TIFO logó' style='height: 28px; width: 28px; vertical-align: middle; margin-right: 6px;' />
            <span style="font-weight: 700; color: #0ea5e9;">TIFO</span> &middot; Törökbálinti Ifjúsági Önkormányzat
          </div>
          <div style="color: #94a3b8;">Ez az üzenet a tifo.hu kapcsolat űrlapjáról érkezett.</div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `Kapcsolat űrlap <${process.env.MAIL_USER}>`,
      to: 'info.tifo@gmail.com',
      subject: `Új üzenet a kapcsolat űrlapról - ${name}`,
      replyTo: email,
      text: `Név: ${name}\nEmail: ${email}\n\nÜzenet:\n${message}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Nodemailer válasz:', info);
    return res.status(200).json({ success: true, nodemailer: info });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Nem sikerült elküldeni az üzenetet.' });
  }
}
