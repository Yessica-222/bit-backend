import express from 'express';
import cartController from '../controllers/cart.js';
import { auth, isUser } from '../middleware/auth.js'; // Importa también isUser

const cartRouter = express.Router();

// Middleware global: primero valida el token con `auth` y luego verifica que el rol sea 'user'
cartRouter.use(auth, isUser);

// CRUD del carrito (solo accesible para usuarios autenticados con rol 'user')
cartRouter.post('/', cartController.addToCart);        // Agregar producto al carrito
cartRouter.get('/', cartController.getCart);           // Obtener productos del carrito
cartRouter.get('/total', cartController.getTotal);     // Calcular total del carrito
cartRouter.put('/:id_cart', cartController.updateQuantity); // Actualizar cantidad de un producto
cartRouter.delete('/:id_cart', cartController.removeFromCart); // Eliminar producto del carrito

export default cartRouter;
