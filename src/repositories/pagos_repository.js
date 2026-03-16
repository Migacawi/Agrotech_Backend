const prisma = require('../prisma/client');

const getAllPagos = async () => 
  prisma.pagos.findMany({ include: { Pedido: true } });

const getPagoById = async (id) => 
  prisma.pagos.findUnique({ where: { Id: id }, include: { Pedido: true } });

const getPagoByPedidoId = async (pedidoId) =>
  prisma.pagos.findUnique({ where: { PedidoId: pedidoId }, include: { Pedido: true } });

const createPago = async (data) => 
  prisma.pagos.create({ data });

const updatePago = async (id, data) => 
  prisma.pagos.update({ where: { Id: id }, data });

const deletePago = async (id) => 
  prisma.pagos.delete({ where: { Id: id } });

module.exports = { getAllPagos, getPagoById, getPagoByPedidoId, createPago, updatePago, deletePago };