const detallePedidoRepo = require('../repositories/detallepedido_repository');

const listDetallePedido = async () => await detallePedidoRepo.getAllDetallePedido();
const getDetallePedido = async (id) => await detallePedidoRepo.getDetallePedidoById(id);
const addDetallePedido = async (data) => await detallePedidoRepo.createDetallePedido(data);
const editDetallePedido = async (id, data) => await detallePedidoRepo.updateDetallePedido(id, data);
const removeDetallePedido = async (id) => await detallePedidoRepo.deleteDetallePedido(id);

module.exports = { listDetallePedido, getDetallePedido, addDetallePedido, editDetallePedido, removeDetallePedido };