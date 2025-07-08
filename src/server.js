import 'dotenv/config';
import connectDB from './config/db.js';
import express from 'express';
import morgan from 'morgan';
import productsRouter from './routes/product.js';
const server = express();
const host = process.env.HOST;
const port = process.env.PORT;

connectDB();

server.use(express.json());
server.use(morgan('dev'));

// Rutas
server.use('/api/products', productsRouter);

server.listen(port, () => {
  console.log(`Server is running at ${host} on port ${port}`);
});