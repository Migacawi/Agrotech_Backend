const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios_controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

// ── Login (público) ───────────────────────────────────────────────────────────
router.post("/login", usuariosController.loginUsuario);

// ── Registro (público) ────────────────────────────────────────────────────────
router.post("/", usuariosController.createUsuario);

// ── Solo administrador puede ver todos los usuarios ───────────────────────────
router.get("/", authMiddleware, roleMiddleware(["administrador"]), usuariosController.getUsuarios);

// ── Ver un usuario (autenticado) ──────────────────────────────────────────────
router.get("/:id", authMiddleware, usuariosController.getUsuarioById);

// ── Editar usuario (autenticado — solo el propio usuario o admin) ─────────────
router.put("/:id", authMiddleware, usuariosController.updateUsuario);

// ── Eliminar usuario (solo administrador) ─────────────────────────────────────
router.delete("/:id", authMiddleware, roleMiddleware(["administrador"]), usuariosController.deleteUsuario);

// ── Subir foto de perfil (autenticado) ───────────────────────────────────────
router.put(
  "/:id/foto",
  authMiddleware,
  upload.single("foto"),
  usuariosController.updateFotoUsuario,
);

module.exports = router;
