const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const login = async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y password son requeridos"
      });
    }

    const user = await prisma.usuarios.findUnique({
      where: { Email: email },
      include: { Rol: true }
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuario no encontrado"
      });
    }

    const token = jwt.sign(
      {
        id: user.Id,
        email: user.Email,
        rol: user.Rol.Nombre
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    res.json({ token });

  } catch (error) {

    console.error("ERROR LOGIN:", error);

    res.status(500).json({
      message: "Error en login",
      error: error.message
    });

  }
};

module.exports = {
  login
};