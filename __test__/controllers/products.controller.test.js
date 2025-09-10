import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

// Mock de Product model
const saveMock = jest.fn();
jest.unstable_mockModule("../../src/models/products.js", () => {
  const mockConstructor = jest.fn(() => ({ save: saveMock }));
  mockConstructor.find = jest.fn();
  mockConstructor.findById = jest.fn();
  mockConstructor.findByIdAndUpdate = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  return { default: mockConstructor };
});

// Importar controlador y modelo
const ProductsController = (await import("../../src/controllers/products.js")).default;
const Product = (await import("../../src/models/products.js")).default;

let res, reqMock;
beforeAll(() => {
  reqMock = {
    body: { name: "Laptop", price: 2500 },
    params: { id: "123" },
  };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

/* ==========================================================
   CREATE (Crear un producto)
   ========================================================== */
describe("ProductsController - createProduct", () => {
  it(" Debería crear un producto y retornar 201", async () => {
    saveMock.mockResolvedValue(true);

    await ProductsController.createProduct(reqMock, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Product created successfully" })
    );
  });

  it(" Debería retornar 500 si ocurre un error al crear", async () => {
    saveMock.mockRejectedValue(new Error("DB error"));

    await ProductsController.createProduct(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error creating product" })
    );
  });
});

/* ==========================================================
   READ (Obtener todos los productos)
   ========================================================== */
describe("ProductsController - getAllProducts", () => {
  it(" Debería retornar lista de productos", async () => {
    const mockProducts = [{ name: "Laptop", price: 2500 }];
    Product.find.mockResolvedValue(mockProducts);

    await ProductsController.getAllProducts({}, res);

    expect(Product.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProducts);
  });

  it(" Debería retornar 500 si ocurre un error al leer", async () => {
    Product.find.mockRejectedValue(new Error("DB error"));

    await ProductsController.getAllProducts({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error retrieving products" })
    );
  });
});

/* ==========================================================
   READ (Obtener un producto por ID)
   ========================================================== */
describe("ProductsController - getProductById", () => {
  it(" Debería retornar 200 con el producto encontrado", async () => {
    const mockProduct = { _id: "123", name: "Laptop" };
    Product.findById.mockResolvedValue(mockProduct);

    await ProductsController.getProductById(reqMock, res);

    expect(Product.findById).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProduct);
  });

  it(" Debería retornar 404 si no encuentra el producto", async () => {
    Product.findById.mockResolvedValue(null);

    await ProductsController.getProductById(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
  });

  it(" Debería retornar 500 si ocurre un error", async () => {
    Product.findById.mockRejectedValue(new Error("DB error"));

    await ProductsController.getProductById(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error retrieving product" })
    );
  });
});

/* ==========================================================
   UPDATE (Actualizar un producto por ID)
   ========================================================== */
describe("ProductsController - updateProduct", () => {
  it("✅ Debería actualizar un producto y retornar 200", async () => {
    const updatedProduct = { _id: "123", name: "Laptop actualizado" };
    Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

    await ProductsController.updateProduct(reqMock, res);

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("123", reqMock.body, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Product updated successfully" })
    );
  });

  it(" Debería retornar 404 si no encuentra el producto", async () => {
    Product.findByIdAndUpdate.mockResolvedValue(null);

    await ProductsController.updateProduct(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
  });

  it(" Debería retornar 500 si ocurre un error al actualizar", async () => {
    Product.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

    await ProductsController.updateProduct(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error updating product" })
    );
  });
});

/* ==========================================================
   DELETE (Eliminar un producto por ID)
   ========================================================== */
describe("ProductsController - deleteProduct", () => {
  it(" Debería eliminar un producto y retornar 200", async () => {
    Product.findByIdAndDelete.mockResolvedValue({ _id: "123" });

    await ProductsController.deleteProduct(reqMock, res);

    expect(Product.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Product deleted successfully" });
  });

  it(" Debería retornar 404 si no encuentra el producto", async () => {
    Product.findByIdAndDelete.mockResolvedValue(null);

    await ProductsController.deleteProduct(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
  });

  it(" Debería retornar 500 si ocurre un error al eliminar", async () => {
    Product.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await ProductsController.deleteProduct(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error deleting product" })
    );
  });
});
