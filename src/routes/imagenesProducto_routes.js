const router = require('express').Router();
const { upload } = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const {
  subirImagenes,
  eliminarImagen,
  marcarComoPrincipal,
  obtenerImagenesProducto
} = require('../controllers/imagenesproducto_controller');

router.get('/producto/:productoId', obtenerImagenesProducto);

router.post(
  '/:productoId/subir',
  authMiddleware,
  roleMiddleware(['admin', 'vendedor']),
  (req, res, next) => {
    req.params.id = req.params.productoId;
    next();
  },
  ownerMiddleware,
  upload.array('imagenes', 5),
  subirImagenes
);

router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'vendedor']), eliminarImagen);
router.put('/:id/principal', authMiddleware, roleMiddleware(['admin', 'vendedor']), marcarComoPrincipal);

module.exports = router;