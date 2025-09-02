import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  // Nombre del usuario
  name: {
    type: String,
    required: true,
    trim: true, // elimina espacios innecesarios
  },

  // Correo electrónico único y validado con regex
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Correo no válido'], // validación de formato de email
  },

  // Contraseña encriptada (mínimo 8 caracteres)
  password: {
    type: String,
    required: true,
    minlength: [8, 'Mínimo 8 caracteres'],
  },

  // Rol de usuario: por defecto 'user'
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  }
}, { timestamps: true }); 
// timestamps añade automáticamente createdAt y updatedAt

// Middleware de Mongoose
// Antes de guardar el documento, encriptamos la contraseña
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // evita re-encriptar si no cambió
  this.password = await bcrypt.hash(this.password, 10); // hash con salt = 10
  next();
});

// Método de instancia
// Compara la contraseña ingresada con la almacenada
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Exportamos el modelo de usuario
const User = mongoose.model('User', userSchema);
export default User;
