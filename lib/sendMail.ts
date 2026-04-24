import nodemailer from "nodemailer";

export async function sendMail(to: string, resetUrl: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: "Jelszó visszaállítás - tifo.hu",
    html: `
      <div style="background: #fff; padding: 32px 0; min-height: 100vh; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #0f172a;">
        <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px -12px rgba(15,23,42,0.13); border: 1px solid #e2e8f0; padding: 32px 28px;">
          <div style="text-align: center; margin-bottom: 18px;">
            <img src='https://tifo.hu/images/logo.jpg' alt='TIFO logó' style='height: 56px; width: 56px; border-radius: 50%; box-shadow: 0 2px 8px #bae6fd; margin-bottom: 8px;' />
            <div style="font-size: 11px; letter-spacing: 0.2em; color: #38bdf8; font-weight: bold;">TIFO</div>
            <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-bottom: 2px;">Törökbálinti Ifjúsági Önkormányzat</div>
          </div>
          <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 18px; text-align: center;">Jelszó visszaállítása</h2>
          <p style="font-size: 15px; color: #334155; margin-bottom: 18px; text-align: center;">Jelszó visszaállításához kattints az alábbi gombra. A link 30 percig érvényes.</p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%); color: #fff; font-weight: bold; font-size: 16px; padding: 12px 32px; border-radius: 999px; text-decoration: none; box-shadow: 0 2px 8px #bae6fd; letter-spacing: 0.01em; transition: background 0.2s;">Jelszó visszaállítása</a>
          </div>
          <div style="font-size: 13px; color: #64748b; text-align: center;">Ha nem te kérted a jelszó visszaállítását, hagyd figyelmen kívül ezt az emailt.</div>
        </div>
        <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} TIFO</div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
