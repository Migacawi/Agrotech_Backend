const prisma = require('../prisma/client');

class UsuariosRepository {

  async findAll() {
    return await prisma.Usuarios.findMany({
      include: { Roles: true }
    });
  }

  async findById(id) {
    return await prisma.Usuarios.findUnique({
      where: { Id: id },
      include: { Roles: true }
    });
  }

  async findByEmail(email) {
    return await prisma.Usuarios.findUnique({
      where: { Email: email }
    });
  }

  async create(data) {
    return await prisma.Usuarios.create({
      data
    });
  }

  async update(id, data) {
    return await prisma.Usuarios.update({
      where: { Id: id },
      data
    });
  }

  async delete(id) {
    return await prisma.Usuarios.delete({
      where: { Id: id }
    });
  }
}

module.exports = new UsuariosRepository();