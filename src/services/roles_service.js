const rolesRepo = require('../repositories/roles_repository');

const listRoles = async () => await rolesRepo.getAllRoles();
const getRol = async (id) => await rolesRepo.getRolById(id);
const addRol = async (data) => await rolesRepo.createRol(data);
const editRol = async (id, data) => await rolesRepo.updateRol(id, data);
const removeRol = async (id) => await rolesRepo.deleteRol(id);

module.exports = { listRoles, getRol, addRol, editRol, removeRol };