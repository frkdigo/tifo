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
    html: `<p>Jelszó visszaállításához kattints az alábbi linkre:</p><p><a href='${resetUrl}'>Jelszó visszaállítása</a></p><p>A link 30 percig érvényes.</p>`,
  };

  return transporter.sendMail(mailOptions);
}
