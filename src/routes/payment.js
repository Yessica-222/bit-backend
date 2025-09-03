import express from 'express';
import paymentController from '../controllers/payment.js';
import { auth, isAdmin } from '../middleware/auth.js';

const paymentRouter = express.Router();

// Crear un nuevo pago (solo usuario autenticado)
paymentRouter.post('/', auth, paymentController.createPayment);

// Listar todos los pagos (solo Admin)
paymentRouter.get('/', auth, isAdmin, paymentController.getAllPayments);

// Listar pagos de una factura específica (usuario autenticado)
paymentRouter.get('/invoice/:invoiceId', auth, paymentController.getPaymentsByInvoice);

// Actualizar estado de un pago (solo Admin)
paymentRouter.put('/:id', auth, isAdmin, paymentController.updatePaymentStatus);

// Eliminar un pago (solo Admin)
paymentRouter.delete('/:id', auth, isAdmin, paymentController.deletePayment);

export default paymentRouter;
