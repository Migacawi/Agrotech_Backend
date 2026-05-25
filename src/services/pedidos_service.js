const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const pedidosRepo = require("../repositories/pedidos_repository");

const listPedidos = async () => pedidosRepo.getAllPedidos();
const getPedido = async (id) => pedidosRepo.getPedidoById(id);

const addPedido = async (data) => {
  const { detalles, ...resto } = data;

  try {
    // Envolver en transacción: crea el pedido Y descuenta stock, o falla ambos
    const pedido = await prisma.$transaction(async (tx) => {
      // 1. Crear el pedido con sus detalles
      const createdPedido = await tx.pedidos.create({
        data: {
          ...resto,
          Detalles: {
            create: detalles.map((d) => ({
              ProductoId: d.ProductoId,
              CantidadLibras: d.Cantidad,
              PrecioUnitario: d.PrecioUnitario,
              Subtotal: d.Cantidad * d.PrecioUnitario,
            })),
          },
        },
        include: { Detalles: true },
      });

      // 2. Descontar stock de cada producto vendido
      for (const detalle of detalles) {
        await tx.productos.update({
          where: { Id: detalle.ProductoId },
          data: {
            StockLibras: {
              decrement: detalle.Cantidad,
            },
          },
        });
      }

      return createdPedido;
    });

    return pedido;
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Producto no encontrado");
    }
    throw error;
  }
};

const editPedido = async (id, data) => pedidosRepo.updatePedido(id, data);
const removePedido = async (id) => pedidosRepo.deletePedido(id);

module.exports = {
  listPedidos,
  getPedido,
  addPedido,
  editPedido,
  removePedido,
};
