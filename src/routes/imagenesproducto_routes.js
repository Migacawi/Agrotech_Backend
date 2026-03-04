const express = require('express');
const router = express.Router();
const imagenesProductoController = require('../controllers/imagenesproducto_controller');

router.get('/', imagenesProductoController.getImagenesProductos);
router.get('/:id', imagenesProductoController.getImagenProductoById);
router.post('/', imagenesProductoController.createImagenProducto);
router.put('/:id', imagenesProductoController.updateImagenProducto);
router.delete('/:id', imagenesProductoController.deleteImagenProducto);

module.exports = router;