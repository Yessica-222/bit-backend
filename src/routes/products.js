import express from 'express';
import ProductsController from '../controllers/products.js';
import { auth } from '../middleware/auth.js';

const productsRouter = express.Router();

// Crear un nuevo producto (requiere autenticación)
productsRouter.post('/', auth, ProductsController.createProduct);

// Obtener todos los productos (acceso público)
productsRouter.get('/', ProductsController.getAllProducts);

// Obtener un producto por ID (acceso público)
productsRouter.get('/:id', ProductsController.getProductById);

// Actualizar un producto por ID (requiere autenticación)
productsRouter.put('/:id', auth, ProductsController.updateProduct);

// Eliminar un producto por ID (requiere autenticación)
productsRouter.delete('/:id', auth, ProductsController.deleteProduct);

export default productsRouter;
