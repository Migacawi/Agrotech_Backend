const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  // Obtener header Authorization
  const authHeader = req.headers.authorization;

  // Verificar si existe
  if (!authHeader) {
    return res.status(401).json({
      message: "Token no proporcionado"
    });
  }

  // Formato esperado: Bearer TOKEN
  const token = authHeader.split(" ")[1];

  try {

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar usuario en request
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Token inválido"
    });

  }

};

module.exports = authMiddleware;