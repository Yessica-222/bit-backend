import mongoose from "mongoose";
import Cart from "../../src/models/cart.js";
import { afterAll, afterEach, beforeAll, describe, it, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockCartData, mockCart;

beforeAll(async () => {
  // Datos de prueba
  mockCartData = {
    id_user: new mongoose.Types.ObjectId(),
    id_product: new mongoose.Types.ObjectId(),
    quantity: 2,
  };
  mockCart = new Cart(mockCartData);

  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Cart.deleteMany();
});

describe("Cart model test", () => {
  it(" Debería guardar un carrito correctamente", async () => {
    const savedCart = await mockCart.save();

    expect(savedCart._id).toBeDefined();
    expect(savedCart.id_user).toBeDefined();
    expect(savedCart.id_product).toBeDefined();
    expect(savedCart.quantity).toBe(2);
    expect(savedCart.createdAt).toBeDefined();
    expect(savedCart.updatedAt).toBeDefined();
  });

  it(" Debería asignar cantidad = 1 por defecto si no se especifica", async () => {
    const cartWithDefaultQty = new Cart({
      id_user: new mongoose.Types.ObjectId(),
      id_product: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cartWithDefaultQty.save();

    expect(savedCart.quantity).toBe(1); // valor por defecto
  });

  it(" Debería fallar si falta el campo requerido 'id_user'", async () => {
    const invalidCart = new Cart({
      id_product: new mongoose.Types.ObjectId(),
      quantity: 1,
    });

    let err;
    try {
      await invalidCart.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.id_user).toBeDefined();
  });

  it(" Debería fallar si falta el campo requerido 'id_product'", async () => {
    const invalidCart = new Cart({
      id_user: new mongoose.Types.ObjectId(),
      quantity: 3,
    });

    let err;
    try {
      await invalidCart.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.id_product).toBeDefined();
  });
});
