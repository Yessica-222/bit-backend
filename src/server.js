import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// Importamos las rutas
import usersRouter from './routes/users.js';
import productsRouter from "./routes/products.js";
import cartRouter from './routes/cart.js';
import appointmentRouter from './routes/appointment.js';
import serviceRouter from './routes/service.js';
import invoiceRouter from './routes/invoice.js';
import paymentRouter from './routes/payment.js';

dotenv.config(); // Cargar variables de entorno
const server = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

// Middlewares globales
server.use(express.json()); // Permite leer JSON en las peticiones
server.use(morgan('dev')); // Logger de peticiones HTTP
server.use(cors({
  origin: '*'
}));

// Definición de rutas principales
server.use('/api/users', usersRouter);
server.use('/api/products', productsRouter);
server.use('/api/cart', cartRouter);
server.use('/api/appointment', appointmentRouter);
server.use('/api/services', serviceRouter);
server.use('/api/invoices', invoiceRouter);
server.use('/api/payment', paymentRouter);

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' Conectado a MongoDB');
    server.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
  })
