const usuariosService = require("../services/usuarios_service");
const bcrypt = require("bcrypt");
const {
  validateCreateUsuario,
  validateUpdateUsuario,
} = require("../validators/usuarios_validator");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../middlewares/uploadMiddleware");
const prisma = require("../prisma/client");
const { enviarBienvenida } = require("../utils/mailer");

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

    const data = { ...result.data };
    data.PasswordHash = await bcrypt.hash(data.PasswordHash, 10);

    const usuario = await usuariosService.addUsuario(data);

    // Email de bienvenida — fire and forget (no bloquea la respuesta)
    enviarBienvenida(usuario.Email, usuario.Nombre).catch(() => {});

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

    const data = { ...result.data };

    // Si viene nueva contraseña, verificar la actual primero
    if (data.PasswordHash) {
      if (!data.PasswordActual) {
        return res.status(400).json({ error: "Debes enviar la contraseña actual para cambiarla." });
      }
      // Obtener el usuario actual para comparar
      const usuarioActual = await prisma.usuarios.findUnique({
        where: { Id: parseInt(req.params.id) },
      });
      const coincide = await bcrypt.compare(data.PasswordActual, usuarioActual.PasswordHash);
      if (!coincide) {
        return res.status(401).json({ error: "La contraseña actual es incorrecta." });
      }
      data.PasswordHash = await bcrypt.hash(data.PasswordHash, 10);
    }
    // Quitar PasswordActual del payload antes de actualizar
    delete data.PasswordActual;

    const usuario = await usuariosService.editUsuario(
      parseInt(req.params.id),
      data,
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

    if (usuario.PasswordHash !== "GOOGLE_AUTH") {
      const passwordValida = await bcrypt.compare(password, usuario.PasswordHash);
      if (!passwordValida) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }
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
