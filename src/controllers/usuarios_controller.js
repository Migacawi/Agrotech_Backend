const usuariosService = require('../services/usuarios_service');
const { validateCreateUsuario, validateUpdateUsuario } = require('../validators/usuarios_validator');

function mapErrorToResponse(err) {
    if (err.code === 'P2002') {
        return { status: 409, message: 'Ya existe un usuario con ese email.' };
    }
    if (err.code === 'P2003') {
        return { status: 400, message: 'El rol indicado no existe. Crea primero el rol o usa un RolId/RolNombre válido.' };
    }
    if (err.code === 'P2025') {
        return { status: 404, message: 'Registro no encontrado.' };
    }
    return { status: 500, message: err.message || 'Error interno del servidor.' };
}

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosService.listUsuarios();
        res.json(usuarios);
    } catch (err) {
        const { status, message } = mapErrorToResponse(err);
        res.status(status).json({ error: message });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const usuario = await usuariosService.getUsuario(parseInt(req.params.id));
        res.json(usuario);
    } catch (err) {
        const { status, message } = mapErrorToResponse(err);
        res.status(status).json({ error: message });
    }
};

const createUsuario = async (req, res) => {
    try {
        const result = validateCreateUsuario(req.body);
        if (!result.success) {
            const messages = result.error.issues.map((e) => e.message).join('. ');
            return res.status(400).json({ error: 'Datos inválidos', detalles: messages });
        }
        const usuario = await usuariosService.addUsuario(result.data);
        res.status(201).json(usuario);
    } catch (err) {
        const { status, message } = mapErrorToResponse(err);
        res.status(status).json({ error: message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const result = validateUpdateUsuario(req.body);
        if (!result.success) {
            const messages = result.error.issues.map((e) => e.message).join('. ');
            return res.status(400).json({ error: 'Datos inválidos', detalles: messages });
        }
        const usuario = await usuariosService.editUsuario(parseInt(req.params.id), result.data);
        res.json(usuario);
    } catch (err) {
        const { status, message } = mapErrorToResponse(err);
        res.status(status).json({ error: message });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        await usuariosService.removeUsuario(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        const { status, message } = mapErrorToResponse(err);
        res.status(status).json({ error: message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};