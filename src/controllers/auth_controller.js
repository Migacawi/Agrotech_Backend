const jwt     = require("jsonwebtoken");
const prisma  = require("../prisma/client");
const { OAuth2Client }            = require("google-auth-library");
const { enviarCodigoRecuperacion } = require("../utils/mailer");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── LOGIN NORMAL ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email y password son requeridos" });

    const user = await prisma.usuarios.findUnique({
      where: { Email: email },
      include: { Rol: true },
    });

    if (!user)
      return res.status(401).json({ message: "Usuario no encontrado" });

    if (user.PasswordHash !== password)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.Id, email: user.Email, rol: user.Rol.Nombre },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ message: "Error en login", error: error.message });
  }
};

// ── LOGIN GOOGLE ─────────────────────────────────────────────────────────────
const loginGoogle = async (req, res) => {
  try {
    const { googleToken } = req.body;
    if (!googleToken)
      return res.status(400).json({ message: "Token de Google requerido" });

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await prisma.usuarios.findUnique({
      where: { Email: email },
      include: { Rol: true },
    });

    if (!user) {
      const rolVendedor = await prisma.roles.findUnique({
        where: { Nombre: "Vendedor" },
      });
      if (!rolVendedor)
        return res.status(500).json({ message: "Rol 'Vendedor' no encontrado" });

      user = await prisma.usuarios.create({
        data: {
          Nombre:       name,
          Email:        email,
          PasswordHash: "GOOGLE_AUTH",
          FotoUrl:      picture ?? null,
          Rol:          { connect: { Id: rolVendedor.Id } },
        },
        include: { Rol: true },
      });
    }

    const token = jwt.sign(
      { id: user.Id, email: user.Email, rol: user.Rol.Nombre },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("ERROR LOGIN GOOGLE:", error);
    res.status(401).json({ message: "Token de Google inválido", error: error.message });
  }
};

// ── SOLICITAR CÓDIGO ─────────────────────────────────────────────────────────
const solicitarCodigo = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email requerido" });

    const user = await prisma.usuarios.findUnique({ where: { Email: email } });
    if (!user)
      return res.status(404).json({ message: "No existe una cuenta con ese correo" });

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Invalidar códigos anteriores del usuario
    await prisma.codigoRecuperacion.updateMany({
      where: { UsuarioId: user.Id, Usado: false },
      data:  { Usado: true },
    });

    // Guardar nuevo código
    await prisma.codigoRecuperacion.create({
      data: { UsuarioId: user.Id, Codigo: codigo, Expira: expira },
    });

    await enviarCodigoRecuperacion(email, codigo);

    res.json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("ERROR SOLICITAR CÓDIGO:", error);
    res.status(500).json({ message: "Error al enviar el código", error: error.message });
  }
};

// ── VERIFICAR CÓDIGO ─────────────────────────────────────────────────────────
const verificarCodigo = async (req, res) => {
  try {
    const { email, codigo } = req.body;
    if (!email || !codigo)
      return res.status(400).json({ message: "Email y código requeridos" });

    const user = await prisma.usuarios.findUnique({ where: { Email: email } });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const registro = await prisma.codigoRecuperacion.findFirst({
      where: {
        UsuarioId: user.Id,
        Codigo:    codigo,
        Usado:     false,
        Expira:    { gt: new Date() },
      },
      orderBy: { Id: 'desc' },
    });

    if (!registro)
      return res.status(400).json({ message: "Código inválido o expirado" });

    res.json({ message: "Código válido", valid: true });
  } catch (error) {
    console.error("ERROR VERIFICAR CÓDIGO:", error);
    res.status(500).json({ message: "Error al verificar el código", error: error.message });
  }
};

// ── CAMBIAR CONTRASEÑA ───────────────────────────────────────────────────────
const cambiarPassword = async (req, res) => {
  try {
    const { email, codigo, nuevaPassword } = req.body;
    if (!email || !codigo || !nuevaPassword)
      return res.status(400).json({ message: "Todos los campos son requeridos" });

    const user = await prisma.usuarios.findUnique({ where: { Email: email } });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const registro = await prisma.codigoRecuperacion.findFirst({
      where: {
        UsuarioId: user.Id,
        Codigo:    codigo,
        Usado:     false,
        Expira:    { gt: new Date() },
      },
      orderBy: { Id: 'desc' },
    });

    if (!registro)
      return res.status(400).json({ message: "Código inválido o expirado" });

    // Marcar código como usado
    await prisma.codigoRecuperacion.update({
      where: { Id: registro.Id },
      data:  { Usado: true },
    });

    // Actualizar contraseña
    await prisma.usuarios.update({
      where: { Id: user.Id },
      data:  { PasswordHash: nuevaPassword },
    });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("ERROR CAMBIAR PASSWORD:", error);
    res.status(500).json({ message: "Error al cambiar la contraseña", error: error.message });
  }
};

module.exports = { login, loginGoogle, solicitarCodigo, verificarCodigo, cambiarPassword };