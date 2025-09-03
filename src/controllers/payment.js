import Payment from '../models/payment.js';

const paymentController = {
  // Crear pago
  createPayment: async (req, res) => {
    try {
      const { invoiceId, method, amount } = req.body;

      const newPayment = new Payment({ invoiceId, method, amount });
      const savedPayment = await newPayment.save();

      res.status(201).json(savedPayment);
    } catch (error) {
      res.status(500).json({ message: 'Error creando pago', error });
    }
  },

  // Listar todos los pagos (solo admin)
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.find()
        .populate('invoiceId', 'total createdAt');

      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pagos', error });
    }
  },

  // Obtener pagos por factura (usuario autenticado)
  getPaymentsByInvoice: async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const payments = await Payment.find({ invoiceId });

      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pagos de la factura', error });
    }
  },

  // Actualizar estado del pago (admin)
  updatePaymentStatus: async (req, res) => {
    try {
      const paymentId = req.params.id;
      const updated = await Payment.findByIdAndUpdate(
        paymentId,
        { status: req.body.status },
        { new: true }
      );

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado del pago', error });
    }
  },

  // Eliminar pago (admin)
  deletePayment: async (req, res) => {
    try {
      const paymentId = req.params.id;
      await Payment.findByIdAndDelete(paymentId);

      res.status(200).json({ message: 'Pago eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar pago', error });
    }
  }
};

export default paymentController;
