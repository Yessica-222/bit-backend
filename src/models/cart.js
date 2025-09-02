import mongoose from 'mongoose';

//Esquema del carrito de compras
const cartSchema = new mongoose.Schema({
  // Usuario dueño del carrito
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relación con el modelo User
    required: true
  },

  // Producto agregado al carrito
  id_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Relación con el modelo Product
    required: true
  },

  // Cantidad de ese producto en el carrito
  quantity: {
    type: Number,
    default: 1 // Si no se especifica, inicia con 1
  }
}, {
  // Agrega automáticamente createdAt y updatedAt
  timestamps: true
});

//Exportamos el modelo
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
