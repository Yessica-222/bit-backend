import mongoose from 'mongoose';

// Esquema de citas para agendar servicios
const appointmentSchema = new mongoose.Schema({
  // Usuario que solicita la cita
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relación con el modelo User
    required: true
  },

  // Servicio solicitado en la cita
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Relación con el modelo Service
    required: true
  },

  // Fecha y hora de la cita
  appointmentDate: {
    type: Date,
    required: true
  },

  // Estado de la cita
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], // Estados posibles
    default: 'pending' // Por defecto inicia en pendiente
  }
}, { 
  // Agrega automáticamente createdAt y updatedAt
  timestamps: true 
});

// Exportamos el modelo
const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
