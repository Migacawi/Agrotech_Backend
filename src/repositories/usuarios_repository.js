const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listUsuarios = () => prisma.usuarios.findMany();

const getUsuario = (id) => prisma.usuarios.findUnique({
  where: { id: id },
  include: { Roles: true, Pedidos: true, Productos: true }
});

const createUsuario = (data) => prisma.usuarios.create({
  data: data,
  include: { Roles: true, Pedidos: true, Productos: true }
});

const editUsuario = (id, data) => prisma.usuarios.update({
  where: { id: id },
  data: data,
  include: { Roles: true, Pedidos: true, Productos: true }
});

const removeUsuario = (id) => prisma.usuarios.delete({
  where: { id: id }
});

module.exports = {
  listUsuarios,
  getUsuario,
  createUsuario,
  editUsuario,
  removeUsuario
};