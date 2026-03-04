const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPedidos = async () => prisma.pedidos.findMany({
    include: { Usuarios: true, DetallePedido: true, Pagos: true }
});

const getPedidoById = async (id) => prisma.pedidos.findUnique({
    where: { Id: id },
    include: { Usuarios: true, DetallePedido: true, Pagos: true }
});

const createPedido = async (data) => prisma.pedidos.create({ data });
const updatePedido = async (id, data) => prisma.pedidos.update({ where: { Id: id }, data });
const deletePedido = async (id) => prisma.pedidos.delete({ where: { Id: id } });

module.exports = { getAllPedidos, getPedidoById, createPedido, updatePedido, deletePedido };