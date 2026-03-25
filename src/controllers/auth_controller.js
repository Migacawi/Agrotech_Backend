const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son requeridos" });
    }

    const user = await prisma.usuarios.findUnique({
      where: { Email: email },
      include: { Rol: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    if (user.PasswordHash !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

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

const loginGoogle = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ message: "Token de Google requerido" });
    }

    // Verificar el token con Google
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Buscar si el usuario ya existe
    let user = await prisma.usuarios.findUnique({
      where: { Email: email },
      include: { Rol: true },
    });

    // Si no existe, crearlo automáticamente con rol "Vendedor"
    if (!user) {
      const rolVendedor = await prisma.roles.findUnique({
        where: { Nombre: "Vendedor" },
      });

      if (!rolVendedor) {
        return res.status(500).json({
          message: "Rol 'Vendedor' no encontrado en la base de datos",
        });
      }

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

module.exports = { login, loginGoogle };