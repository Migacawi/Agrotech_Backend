const pagosRepo = require('../repositories/pagos_repository');
const prisma = require('../prisma/client');

// Simula el resultado según el método de pago
const simularPago = (metodoPago) => {
  switch (metodoPago) {
    case 'tarjeta':
      return Math.random() < 0.8 ? 'Aprobado' : 'Rechazado';
    case 'transferencia':
      return 'Aprobado';
    case 'efectivo':
      return 'Pendiente';
    default:
      throw new Error(`Método de pago no válido: ${metodoPago}. Use tarjeta, transferencia o efectivo`);
  }
};

const listPagos = async () => pagosRepo.getAllPagos();
const getPago = async (id) => pagosRepo.getPagoById(id);

const procesarPago = async (pedidoId, metodoPago) => {
  // Verificar que el pedido existe
  const pedido = await prisma.pedidos.findUnique({ where: { Id: pedidoId } });
  if (!pedido) throw new Error('Pedido no encontrado');

  // Verificar que no tenga ya un pago
  const pagoExistente = await pagosRepo.getPagoByPedidoId(pedidoId);
  if (pagoExistente) throw new Error('Este pedido ya tiene un pago registrado');

  // Simular resultado
  const estadoPago = simularPago(metodoPago);

  // Crear el pago
  const pago = await pagosRepo.createPago({
    PedidoId:   pedidoId,
    MetodoPago: metodoPago,
    Estado:     estadoPago,
    FechaPago:  new Date()
  });

  // Si fue aprobado, actualizar el estado del pedido
  if (estadoPago === 'Aprobado') {
    await prisma.pedidos.update({
      where: { Id: pedidoId },
      data:  { Estado: 'Pagado' }
    });
  }

  return {
    pago,
    mensaje: estadoPago === 'Aprobado'
      ? 'Pago aprobado, pedido confirmado'
      : estadoPago === 'Pendiente'
      ? '⏳ Pago en efectivo pendiente de confirmación'
      : 'Pago rechazado, intente con otro método'
  };
};

// Confirmar pago en efectivo manualmente
const confirmarEfectivo = async (pagoId) => {
  const pago = await pagosRepo.getPagoById(pagoId);
  if (!pago) throw new Error('Pago no encontrado');
  if (pago.MetodoPago !== 'efectivo') throw new Error('Solo se pueden confirmar pagos en efectivo');
  if (pago.Estado !== 'Pendiente') throw new Error('Este pago ya fue procesado');

  const pagoActualizado = await pagosRepo.updatePago(pagoId, { Estado: 'Aprobado' });

  await prisma.pedidos.update({
    where: { Id: pago.PedidoId },
    data:  { Estado: 'Pagado' }
  });

  return { pago: pagoActualizado, mensaje: 'Pago en efectivo confirmado' };
};

const editPago = async (id, data) => pagosRepo.updatePago(id, data);
const removePago = async (id) => pagosRepo.deletePago(id);

module.exports = { listPagos, getPago, procesarPago, confirmarEfectivo, editPago, removePago };