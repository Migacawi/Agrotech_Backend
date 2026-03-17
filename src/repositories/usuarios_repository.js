const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listUsuarios = () => prisma.usuarios.findMany({
  include: { Rol: true, Pedidos: true, Productos: true }
});

const getUsuario = (id) => prisma.usuarios.findUnique({
  where: { Id: id },
  include: { Rol: true, Pedidos: true, Productos: true }
});

const createUsuario = (data) => {
  const rolId = data.RolId ?? data.rolId;
  const rolNombre = data.RolNombre ?? data.rolNombre;

  const rolConnect =
    rolNombre != null && String(rolNombre).trim() !== ''
      ? { connect: { Nombre: rolNombre } }
      : rolId != null
        ? { connect: { Id: Number(rolId) } }
        : null;

  if (!rolConnect) {
    throw new Error('Debes indicar RolId o RolNombre para el rol del usuario.');
  }

  return prisma.usuarios.create({
    data: {
      Nombre: data.Nombre,
      Email: data.Email,
      PasswordHash: data.PasswordHash,
      Rol: rolConnect
    },
    include: { Rol: true, Pedidos: true, Productos: true }
  });
};

const editUsuario = (id, data) => {
  const updateData = { ...data };

  const rolId = data.RolId ?? data.rolId;
  const rolNombre = data.RolNombre ?? data.rolNombre;

  delete updateData.RolNombre;
  delete updateData.rolNombre;
  delete updateData.RolId;
  delete updateData.rolId;

  if (rolNombre != null && String(rolNombre).trim() !== '') {
    updateData.Rol = { connect: { Nombre: rolNombre } };
  } else if (rolId != null) {
    updateData.RolId = Number(rolId);
  }

  return prisma.usuarios.update({
    where: { Id: id },
    data: updateData,
    include: { Rol: true, Pedidos: true, Productos: true }
  });
};

const removeUsuario = (id) => prisma.usuarios.delete({
  where: { Id: id }
});

// 🔐 FUNCIÓN PARA LOGIN
const getUsuarioByEmail = (email) => prisma.usuarios.findUnique({
  where: { Email: email },
  include: { Rol: true }
});

module.exports = {
  listUsuarios,
  getUsuario,
  createUsuario,
  editUsuario,
  removeUsuario,
  getUsuarioByEmail
};