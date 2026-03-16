const router = require('express').Router();
const { upload } = require('../middlewares/upload.middleware'); // ← aquí el cambio
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const {
  subirImagenes,
  eliminarImagen,
  marcarComoPrincipal,
  obtenerImagenesProducto
} = require('../controllers/imagenesProducto_controller');

router.get('/producto/:productoId', obtenerImagenesProducto);

router.post(
  '/:productoId/subir',
  authMiddleware,
  roleMiddleware('vendedor'),
  (req, res, next) => {
    req.params.id = req.params.productoId;
    next();
  },
  ownerMiddleware,
  upload.array('imagenes', 5),
  subirImagenes
);

router.delete('/:id', authMiddleware, roleMiddleware('vendedor'), eliminarImagen);
router.put('/:id/principal', authMiddleware, roleMiddleware('vendedor'), marcarComoPrincipal);

module.exports = router;