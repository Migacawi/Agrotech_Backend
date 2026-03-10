require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const errorHandler = require('./middlewares/errorHandler');

const usuariosRoutes = require('./routes/usuarios_routes');
const productosRoutes = require('./routes/productos_routes');
const pedidosRoutes = require('./routes/pedidos_routes');
const detallePedidoRoutes = require('./routes/detallePedido_routes');
const pagosRoutes = require('./routes/pagos_routes');
const rolesRoutes = require('./routes/roles_routes');
const imagenesProductoRoutes = require('./routes/imagenesProducto_routes');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://congenial-telegram-pjq5gpjj6j75h94v5-5173.app.github.dev'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detallepedido', detallePedidoRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/imagenesproducto', imagenesProductoRoutes);

app.get('/', (req, res) => {
  res.send('Agrotech Backend funcionando 🚀');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});