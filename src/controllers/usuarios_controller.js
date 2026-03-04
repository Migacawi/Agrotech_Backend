const usuariosService = require('../services/usuarios_service');

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosService.listUsuarios();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const usuario = await usuariosService.getUsuario(parseInt(req.params.id));
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createUsuario = async (req, res) => {
    try {
        const usuario = await usuariosService.addUsuario(req.body);
        res.status(201).json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const usuario = await usuariosService.editUsuario(parseInt(req.params.id), req.body);
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        await usuariosService.removeUsuario(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};