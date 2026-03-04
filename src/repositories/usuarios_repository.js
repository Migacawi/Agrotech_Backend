const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsuarios = async () => prisma.usuarios.findMany({
    include: { Roles: true, Pedidos: true, Productos: true }
});

const getUsuarioById = async (id) => prisma.usuarios.findUnique({
    where: { Id: id },
    include: { Roles: true, Pedidos: true, Productos: true }
});

const createUsuario = async (data) => prisma.usuarios.create({ data });

const updateUsuario = async (id, data) => prisma.usuarios.update({
    where: { Id: id },
    data
});

const deleteUsuario = async (id) => prisma.usuarios.delete({ where: { Id: id } });

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};