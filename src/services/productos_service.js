const productosRepo = require('../repositories/productos_repository');

const listProductos = async () => await productosRepo.getAllProductos();
const getProducto = async (id) => await productosRepo.getProductoById(id);
const addProducto = async (data) => await productosRepo.createProducto(data);
const editProducto = async (id, data) => await productosRepo.updateProducto(id, data);
const removeProducto = async (id) => await productosRepo.deleteProducto(id);

module.exports = { listProductos, getProducto, addProducto, editProducto, removeProducto };