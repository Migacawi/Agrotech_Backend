const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagos_controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/',    authMiddleware, pagosController.getPagos);
router.get('/:id', authMiddleware, pagosController.getPagoById);

// Procesar pago
router.post('/procesar', authMiddleware, pagosController.procesarPago);

// Confirmar pago en efectivo (solo admin)
router.put('/:id/confirmar-efectivo', authMiddleware, pagosController.confirmarEfectivo);

router.delete('/:id', authMiddleware, pagosController.deletePago);

module.exports = router;