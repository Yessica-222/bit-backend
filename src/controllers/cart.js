import Cart from '../models/cart.js';
import Product from '../models/products.js';

const cartController = {
  // 🔹 Crear (Agregar producto al carrito)
  addToCart: async (req, res) => {
    try {
      const { id_product } = req.body;
      const id_user = req.user.id;

      if (!id_product) {
        return res.status(400).json({ message: "id_product es requerido" });
      }

      const newCartItem = new Cart({
        id_user,
        id_product,
        quantity: 1
      });

      const savedItem = await newCartItem.save();

      res.status(201).json({ message: "Producto agregado al carrito", data: savedItem });
    } catch (error) {
      res.status(500).json({ message: 'Error al agregar al carrito.', error: error.message });
    }
  },

  // 🔹 Leer (Obtener productos del carrito con populate)
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;

      const cart = await Cart.find({ id_user: userId }).populate('id_product');

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el carrito.', error: error.message });
    }
  },

  // 🔹 Leer extra (Calcular el total del carrito)
  getTotal: async (req, res) => {
    try {
      const userId = req.user.id;

      const cartItems = await Cart.find({ id_user: userId }).populate('id_product');

      const total = cartItems.reduce((sum, item) => {
        const price = item.id_product?.price || 0;
        return sum + (price * item.quantity);
      }, 0);

      res.json({ total });
    } catch (error) {
      res.status(500).json({ message: 'Error al calcular el total', error: error.message });
    }
  },

  // 🔹 Actualizar (Modificar cantidad de un producto en el carrito)
  updateQuantity: async (req, res) => {
    try {
      const { id_cart } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Cantidad inválida' });
      }

      const item = await Cart.findById(id_cart);

      if (!item || item.id_user.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }

      item.quantity = quantity;
      await item.save();

      res.json({ message: 'Cantidad actualizada', data: item });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la cantidad', error: error.message });
    }
  },

  // 🔹 Eliminar (Quitar un producto del carrito)
  removeFromCart: async (req, res) => {
    try {
      const { id_cart } = req.params;

      const item = await Cart.findById(id_cart);

      if (!item || item.id_user.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Producto no encontrado en tu carrito.' });
      }

      await item.deleteOne();
      res.json({ message: 'Producto eliminado del carrito.' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar del carrito.', error: error.message });
    }
  }
};

export default cartController;
