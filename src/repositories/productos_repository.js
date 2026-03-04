const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProductos = async () => prisma.productos.findMany({
    include: { Usuarios: true, DetallePedido: true, ImagenesProducto: true }
});

const getProductoById = async (id) => prisma.productos.findUnique({
    where: { Id: id },
    include: { Usuarios: true, DetallePedido: true, ImagenesProducto: true }
});

const createProducto = async (data) => prisma.productos.create({ data });
const updateProducto = async (id, data) => prisma.productos.update({ where: { Id: id }, data });
const deleteProducto = async (id) => prisma.productos.delete({ where: { Id: id } });

module.exports = { getAllProductos, getProductoById, createProducto, updateProducto, deleteProducto };