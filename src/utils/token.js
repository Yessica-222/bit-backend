import jwt from 'jsonwebtoken';

// Generar un token JWT para el usuario autenticado
export const getToken = (user) => {
  return jwt.sign(
    // Payload con información esencial del usuario
    { id: user._id, role: user.role, name: user.name },
    // Clave secreta definida en las variables de entorno
    process.env.SECRET_KEY,
    // Opciones del token (expira en 1 día)
    { expiresIn: '1d' }
  );
};
