const usuariosService = require("../services/usuarios_service");
const {
  validateCreateUsuario,
  validateUpdateUsuario,
} = require("../validators/usuarios_validator");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../middlewares/uploadMiddleware");
const prisma = require("../prisma/client");

function mapErrorToResponse(err) {
  if (err.code === "P2002") {
    return { status: 409, message: "Ya existe un usuario con ese email." };
  }
  if (err.code === "P2003") {
    return {
      status: 400,
      message:
        "El rol indicado no existe. Crea primero el rol o usa un RolId/RolNombre válido.",
    };
  }
  if (err.code === "P2025") {
    return { status: 404, message: "Registro no encontrado." };
  }
  return { status: 500, message: err.message || "Error interno del servidor." };
}

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.listUsuarios();
    res.json(usuarios);
  } catch (err) {
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ error: message });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuariosService.getUsuario(parseInt(req.params.id));
    res.json(usuario);
  } catch (err) {
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ error: message });
  }
};

const createUsuario = async (req, res) => {
  try {
    const result = validateCreateUsuario(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((e) => e.message).join(". ");
      return res
        .status(400)
        .json({ error: "Datos inválidos", detalles: messages });
    }
    const usuario = await usuariosService.addUsuario(result.data);
    res.status(201).json(usuario);
  } catch (err) {
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ error: message });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const result = validateUpdateUsuario(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((e) => e.message).join(". ");
      return res
        .status(400)
        .json({ error: "Datos inválidos", detalles: messages });
    }
    const usuario = await usuariosService.editUsuario(
      parseInt(req.params.id),
      result.data,
    );
    res.json(usuario);
  } catch (err) {
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ error: message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    await usuariosService.removeUsuario(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ error: message });
  }
};

/* LOGIN */
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await usuariosService.getUsuarioByEmail(email);

    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    if (usuario.PasswordHash !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuario.Id,
        email: usuario.Email,
        rol: usuario.Rol.Nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ error: message });
  }
};

/* SUBIR FOTO DE PERFIL */
const updateFotoUsuario = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ninguna imagen" });
    }

    // Cloudinary ya subió la imagen — req.file.path tiene la URL
    const fotoUrl = req.file.path;

    const usuario = await prisma.usuarios.update({
      where: { Id: parseInt(req.params.id) },
      data: { FotoUrl: fotoUrl },
    });

    res.json({
      message: "Foto actualizada correctamente",
      FotoUrl: usuario.FotoUrl,
    });
  } catch (err) {
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ error: message });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  updateFotoUsuario,
};
