const usuariosRepository = require('../repositories/usuarios_repository');
const bcrypt = require('bcrypt');

class UsuariosService {

  async getAll() {
    return await usuariosRepository.findAll();
  }

  async getById(id) {
    const user = await usuariosRepository.findById(id);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  async create(data) {

    const exists = await usuariosRepository.findByEmail(data.Email);
    if (exists) throw new Error('El email ya existe');

    const hashedPassword = await bcrypt.hash(data.PasswordHash, 10);

    return await usuariosRepository.create({
      ...data,
      PasswordHash: hashedPassword
    });
  }

  async update(id, data) {
    return await usuariosRepository.update(id, data);
  }

  async delete(id) {
    return await usuariosRepository.delete(id);
  }
}

module.exports = new UsuariosService();