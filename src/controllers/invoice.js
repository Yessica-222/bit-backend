import mongoose from "mongoose";
import Invoice from "../models/invoice.js";
import Product from "../models/products.js"; 

// Controlador para gestionar facturas
const invoiceController = {
  // ADMIN: Crear una factura manualmente
  createInvoice: async (req, res) => {
    try {
      const { userId, products, total, paymentMethod, status } = req.body;

      if (!userId) return res.status(400).json({ message: "userId requerido" });
      if (!paymentMethod)
        return res.status(400).json({ message: "paymentMethod requerido" });

      const normalized = (products || [])
        .map((p) => ({
          productId: p?.productId || p?.id || p?._id,
          quantity: Number(p?.quantity || 1),
        }))
        .filter((p) => mongoose.Types.ObjectId.isValid(p.productId));

      if (!normalized.length)
        return res.status(400).json({ message: "productos inválidos" });

      const saved = await new Invoice({
        userId,
        products: normalized,
        total,
        paymentMethod: paymentMethod.toLowerCase(),
        status: status || "pending",
      }).save();

      res.status(201).json(saved);
    } catch (error) {
      res.status(500).json({ message: "Error al crear factura", error });
    }
  },

  // ADMIN: Obtener todas las facturas
  getAllInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.find()
        .populate("userId", "name email")
        .populate("products.productId", "name price")
        .sort({ createdAt: -1 });

      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener facturas", error });
    }
  },

  // USER: Obtener solo sus facturas
  getUserInvoices: async (req, res) => {
    try {
      const userId = req.user.id;
      const invoices = await Invoice.find({ userId })
        .populate("products.productId", "name price")
        .sort({ createdAt: -1 });

      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener facturas del usuario", error });
    }
  },

  // ADMIN: Actualizar una factura por ID
  updateInvoice: async (req, res) => {
    try {
      const invoiceId = req.params.id;
      const updated = await Invoice.findByIdAndUpdate(invoiceId, req.body, {
        new: true,
      });

      if (!updated)
        return res.status(404).json({ message: "Factura no encontrada" });

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar factura", error });
    }
  },

  // ADMIN: Eliminar una factura por ID
  deleteInvoice: async (req, res) => {
    try {
      const invoiceId = req.params.id;
      const deleted = await Invoice.findByIdAndDelete(invoiceId);

      if (!deleted)
        return res.status(404).json({ message: "Factura no encontrada" });

      res.status(200).json({ message: "Factura eliminada con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar factura", error });
    }
  },

  // USER: Crear su propia factura (validando stock)
  createInvoiceUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const { products, total, paymentMethod } = req.body;

      if (!paymentMethod)
        return res.status(400).json({ message: "paymentMethod requerido" });

      const normalized = (products || [])
        .map((p) => ({
          productId: p?.productId || p?.id || p?._id,
          quantity: Number(p?.quantity || 1),
        }))
        .filter((p) => mongoose.Types.ObjectId.isValid(p.productId));

      if (!normalized.length)
        return res.status(400).json({ message: "productos inválidos" });

      // 🔹 Validar stock de cada producto
      for (const p of normalized) {
        const productDB = await Product.findById(p.productId);
        if (!productDB)
          return res
            .status(404)
            .json({ message: `Producto no encontrado: ${p.productId}` });

        if (p.quantity > productDB.stock) {
          return res.status(400).json({
            message: `⚠️ Solo hay ${productDB.stock} unidades disponibles de ${productDB.name}`,
          });
        }
      }

      // Crear factura
      const saved = await new Invoice({
        userId,
        products: normalized,
        total,
        paymentMethod: paymentMethod.toLowerCase(),
        status: "pending",
      }).save();

      // 🔹 Actualizar stock de los productos
      for (const p of normalized) {
        await Product.findByIdAndUpdate(p.productId, {
          $inc: { stock: -p.quantity },
        });
      }

      res.status(201).json(saved);
    } catch (error) {
      console.error(error); // Para depuración en consola
      res.status(500).json({ message: "Error al crear factura del usuario", error });
    }
  },
};

export default invoiceController;
