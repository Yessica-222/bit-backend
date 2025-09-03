import jwt from 'jsonwebtoken';

// Middleware de autenticación con JWT
export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Busca el token en los headers
  if (!token) return res.status(401).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verifica el token
    req.user = decoded; // Guarda los datos del usuario en la request
    next(); // Continúa con la ejecución
  } catch {
    return res.status(403).json({ message: "Token inválido" });
  }
};

// Middleware para restringir acceso a administradores
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administradores' });
  }
  next();
};

// Middleware para restringir acceso a usuarios con rol 'user'
export const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Solo usuarios con rol user pueden acceder' });
  }
  next();
};
