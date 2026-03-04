const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios_routes');
const errorHandler = require('./middlewares/error_middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});