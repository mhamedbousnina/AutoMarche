import "dotenv/config"; 
import nodemailer from "nodemailer";


console.log("HOST =", process.env.MAIL_HOST);
console.log("PORT =", process.env.MAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendResetEmail({ to, resetLink }) {
  // 1. On ne RE-DÉCLARE PAS resetLink ici, on l'utilise directement.
  // 2. On vérifie juste s'il est valide au cas où le backend a envoyé 'undefined'
  const finalLink = resetLink.startsWith("undefined") 
    ? resetLink.replace("undefined", process.env.FRONTEND_URL || "http://localhost:5173") 
    : resetLink;

  await transporter.sendMail({
    from: '"AutoMarché" <mhamed802010@gmail.com>',
    to: to,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <div style="font-family: sans-serif; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #1e293b;">AutoMarché</h2>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous (valable 10 minutes) :</p>
        <div style="margin: 20px 0;">
          <a href="${finalLink}" 
             style="background-color: #facc15; color: #1e293b; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b;">Si le bouton ne fonctionne pas, copiez ce lien : <br/> ${finalLink}</p>
      </div>
    `
  });
}
