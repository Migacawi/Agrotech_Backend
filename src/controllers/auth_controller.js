const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const login = async (req, res) => {

  const { email, password } = req.body;

  const user = await prisma.usuarios.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({
      message: "Usuario no encontrado"
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol_id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h"
    }
  );

  res.json({
    token
  });

};

module.exports = {
  login
};