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
  roleMiddleware(['administrador', 'vendedor']),
  (req, res, next) => {
    const rol = req.user?.rol?.toLowerCase();
    if (rol === 'administrador') return next();
    req.params.id = req.params.productoId;
    ownerMiddleware(req, res, next);
  },
  upload.array('imagenes', 5),
  subirImagenes
);

router.delete('/:id', authMiddleware, roleMiddleware(['administrador', 'vendedor']), eliminarImagen);
router.put('/:id/principal', authMiddleware, roleMiddleware(['administrador', 'vendedor']), marcarComoPrincipal);

module.exports = router;