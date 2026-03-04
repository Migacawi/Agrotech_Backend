const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPagos = async () => prisma.pagos.findMany({ include: { Pedidos: true } });
const getPagoById = async (id) => prisma.pagos.findUnique({ where: { Id: id }, include: { Pedidos: true } });
const createPago = async (data) => prisma.pagos.create({ data });
const updatePago = async (id, data) => prisma.pagos.update({ where: { Id: id }, data });
const deletePago = async (id) => prisma.pagos.delete({ where: { Id: id } });

module.exports = { getAllPagos, getPagoById, createPago, updatePago, deletePago };