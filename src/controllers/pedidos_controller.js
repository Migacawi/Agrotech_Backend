const pedidosService = require("../services/pedidos_service");
const prisma = require("../prisma/client");
const {
  enviarConfirmacionPedido,
  enviarCambioEstado,
} = require("../utils/mailer");

const getPedidos = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    // 1. Si es administrador, ve TODO
    if (role === "administrador") {
      const pedidos = await pedidosService.listPedidos();
      return res.json(pedidos);
    }

    // 2. Si es Vendedor o Comprador, filtramos por sus relaciones
    const pedidos = await prisma.pedidos.findMany({
      where: {
        OR: [
          { CompradorId: userId },
          {
            Detalles: {
              some: {
                Producto: { VendedorId: userId },
              },
            },
          },
        ],
      },
      include: {
        Detalles: {
          include: {
            Producto: {
              include: { Imagenes: true },
            },
          },
        },
        Usuario: {
          select: { Nombre: true, Email: true },
        },
        Pago: true,
      },
      orderBy: { Id: "desc" },
    });

    res.json(pedidos);
  } catch (err) {
    console.error("Error en getPedidos:", err);
    res.status(500).json({ error: err.message });
  }
};

const getPedidoById = async (req, res) => {
  try {
    const pedido = await pedidosService.getPedido(parseInt(req.params.id));
    if (!pedido)
      return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPedido = async (req, res) => {
  try {
    const { detalles, metodoPago, ...resto } = req.body;

    if (!detalles?.length)
      return res
        .status(400)
        .json({ message: "El pedido debe tener al menos un producto." });

    const CompradorId = req.user?.id ?? req.body.CompradorId;
    if (!CompradorId)
      return res.status(401).json({ message: "Usuario no autenticado." });

    const pedido = await pedidosService.addPedido({
      ...resto,
      CompradorId,
      detalles,
    });

    // Email de confirmación
    prisma.usuarios
      .findUnique({ where: { Id: CompradorId } })
      .then((u) => {
        if (u)
          enviarConfirmacionPedido(u.Email, u.Nombre, pedido).catch(() => {});
      })
      .catch(() => {});

    res.status(201).json(pedido);
  } catch (err) {
    console.error("Error en createPedido:", err);

    // Errores específicos
    if (err.message.includes("Producto no encontrado")) {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("stock")) {
      return res.status(409).json({ message: err.message });
    }

    // Error genérico
    res.status(500).json({ error: err.message || "Error al crear pedido" });
  }
};

const updatePedido = async (req, res) => {
  try {
    const pedidoId = parseInt(req.params.id);
    const pedidoAntes = await pedidosService.getPedido(pedidoId);

    const pedidoActualizado = await pedidosService.editPedido(
      pedidoId,
      req.body,
    );

    // Si cambió el estado, notificar al comprador
    if (req.body.Estado && req.body.Estado !== pedidoAntes?.Estado) {
      const compradorId = pedidoAntes?.CompradorId || pedidoAntes?.Usuario?.Id;
      if (compradorId) {
        prisma.usuarios
          .findUnique({ where: { Id: compradorId } })
          .then((u) => {
            if (u)
              enviarCambioEstado(
                u.Email,
                u.Nombre,
                pedidoActualizado.Id,
                req.body.Estado,
              ).catch(() => {});
          })
          .catch(() => {});
      }
    }

    res.json(pedidoActualizado);
  } catch (err) {
    console.error("Error en updatePedido:", err);
    res.status(500).json({ error: err.message });
  }
};

const deletePedido = async (req, res) => {
  try {
    await pedidosService.removePedido(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
};
