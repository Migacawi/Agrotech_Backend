const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const pedidosRepo = require("../repositories/pedidos_repository");

const listPedidos = async () => pedidosRepo.getAllPedidos();
const getPedido = async (id) => pedidosRepo.getPedidoById(id);

const addPedido = async (data) => {
  const { detalles, ...resto } = data;

  // 1. Crear el pedido con sus detalles (lógica existente, sin tocar)
  const pedido = await pedidosRepo.createPedido({ detalles, ...resto });

  // 2. Descontar stock de cada producto vendido
  for (const detalle of detalles) {
    await prisma.productos.update({
      where: { Id: detalle.ProductoId },
      data: {
        StockLibras: {
          decrement: detalle.Cantidad, // mismo campo que usa el repo
        },
      },
    });
  }

  return pedido;
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
