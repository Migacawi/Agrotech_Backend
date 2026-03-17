const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllRoles = async () => prisma.roles.findMany({ include: { Usuarios: true } });
const getRolById = async (id) => prisma.roles.findUnique({ where: { Id: id }, include: { Usuarios: true } });
const createRol = async (data) => prisma.roles.create({ data });
const updateRol = async (id, data) => prisma.roles.update({ where: { Id: id }, data });
const deleteRol = async (id) => prisma.roles.delete({ where: { Id: id } });

module.exports = { getAllRoles, getRolById, createRol, updateRol, deleteRol };