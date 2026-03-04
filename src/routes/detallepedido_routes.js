const express = require('express');
const router = express.Router();
const detallePedidoController = require('../controllers/detallepedido_controller');

router.get('/', detallePedidoController.getDetallePedidos);
router.get('/:id', detallePedidoController.getDetallePedidoById);
router.post('/', detallePedidoController.createDetallePedido);
router.put('/:id', detallePedidoController.updateDetallePedido);
router.delete('/:id', detallePedidoController.deleteDetallePedido);

module.exports = router;