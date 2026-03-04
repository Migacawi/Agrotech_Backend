const pedidosRepo = require('../repositories/pedidos_repository');

const listPedidos = async () => await pedidosRepo.getAllPedidos();
const getPedido = async (id) => await pedidosRepo.getPedidoById(id);
const addPedido = async (data) => await pedidosRepo.createPedido(data);
const editPedido = async (id, data) => await pedidosRepo.updatePedido(id, data);
const removePedido = async (id) => await pedidosRepo.deletePedido(id);

module.exports = { listPedidos, getPedido, addPedido, editPedido, removePedido };