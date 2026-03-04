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
        res.json(pago);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createPago = async (req, res) => {
    try {
        const pago = await pagosService.addPago(req.body);
        res.status(201).json(pago);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePago = async (req, res) => {
    try {
        const pago = await pagosService.editPago(parseInt(req.params.id), req.body);
        res.json(pago);
    } catch (err) {
        res.status(500).json({ error: err.message });
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

module.exports = { getPagos, getPagoById, createPago, updatePago, deletePago };