const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllDetallePedido = async () => prisma.detallePedido.findMany({
    include: { Pedidos: true, Productos: true }
});

const getDetallePedidoById = async (id) => prisma.detallePedido.findUnique({
    where: { Id: id },
    include: { Pedidos: true, Productos: true }
});

const createDetallePedido = async (data) => prisma.detallePedido.create({ data });
const updateDetallePedido = async (id, data) => prisma.detallePedido.update({ where: { Id: id }, data });
const deleteDetallePedido = async (id) => prisma.detallePedido.delete({ where: { Id: id } });

module.exports = { getAllDetallePedido, getDetallePedidoById, createDetallePedido, updateDetallePedido, deleteDetallePedido };