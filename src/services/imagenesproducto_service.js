const imagenesProductoRepo = require('../repositories/imagenesproducto_repository');

const listImagenesProducto = async () => await imagenesProductoRepo.getAllImagenesProducto();
const getImagenProducto = async (id) => await imagenesProductoRepo.getImagenProductoById(id);
const addImagenProducto = async (data) => await imagenesProductoRepo.createImagenProducto(data);
const editImagenProducto = async (id, data) => await imagenesProductoRepo.updateImagenProducto(id, data);
const removeImagenProducto = async (id) => await imagenesProductoRepo.deleteImagenProducto(id);

module.exports = { listImagenesProducto, getImagenProducto, addImagenProducto, editImagenProducto, removeImagenProducto };