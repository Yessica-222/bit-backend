import { Router } from 'express';
import UsersController from '../controllers/users.js';
import { auth, isAdmin } from '../middleware/auth.js';

const usersRouter = Router();

// Registro de usuario
usersRouter.post('/sign-up', UsersController.register);

// Inicio de sesión
usersRouter.post('/sign-in', UsersController.login);

// Listar todos los usuarios (solo datos básicos)
usersRouter.get('/', UsersController.list);

// Obtener perfil del usuario autenticado
usersRouter.get('/profile', auth, UsersController.profile);

// Actualizar perfil del usuario autenticado
usersRouter.put('/profile', auth, UsersController.updateProfile);

// Ruta solo para administradores (requiere middleware isAdmin)
usersRouter.get('/admin-panel', auth, isAdmin, (req, res) => {
  res.json({ message: `Hola Admin ${req.user.name}` });
});

export default usersRouter;
