const usuariosRepo = require('../repositories/usuarios_repository');

const listUsuarios = async () => await usuariosRepo.listUsuarios();
const getUsuario = async (id) => await usuariosRepo.getUsuario(id);
const addUsuario = async (data) => await usuariosRepo.createUsuario(data);
const editUsuario = async (id, data) => await usuariosRepo.updateUsuario(id, data);
const removeUsuario = async (id) => await usuariosRepo.deleteUsuario(id);

module.exports = {
    listUsuarios,
    getUsuario,
    addUsuario,
    editUsuario,
    removeUsuario
};