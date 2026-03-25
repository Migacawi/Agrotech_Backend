const pedidosService = require('../services/pedidos_service');

const getPedidos = async (req, res) => {
  try {
    const pedidos = await pedidosService.listPedidos();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPedidoById = async (req, res) => {
  try {
    const pedido = await pedidosService.getPedido(parseInt(req.params.id));
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPedido = async (req, res) => {
  try {
    const { detalles, metodoPago, ...resto } = req.body;

    if (!detalles?.length)
      return res.status(400).json({ message: 'El pedido debe tener al menos un producto.' });

    // CompradorId viene del token
    const CompradorId = req.user?.id ?? req.body.CompradorId;
    if (!CompradorId)
      return res.status(401).json({ message: 'Usuario no autenticado.' });

    const pedido = await pedidosService.addPedido({
      ...resto,
      CompradorId,
      detalles,
    });

    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePedido = async (req, res) => {
  try {
    const pedido = await pedidosService.editPedido(parseInt(req.params.id), req.body);
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePedido = async (req, res) => {
  try {
    await pedidosService.removePedido(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPedidos, getPedidoById, createPedido, updatePedido, deletePedido };