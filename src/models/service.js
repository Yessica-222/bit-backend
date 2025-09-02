import mongoose from 'mongoose';

// Definición del esquema para los servicios
const serviceSchema = new mongoose.Schema({
  // Nombre del servicio (ejemplo: Corte de cabello, Manicure, etc.)
  name: {
    type: String,
    required: true,
    trim: true // elimina espacios innecesarios al inicio y final
  },

  // Descripción opcional del servicio
  description: {
    type: String,
    trim: true
  },

  // Precio del servicio
  price: {
    type: Number,
    required: true // obligatorio
  },

  // Duración en minutos del servicio
  duration: {
    type: Number, // ejemplo: 30, 60
    required: true
  }
}, { timestamps: true });
// timestamps agrega automáticamente createdAt y updatedAt

// Exportamos el modelo
const Service = mongoose.model('Service', serviceSchema);
export default Service;
