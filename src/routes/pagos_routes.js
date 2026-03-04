const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagos_controller');

router.get('/', pagosController.getPagos);
router.get('/:id', pagosController.getPagoById);
router.post('/', pagosController.createPago);
router.put('/:id', pagosController.updatePago);
router.delete('/:id', pagosController.deletePago);

module.exports = router;