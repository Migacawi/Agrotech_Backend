const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const enviarCodigoRecuperacion = async (email, codigo) => {
  await transporter.sendMail({
    from: `"Agrotech" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Código de recuperación de contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #07393c;">Recuperación de contraseña</h2>
        <p>Usa el siguiente código para restablecer tu contraseña. Expira en <strong>15 minutos</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #07393c; text-align: center; padding: 24px 0;">
          ${codigo}
        </div>
        <p style="color: #999; font-size: 12px;">Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });
};

module.exports = { enviarCodigoRecuperacion };