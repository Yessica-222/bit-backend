import mongoose from "mongoose";
import Product from "../../src/models/products.js";
import { afterAll, afterEach, beforeAll, describe, it, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockProductData, mockProduct;

beforeAll(async () => {
  // Datos de prueba
  mockProductData = {
    name: "Computador DELL",
    description: "Para la universidad",
    price: 2500000,
    stock: 50,
    category: "Gamer",
    image: "dell.png"
  };
  mockProduct = new Product(mockProductData);

  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany();
});

describe("Product model test", () => {
  it(" Debería guardar un producto correctamente", async () => {
    const savedProduct = await mockProduct.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe("Computador DELL");
    expect(savedProduct.price).toBe(2500000);
    expect(savedProduct.stock).toBe(50);
    expect(savedProduct.category).toBe("Gamer");
    expect(savedProduct.image).toBe("dell.png");
  });

  it(" Debería fallar si falta un campo requerido (name)", async () => {
    const invalidProduct = new Product({
      description: "Sin nombre",
      price: 10,
      stock: 5,
      category: "General"
    });

    let err;
    try {
      await invalidProduct.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it(" Debería fallar si el precio no está definido", async () => {
    const invalidProduct = new Product({
      name: "Producto sin precio",
      description: "Debe fallar",
      stock: 10,
      category: "Cabello"
    });

    let err;
    try {
      await invalidProduct.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.price).toBeDefined();
  });

  it(" Debería fallar si el stock no está definido", async () => {
    const invalidProduct = new Product({
      name: "Producto sin stock",
      description: "Debe fallar",
      price: 10,
      category: "Gamer"
    });

    let err;
    try {
      await invalidProduct.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.stock).toBeDefined();
  });
});
