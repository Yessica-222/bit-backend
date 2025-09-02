import mongoose from 'mongoose';

// Definición del esquema de pagos
const paymentSchema = new mongoose.Schema({
  // Relación con la factura asociada
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice', // Referencia al modelo de facturas
    required: true
  },

  // Método de pago utilizado
  method: {
    type: String,
    enum: ['Efecty', 'Bancolombia', 'Nequi', 'Daviplata'],
    required: true
  },

  // Monto pagado
  amount: {
    type: Number,
    required: true
  },

  // Estado del pago
  status: {
    type: String,
    enum: ['pendiente', 'completado', 'fallido'],
    default: 'pendiente'
  },

  // Fecha de creación del registro
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Exportamos el modelo
const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
