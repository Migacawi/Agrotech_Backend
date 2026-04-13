const nodemailer = require('nodemailer');

/** True si hay credenciales para enviar correo (evita 500 opacos en recuperar contraseña). */
const correoEstaConfigurado = () =>
  Boolean(
    String(process.env.GMAIL_USER || '').trim() &&
      String(process.env.GMAIL_PASS || '').trim()
  );

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ── Estilos base del email ────────────────────────────────────────────────────
const baseStyle = `font-family: 'Arial', sans-serif; max-width: 520px; margin: auto;`;
const headerHtml = (titulo) => `
  <div style="${baseStyle}">
    <div style="background: #07393c; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px;">AgroTech</h1>
      <p style="color: #a8d5c2; margin: 6px 0 0; font-size: 14px;">${titulo}</p>
    </div>
    <div style="background: #fff; padding: 32px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
`;
const footerHtml = `
    <p style="color: #bbb; font-size: 11px; margin-top: 24px; text-align: center;">
      © ${new Date().getFullYear()} AgroTech — Marketplace Agrícola Colombiano
    </p>
    </div>
  </div>
`;

// ── 1. Código de recuperación de contraseña ───────────────────────────────────
const enviarCodigoRecuperacion = async (email, codigo) => {
  await transporter.sendMail({
    from: `"AgroTech" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Código de recuperación — AgroTech',
    html: `
      ${headerHtml('Recuperación de contraseña')}
        <p style="color: #333;">Usa el siguiente código para restablecer tu contraseña. Expira en <strong>15 minutos</strong>.</p>
        <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #07393c; text-align: center; padding: 24px 0;"
        >${codigo}</div>
        <p style="color: #999; font-size: 12px;">Si no solicitaste esto, ignora este correo.</p>
      ${footerHtml}
    `,
  });
};

// ── 2. Bienvenida al registrarse ──────────────────────────────────────────────
const enviarBienvenida = async (email, nombre) => {
  await transporter.sendMail({
    from: `"AgroTech" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '¡Bienvenido a AgroTech!',
    html: `
      ${headerHtml('¡Tu cuenta fue creada exitosamente!')}
        <p style="color: #333; font-size: 15px;">Hola <strong>${nombre}</strong>,</p>
        <p style="color: #555;">Te damos la bienvenida a <strong>AgroTech</strong>, el marketplace agrícola colombiano. Ahora puedes:</p>
        <ul style="color: #555; line-height: 2;">
          <li>Explorar y comprar productos frescos del campo</li>
          <li>Gestionar tus pedidos desde tu perfil</li>
          <li>Publicar y vender tus propios productos</li>
        </ul>
        <div style="text-align: center; margin-top: 24px;">
          <a href="http://localhost:5173" style="background: #07393c; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Ir a la tienda →</a>
        </div>
      ${footerHtml}
    `,
  });
};

// ── 3. Confirmación de pedido ─────────────────────────────────────────────────
const enviarConfirmacionPedido = async (email, nombre, pedido) => {
  const productosHtml = (pedido.Detalles || []).map(d => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${d.Producto?.Nombre || 'Producto'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">${d.CantidadLibras} lb</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">$${Number(d.Subtotal).toLocaleString('es-CO')}</td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from: `"AgroTech" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Pedido #${pedido.Id} confirmado — AgroTech`,
    html: `
      ${headerHtml(`Pedido #${pedido.Id} recibido`)}
        <p style="color: #333;">Hola <strong>${nombre}</strong>, tu pedido fue recibido correctamente.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f5fafa;">
              <th style="padding: 8px; text-align: left; color: #07393c;">Producto</th>
              <th style="padding: 8px; text-align: center; color: #07393c;">Cantidad</th>
              <th style="padding: 8px; text-align: right; color: #07393c;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${productosHtml}</tbody>
        </table>
        <p style="text-align: right; font-size: 16px; font-weight: bold; color: #07393c;">
          Total: $${Number(pedido.Total).toLocaleString('es-CO')} COP
        </p>
        <p style="color: #888; font-size: 13px;">Puedes ver el estado de tu pedido en tu historial de compras.</p>
      ${footerHtml}
    `,
  });
};

// ── 4. Cambio de estado del pedido ────────────────────────────────────────────
const enviarCambioEstado = async (email, nombre, pedidoId, nuevoEstado) => {
  const colores = { Pendiente: '#856404', Enviado: '#004085', Entregado: '#155724', Cancelado: '#721c24', Pagado: '#155724' };
  const color  = colores[nuevoEstado] || '#07393c';

  await transporter.sendMail({
    from: `"AgroTech" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Pedido #${pedidoId} actualizado: ${nuevoEstado} — AgroTech`,
    html: `
      ${headerHtml(`Actualización de tu pedido`)}
        <p style="color: #333;">Hola <strong>${nombre}</strong>,</p>
        <p style="color: #555;">El estado de tu pedido <strong>#${pedidoId}</strong> ha cambiado a:</p>
        <div style="background: #f5fafa; border-left: 4px solid ${color}; padding: 16px 20px; border-radius: 4px; margin: 16px 0;">
          <span style="font-size: 20px; font-weight: bold; color: ${color};">${nuevoEstado}</span>
        </div>
        <p style="color: #888; font-size: 13px;">Revisa los detalles en tu historial de compras.</p>
      ${footerHtml}
    `,
  });
};

module.exports = {
  correoEstaConfigurado,
  enviarCodigoRecuperacion,
  enviarBienvenida,
  enviarConfirmacionPedido,
  enviarCambioEstado,
};
