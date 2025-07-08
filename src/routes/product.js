import { Router } from 'express';
import ProductsController from '../controllers/product.js';

const productsRouter = Router();

productsRouter.post('/', ProductsController.create);
productsRouter.get('/', ProductsController.readAll);
productsRouter.get('/:id', ProductsController.readOne);
productsRouter.put('/:id', ProductsController.update);
productsRouter.delete('/:id', ProductsController.delete);

export default productsRouter;
