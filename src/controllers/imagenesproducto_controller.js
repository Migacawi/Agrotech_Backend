const repo = require('../repositories/imagenesproducto_repository');

const getAll = async (req, res, next) => {
  try {
    const imagenes = await repo.getAllImagenesProducto();
    res.json(imagenes);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const imagen = await repo.getImagenProductoById(Number(req.params.id));
    if (!imagen) return res.status(404).json({ message: 'Imagen no encontrada' });
    res.json(imagen);
  } catch (error) { next(error); }
};

const getByProducto = async (req, res, next) => {
  try {
    const imagenes = await repo.getImagenesByProductoId(Number(req.params.productoId));
    res.json(imagenes);
  } catch (error) { next(error); }
};

const subirImagenes = async (req, res, next) => {
  const productoId = Number(req.params.productoId);

  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: 'No se enviaron imágenes' });

  try {
    const yaExisten = await repo.getImagenesByProductoId(productoId);
    const imagenes = await repo.createImagenProducto(productoId, req.files, yaExisten.length);
    res.status(201).json({ message: 'Imágenes subidas correctamente', imagenes });
  } catch (error) { next(error); }
};

const eliminarImagen = async (req, res, next) => {
  try {
    const imagen = await repo.getImagenProductoById(Number(req.params.id));
    if (!imagen) return res.status(404).json({ message: 'Imagen no encontrada' });

    if (imagen.Producto.VendedorId !== req.user.id)
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta imagen' });

    await repo.deleteImagenProducto(Number(req.params.id));
    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) { next(error); }
};

const setPrincipal = async (req, res, next) => {
  try {
    const imagen = await repo.getImagenProductoById(Number(req.params.id));
    if (!imagen) return res.status(404).json({ message: 'Imagen no encontrada' });

    if (imagen.Producto.VendedorId !== req.user.id)
      return res.status(403).json({ message: 'No tienes permiso' });

    const actualizada = await repo.marcarComoPrincipal(Number(req.params.id), imagen.ProductoId);
    res.json({ message: 'Imagen marcada como principal', imagen: actualizada });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, obtenerImagenesProducto: getByProducto, subirImagenes, eliminarImagen, marcarComoPrincipal: setPrincipal };