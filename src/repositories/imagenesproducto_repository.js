const prisma = require('../prisma/client');
const { cloudinary } = require('../middlewares/uploadMiddleware');

const getAllImagenesProducto = async () =>
  prisma.imagenesProducto.findMany({ include: { Producto: true } });

const getImagenProductoById = async (id) =>
  prisma.imagenesProducto.findUnique({ where: { Id: id }, include: { Producto: true } });

const getImagenesByProductoId = async (productoId) =>
  prisma.imagenesProducto.findMany({
    where: { ProductoId: productoId },
    orderBy: { EsPrincipal: 'desc' }
  });

const createImagenProducto = async (productoId, files, yaExisten) => {
  return Promise.all(
    files.map((file, index) =>
      prisma.imagenesProducto.create({
        data: {
          ProductoId:  productoId,
          UrlImagen:   file.path,
          EsPrincipal: yaExisten === 0 && index === 0,
        },
      })
    )
  );
};

const deleteImagenProducto = async (id) => {
  const imagen = await prisma.imagenesProducto.findUnique({
    where: { Id: id },
    include: { Producto: true }
  });

  if (!imagen) return null;

  // Borrar de Cloudinary
  const urlParts = imagen.UrlImagen.split('/');
  const fileName = urlParts[urlParts.length - 1].split('.')[0];
  await cloudinary.uploader.destroy(`agrotech/productos/${fileName}`);

  return prisma.imagenesProducto.delete({ where: { Id: id } });
};

const marcarComoPrincipal = async (id, productoId) => {
  await prisma.imagenesProducto.updateMany({
    where: { ProductoId: productoId },
    data:  { EsPrincipal: false }
  });

  return prisma.imagenesProducto.update({
    where: { Id: id },
    data:  { EsPrincipal: true }
  });
};

module.exports = {
  getAllImagenesProducto,
  getImagenProductoById,
  getImagenesByProductoId,
  createImagenProducto,
  deleteImagenProducto,
  marcarComoPrincipal,
};