const detallePedidoService = require('../services/detallepedido_service');

const getDetallePedidos = async (req, res) => {
    try {
        const detalles = await detallePedidoService.listDetallePedido();
        res.json(detalles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDetallePedidoById = async (req, res) => {
    try {
        const detalle = await detallePedidoService.getDetallePedido(parseInt(req.params.id));
        res.json(detalle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createDetallePedido = async (req, res) => {
    try {
        const detalle = await detallePedidoService.addDetallePedido(req.body);
        res.status(201).json(detalle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateDetallePedido = async (req, res) => {
    try {
        const detalle = await detallePedidoService.editDetallePedido(parseInt(req.params.id), req.body);
        res.json(detalle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteDetallePedido = async (req, res) => {
    try {
        await detallePedidoService.removeDetallePedido(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getDetallePedidos, getDetallePedidoById, createDetallePedido, updateDetallePedido, deleteDetallePedido };