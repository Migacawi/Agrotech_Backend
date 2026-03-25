const express = require("express");
const router  = express.Router();

const { login, loginGoogle } = require("../controllers/auth_controller");

router.post("/login",  login);
router.post("/google", loginGoogle);

module.exports = router;