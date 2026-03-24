const productosService = require('../services/productos_service');

const getProductos = async (req, res) => {
    try {
        const productos = await productosService.listProductos();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductoById = async (req, res) => {
    try {
        const producto = await productosService.getProducto(parseInt(req.params.id));
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProducto = async (req, res) => {
    try {
        // 1. Extraemos con los nombres exactos del req.body (f minúscula según tu HTML)
        const { Nombre, Categoria, PrecioPorLibra, StockLibras, fechaCosecha, Descripcion } = req.body;

        // 2. Validaciones de presencia
        if (!Nombre || !Categoria || !PrecioPorLibra || !StockLibras) {
            return res.status(400).json({ error: 'Nombre, Categoría, Precio y Stock son obligatorios.' });
        }

        if (!fechaCosecha) {
            return res.status(400).json({ error: 'La fecha de cosecha es obligatoria.' });
        }

        // 3. Validación de lógica de fecha
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const fechaObj = new Date(fechaCosecha);
        
        // Validar si la fecha es un formato válido
        if (isNaN(fechaObj.getTime())) {
            return res.status(400).json({ error: 'El formato de la fecha de cosecha no es válido.' });
        }

        if (fechaObj > hoy) {
            return res.status(400).json({ error: 'La fecha de cosecha no puede ser mayor a hoy.' });
        }

        // 4. Construcción del objeto DATA limpio para Prisma
        // IMPORTANTE: Asegúrate de que 'FechaCosecha' esté en tu schema.prisma
        const data = {
            Nombre: Nombre,
            Descripcion: Descripcion || "",
            Categoria: Categoria,
            PrecioPorLibra: parseFloat(PrecioPorLibra),
            StockLibras: parseFloat(StockLibras),
            VendedorId: req.user.id,
            // Si tu modelo en Prisma usa FechaCosecha (con F mayúscula), asígnalo aquí:
            // FechaCosecha: fechaObj 
        };

        const producto = await productosService.addProducto(data);
        res.status(201).json(producto);

    } catch (err) {
        console.error("Error en createProducto:", err);
        res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
    }
};

const updateProducto = async (req, res) => {
    try {
        const producto = await productosService.editProducto(parseInt(req.params.id), req.body);
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        await productosService.removeProducto(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };