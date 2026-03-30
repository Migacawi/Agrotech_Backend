const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPedido = async (data) => {
  const { detalles, ...pedidoData } = data;

  return prisma.pedidos.create({
    data: {
      CompradorId: pedidoData.CompradorId,
      Total: pedidoData.Total,
      Estado: pedidoData.Estado ?? "Pendiente",
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
};

const getAllPedidos = async () =>
  prisma.pedidos.findMany({
    include: {
      Usuario: true,
      Pago: true,
      Detalles: {
        include: {
          Producto: {
            include: {
              Imagenes: true, // ← fix
            },
          },
        },
      },
    },
  });

const getPedidoById = async (id) =>
  prisma.pedidos.findUnique({
    where: { Id: id },
    include: {
      Usuario: true,
      Pago: true,
      Detalles: {
        include: {
          Producto: {
            include: {
              Imagenes: true, // ← fix
            },
          },
        },
      },
    },
  });

const updatePedido = async (id, data) =>
  prisma.pedidos.update({ where: { Id: id }, data });

const deletePedido = async (id) => prisma.pedidos.delete({ where: { Id: id } });

module.exports = {
  createPedido,
  getAllPedidos,
  getPedidoById,
  updatePedido,
  deletePedido,
};
