const express = require("express");
const router  = express.Router();

const {
  login,
  loginGoogle,
  solicitarCodigo,
  verificarCodigo,
  cambiarPassword,
} = require("../controllers/auth_controller");

router.post("/login",            login);
router.post("/google",           loginGoogle);
router.post("/recuperar",        solicitarCodigo);
router.post("/verificar-codigo", verificarCodigo);
router.post("/cambiar-password", cambiarPassword);

module.exports = router;