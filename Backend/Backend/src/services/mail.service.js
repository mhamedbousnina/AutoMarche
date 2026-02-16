import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: false,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

export async function sendResetEmail({ to, resetLink }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Réinitialisation - AutoMarché",
    html: `
      <p>Bonjour,</p>
      <p>Cliquez ici pour réinitialiser votre mot de passe :</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Si ce n’est pas vous, ignorez ce mail.</p>
    `,
  });
}