const pagosRepo = require('../repositories/pagos_repository');

const listPagos = async () => await pagosRepo.getAllPagos();
const getPago = async (id) => await pagosRepo.getPagoById(id);
const addPago = async (data) => await pagosRepo.createPago(data);
const editPago = async (id, data) => await pagosRepo.updatePago(id, data);
const removePago = async (id) => await pagosRepo.deletePago(id);

module.exports = { listPagos, getPago, addPago, editPago, removePago };