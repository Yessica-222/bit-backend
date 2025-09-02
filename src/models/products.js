import mongoose from 'mongoose';

// Definición del esquema para los productos
const productSchema = new mongoose.Schema({
  // Nombre del producto
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Descripción detallada del producto
  description: {
    type: String,
    required: true,
    trim: true
  },

  // Precio del producto
  price: {
    type: Number,
    required: true
  },

  // Cantidad en stock
  stock: {
    type: Number,
    required: true
  },

  // Categoría del producto (ejemplo: Belleza, Cabello, Uñas, etc.)
  category: {
    type: String,
    required: true,
    trim: true
  },

  // Imagen del producto (puede ser URL o nombre de archivo en servidor)
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true // añade automáticamente createdAt y updatedAt
});

// Exportamos el modelo
const Product = mongoose.model('Product', productSchema);
export default Product;
