const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllImagenesProducto = async () => prisma.imagenesProducto.findMany({ include: { Productos: true } });
const getImagenProductoById = async (id) => prisma.imagenesProducto.findUnique({ where: { Id: id }, include: { Productos: true } });
const createImagenProducto = async (data) => prisma.imagenesProducto.create({ data });
const updateImagenProducto = async (id, data) => prisma.imagenesProducto.update({ where: { Id: id }, data });
const deleteImagenProducto = async (id) => prisma.imagenesProducto.delete({ where: { Id: id } });

module.exports = { getAllImagenesProducto, getImagenProductoById, createImagenProducto, updateImagenProducto, deleteImagenProducto };