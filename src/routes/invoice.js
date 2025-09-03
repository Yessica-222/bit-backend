import express from 'express';
import invoiceController from '../controllers/invoice.js';
import { auth, isAdmin } from '../middleware/auth.js';

const invoiceRouter = express.Router();

// Rutas para USUARIOS: crear y ver solo sus propias facturas
invoiceRouter.post('/mine', auth, invoiceController.createInvoiceUser);
invoiceRouter.get('/mine', auth, invoiceController.getUserInvoices);

// Rutas para ADMIN: CRUD completo sobre facturas
invoiceRouter.post('/', auth, isAdmin, invoiceController.createInvoice);
invoiceRouter.get('/', auth, isAdmin, invoiceController.getAllInvoices);
invoiceRouter.put('/:id', auth, isAdmin, invoiceController.updateInvoice);
invoiceRouter.delete('/:id', auth, isAdmin, invoiceController.deleteInvoice);

export default invoiceRouter;
