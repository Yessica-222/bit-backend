import mongoose from 'mongoose';

// Definición del esquema de facturas
const invoiceSchema = new mongoose.Schema({
  // Usuario al que pertenece la factura
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relación con el modelo User
    required: true
  },

  // Lista de productos incluidos en la factura
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Relación con el modelo Product
      required: true
    },
    quantity: { 
      type: Number, 
      required: true 
    }
  }],

  // Total a pagar por la factura
  total: {
    type: Number,
    required: true
  },

  // Método de pago utilizado
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'transfer', 'card', 'nequi', 'efecty', 'bancolombia'] // Opciones permitidas
  },

  // Estado de la factura
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'paid', 'canceled', 'shipped']
  },

  // Fecha de creación
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Exportamos el modelo
const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
