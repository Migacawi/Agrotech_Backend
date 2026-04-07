const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos_controller');
const authMiddleware    = require('../middlewares/authMiddleware');
const roleMiddleware    = require('../middlewares/roleMiddleware');

// Solo admin puede ver todos los pedidos
router.get('/',    authMiddleware, roleMiddleware(['administrador']), pedidosController.getPedidos);

// Ver un pedido por id (autenticado — el controller puede filtrar por dueño si se desea)
router.get('/:id', authMiddleware, pedidosController.getPedidoById);

// Crear pedido (cualquier usuario autenticado)
router.post('/',   authMiddleware, pedidosController.createPedido);

// Actualizar estado del pedido (solo admin)
router.put('/:id', authMiddleware, roleMiddleware(['administrador']), pedidosController.updatePedido);

// Eliminar pedido (solo admin)
router.delete('/:id', authMiddleware, roleMiddleware(['administrador']), pedidosController.deletePedido);

module.exports = router;