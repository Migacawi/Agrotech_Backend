const roleMiddleware = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.rol;

    if (!userRole) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (userRole !== role) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    next();
  };
};

module.exports = roleMiddleware;