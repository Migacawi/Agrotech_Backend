const { z } = require('zod');

const createUsuarioSchema = z.object({
  Nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(7, 'El nombre debe tener al menos 7 caracteres')
    .max(13, 'El nombre no puede tener más de 13 caracteres'),
  Email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('Debe ser un email válido')
    .max(100, 'El email es demasiado largo'),
  PasswordHash: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(255, 'La contraseña es demasiado larga'),
  RolId: z.coerce.number().int().positive('RolId debe ser un número entero positivo').optional(),
  RolNombre: z.string().min(1, 'RolNombre no puede estar vacío').optional()
}).refine(
  (data) => data.RolId != null || (data.RolNombre != null && data.RolNombre.trim() !== ''),
  { message: 'Debes indicar RolId o RolNombre', path: ['RolId'] }
);

const updateUsuarioSchema = z.object({
  Nombre: z
    .string()
    .min(7, 'El nombre debe tener al menos 7 caracteres')
    .max(13, 'El nombre no puede tener más de 13 caracteres')
    .optional(),
  Email: z
    .string()
    .email('Debe ser un email válido')
    .max(100, 'El email es demasiado largo')
    .optional(),
  PasswordHash: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(255, 'La contraseña es demasiado larga')
    .optional(),
  RolId: z.coerce.number().int().positive('RolId debe ser un número entero positivo').optional(),
  RolNombre: z.string().min(1, 'RolNombre no puede estar vacío').optional()
});

function validateCreateUsuario(data) {
  return createUsuarioSchema.safeParse(data);
}

function validateUpdateUsuario(data) {
  return updateUsuarioSchema.safeParse(data);
}

module.exports = {
  validateCreateUsuario,
  validateUpdateUsuario
};
