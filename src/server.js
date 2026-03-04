const express = require('express');
const cors = require('cors');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios_routes');
const productosRoutes = require('./routes/productos_routes');
const pedidosRoutes = require('./routes/pedidos_routes');
const detallePedidoRoutes = require('./routes/detallepedido_routes');
const pagosRoutes = require('./routes/pagos_routes');
const rolesRoutes = require('./routes/roles_routes');
const imagenesProductoRoutes = require('./routes/imagenesproducto_routes');

// Middleware de errores
const errorHandler = require('./middlewares/error_middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detallepedido', detallePedidoRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/imagenesproducto', imagenesProductoRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});