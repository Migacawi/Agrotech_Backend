const express = require('express');
const router = express.Router();

const productosController = require('../controllers/productos_controller');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');

// ----------------------
// Rutas públicas
// ----------------------

// ver todos los productos
router.get('/', productosController.getProductos);

// ver producto por id
router.get('/:id', productosController.getProductoById);


// ----------------------
// Rutas protegidas
// ----------------------

// crear producto (usuario autenticado)
router.post(
  '/',
  authMiddleware,
  productosController.createProducto
);

// editar producto (solo el dueño del producto)
router.put(
  '/:id',
  authMiddleware,
  ownerMiddleware,
  productosController.updateProducto
);

// eliminar producto (solo admin)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  productosController.deleteProducto
);

module.exports = router;