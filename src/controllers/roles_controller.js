const rolesService = require('../services/roles_service');

const getRoles = async (req, res) => {
    try {
        const roles = await rolesService.listRoles();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRolById = async (req, res) => {
    try {
        const rol = await rolesService.getRol(parseInt(req.params.id));
        res.json(rol);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createRol = async (req, res) => {
    try {
        const rol = await rolesService.addRol(req.body);
        res.status(201).json(rol);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateRol = async (req, res) => {
    try {
        const rol = await rolesService.editRol(parseInt(req.params.id), req.body);
        res.json(rol);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteRol = async (req, res) => {
    try {
        await rolesService.removeRol(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getRoles, getRolById, createRol, updateRol, deleteRol };