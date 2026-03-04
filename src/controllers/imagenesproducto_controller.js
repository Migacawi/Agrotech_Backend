const imagenesProductoService = require('../services/imagenesproducto_service');

const getImagenesProductos = async (req, res) => {
    try {
        const imagenes = await imagenesProductoService.listImagenesProducto();
        res.json(imagenes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getImagenProductoById = async (req, res) => {
    try {
        const imagen = await imagenesProductoService.getImagenProducto(parseInt(req.params.id));
        res.json(imagen);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createImagenProducto = async (req, res) => {
    try {
        const imagen = await imagenesProductoService.addImagenProducto(req.body);
        res.status(201).json(imagen);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateImagenProducto = async (req, res) => {
    try {
        const imagen = await imagenesProductoService.editImagenProducto(parseInt(req.params.id), req.body);
        res.json(imagen);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteImagenProducto = async (req, res) => {
    try {
        await imagenesProductoService.removeImagenProducto(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getImagenesProductos, getImagenProductoById, createImagenProducto, updateImagenProducto, deleteImagenProducto };