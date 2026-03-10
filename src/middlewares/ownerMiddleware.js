const prisma = require("../prisma/client");

const ownerMiddleware = async (req, res, next) => {

  const productoId = Number(req.params.id);

  const producto = await prisma.productos.findUnique({
    where: { id: productoId }
  });

  if (!producto) {
    return res.status(404).json({
      message: "Producto no encontrado"
    });
  }

  if (producto.usuario_id !== req.user.id) {
    return res.status(403).json({
      message: "No eres el dueño de este producto"
    });
  }

  next();

};

module.exports = ownerMiddleware;