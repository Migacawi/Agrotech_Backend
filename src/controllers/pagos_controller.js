const pagosService = require('../services/pagos_service');

const getPagos = async (req, res) => {
  try {
    const pagos = await pagosService.listPagos();
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPagoById = async (req, res) => {
  try {
    const pago = await pagosService.getPago(parseInt(req.params.id));
    if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(pago);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const procesarPago = async (req, res) => {
  try {
    const { pedidoId, metodoPago } = req.body;

    if (!pedidoId || !metodoPago)
      return res.status(400).json({ message: 'pedidoId y metodoPago son requeridos' });

    const resultado = await pagosService.procesarPago(parseInt(pedidoId), metodoPago);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const confirmarEfectivo = async (req, res) => {
  try {
    const resultado = await pagosService.confirmarEfectivo(parseInt(req.params.id));
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePago = async (req, res) => {
  try {
    await pagosService.removePago(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPagos, getPagoById, procesarPago, confirmarEfectivo, deletePago };