// Importamos mongoose, la librería que nos permite interactuar con MongoDB
import mongoose from 'mongoose';

/**
 * Función encargada de establecer la conexión con la base de datos MongoDB.
 * Utiliza la URI definida en la variable de entorno MONGODB_URI.
 */
const connectDB = async () => {
  try {
    // Intentamos conectar con MongoDB usando las opciones recomendadas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,     // Permite usar el nuevo parser de URLs de Mongo
      useUnifiedTopology: true,  // Usa el nuevo motor de gestión de topología
    });

    // Mensaje en consola si la conexión fue exitosa
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    // Mensaje en consola si ocurre un error durante la conexión
    console.error('🔴 Error connecting to MongoDB:', error.message);

    // Forzamos la detención del servidor si no se puede conectar
    process.exit(1);
  }
};

// Exportamos la función para que pueda ser usada en otros módulos del proyecto
export default connectDB;
