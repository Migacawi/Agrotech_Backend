require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const errorHandler = require("./middlewares/errorHandler");

// Importar rutas
const authRoutes = require("./routes/auth_routes");
const usuariosRoutes = require("./routes/usuarios_routes");
const productosRoutes = require("./routes/productos_routes");
const pedidosRoutes = require("./routes/pedidos_routes");
const detallePedidoRoutes = require("./routes/detallePedido_routes");
const pagosRoutes = require("./routes/pagos_routes");
const rolesRoutes = require("./routes/roles_routes");
const imagenesProductoRoutes = require("./routes/imagenesProducto_routes");

// Configuración de CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

// Middleware para JSON con límite aumentado
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/detallepedido", detallePedidoRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/imagenesproducto", imagenesProductoRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Agrotech Backend funcionando");
});

// Middleware de manejo de errores
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
