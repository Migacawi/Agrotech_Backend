const express = require('express');
const app = express(); // <-- esto faltaba
const errorHandler = require('./middlewares/errorHandler');

// Importar tus rutas
const usuariosRoutes = require('./routes/usuarios_routes');
const productosRoutes = require('./routes/productos_routes');
const pedidosRoutes = require('./routes/pedidos_routes');
const detallePedidoRoutes = require('./routes/detallePedido_routes');
const pagosRoutes = require('./routes/pagos_routes');
const rolesRoutes = require('./routes/roles_routes');
const imagenesProductoRoutes = require('./routes/imagenesProducto_routes');

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detallepedido', detallePedidoRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/imagenesproducto', imagenesProductoRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Agrotech Backend funcionando 🚀');
});

// Middleware de manejo de errores
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});