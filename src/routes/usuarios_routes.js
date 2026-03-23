const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios_controller");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

router.post("/login", usuariosController.loginUsuario);

router.get("/", usuariosController.getUsuarios);
router.get("/:id", usuariosController.getUsuarioById);
router.post("/", usuariosController.createUsuario);
router.put("/:id", usuariosController.updateUsuario);
router.delete("/:id", usuariosController.deleteUsuario);

// ← nuevo endpoint para subir foto de perfil
router.put(
  "/:id/foto",
  authMiddleware,
  upload.single("foto"),
  usuariosController.updateFotoUsuario,
);

module.exports = router;
