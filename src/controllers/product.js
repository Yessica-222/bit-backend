import ProductModel from '../models/product.js';

const ProductsController = {
  create: async (req, res) => {
    try {
      const { name, price, description, category, stock } = req.body;

      const newProduct = new ProductModel({
        name,
        price,
        description,
        category,
        stock
      });

      const productCreated = await newProduct.save();

      res.status(201).json({
        allOK: true,
        message: 'Product created successfully',
        data: productCreated
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error creating product',
        data: error.message
      });
    }
  },

  readAll: async (req, res) => {
    try {
      const products = await ProductModel.find();
      res.status(200).json({
        allOK: true,
        message: 'All products retrieved successfully',
        data: products
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error retrieving products',
        data: error.message
      });
    }
  },

  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);

      if (!product) {
        return res.status(404).json({
          allOK: false,
          message: `Product with ID ${id} not found`,
          data: null
        });
      }

      res.status(200).json({
        allOK: true,
        message: `Product with ID ${id} retrieved successfully`,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error retrieving product',
        data: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, description, category, stock } = req.body;

      const productUpdated = await ProductModel.findByIdAndUpdate(
        id,
        { name, price, description, category, stock },
        { new: true }
      );

      if (!productUpdated) {
        return res.status(404).json({
          allOK: false,
          message: `Product with ID ${id} not found`,
          data: null
        });
      }

      res.status(200).json({
        allOK: true,
        message: `Product with ID ${id} updated successfully`,
        data: productUpdated
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error updating product',
        data: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const productDeleted = await ProductModel.findByIdAndDelete(id);

      if (!productDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `Product with ID ${id} not found`,
          data: null
        });
      }

      res.status(200).json({
        allOK: true,
        message: `Product with ID ${id} deleted successfully`,
        data: null
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error deleting product',
        data: error.message
      });
    }
  }
};

export default ProductsController;
