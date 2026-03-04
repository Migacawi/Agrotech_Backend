const productosService = require('../services/productos_service');

const getProductos = async (req, res) => {
    try {
        const productos = await productosService.listProductos();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductoById = async (req, res) => {
    try {
        const producto = await productosService.getProducto(parseInt(req.params.id));
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProducto = async (req, res) => {
    try {
        const producto = await productosService.addProducto(req.body);
        res.status(201).json(producto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProducto = async (req, res) => {
    try {
        const producto = await productosService.editProducto(parseInt(req.params.id), req.body);
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        await productosService.removeProducto(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };