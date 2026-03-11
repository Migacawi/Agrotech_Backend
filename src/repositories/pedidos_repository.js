const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProductos = async () =>
  prisma.productos.findMany({
    include: {
      Usuario: true,
      Detalles: true,
      Imagenes: true
    }
  });

const getProductoById = async (id) =>
  prisma.productos.findUnique({
    where: { Id: parseInt(id) }, // Conversión segura
    include: {
      Usuario: true,
      Detalles: true,
      Imagenes: true
    }
  });

const createProducto = async (data) =>
  prisma.productos.create({ data });

const updateProducto = async (id, data) =>
  prisma.productos.update({
    where: { Id: parseInt(id) },
    data
  });

const deleteProducto = async (id) =>
  prisma.productos.delete({
    where: { Id: parseInt(id) }
  });

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};