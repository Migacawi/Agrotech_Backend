const pedidosRepo = require('../repositories/pedidos_repository');

const listPedidos  = async ()         => pedidosRepo.getAllPedidos();
const getPedido    = async (id)       => pedidosRepo.getPedidoById(id);
const addPedido    = async (data)     => pedidosRepo.createPedido(data);
const editPedido   = async (id, data) => pedidosRepo.updatePedido(id, data);
const removePedido = async (id)       => pedidosRepo.deletePedido(id);

module.exports = { listPedidos, getPedido, addPedido, editPedido, removePedido };