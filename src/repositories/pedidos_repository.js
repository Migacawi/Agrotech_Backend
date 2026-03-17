const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPedido = async (data) =>
  prisma.pedidos.create({
    data
  });

const getAllPedidos = async () =>
  prisma.pedidos.findMany({
    include: {
      Usuario: true,
      Detalles: true,
      Pago: true
    }
  });

module.exports = {
  createPedido,
  getAllPedidos
};