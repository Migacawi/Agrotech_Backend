const roleMiddleware = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.rol?.toLowerCase();

    if (!userRole) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const rolesPermitidos = Array.isArray(role)
      ? role.map(r => r.toLowerCase())
      : [role.toLowerCase()];

    if (!rolesPermitidos.includes(userRole)) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    next();
  };
};

module.exports = roleMiddleware;