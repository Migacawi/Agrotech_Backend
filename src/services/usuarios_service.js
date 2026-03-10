const usuariosRepo = require('../repositories/usuarios_repository');

const listUsuarios = async () => await usuariosRepo.listUsuarios();

const getUsuario = async (id) => await usuariosRepo.getUsuario(id);

const addUsuario = async (data) => await usuariosRepo.createUsuario(data);

const editUsuario = async (id, data) => await usuariosRepo.editUsuario(id, data);

const removeUsuario = async (id) => await usuariosRepo.removeUsuario(id);

// NUEVA FUNCIÓN PARA LOGIN
const getUsuarioByEmail = async (email) => 
    await usuariosRepo.getUsuarioByEmail(email);

module.exports = {
    listUsuarios,
    getUsuario,
    addUsuario,
    editUsuario,
    removeUsuario,
    getUsuarioByEmail
};