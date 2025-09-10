import mongoose from "mongoose";
import Invoice from "../../src/models/invoice.js";
import { afterAll, afterEach, beforeAll, describe, it, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockInvoiceData, mockInvoice;

beforeAll(async () => {
  // Datos de prueba
  mockInvoiceData = {
    userId: new mongoose.Types.ObjectId(),
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        quantity: 2,
      },
    ],
    total: 200,
    paymentMethod: "cash",
    status: "pending",
  };
  mockInvoice = new Invoice(mockInvoiceData);

  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Invoice.deleteMany();
});

describe("Invoice model test", () => {
  it("✅ Debería guardar una factura correctamente", async () => {
    const savedInvoice = await mockInvoice.save();

    expect(savedInvoice._id).toBeDefined();
    expect(savedInvoice.userId).toBeDefined();
    expect(savedInvoice.products.length).toBe(1);
    expect(savedInvoice.products[0].quantity).toBe(2);
    expect(savedInvoice.total).toBe(200);
    expect(savedInvoice.paymentMethod).toBe("cash");
    expect(savedInvoice.status).toBe("pending");
    expect(savedInvoice.createdAt).toBeDefined();
  });

  it("❌ Debería fallar si falta el campo requerido 'userId'", async () => {
    const invalidInvoice = new Invoice({
      products: [{ productId: new mongoose.Types.ObjectId(), quantity: 1 }],
      total: 100,
      paymentMethod: "card",
    });

    let err;
    try {
      await invalidInvoice.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it("❌ Debería fallar si un producto no tiene 'productId'", async () => {
    const invalidInvoice = new Invoice({
      userId: new mongoose.Types.ObjectId(),
      products: [{ quantity: 2 }], // ❌ falta productId
      total: 150,
      paymentMethod: "nequi",
    });

    let err;
    try {
      await invalidInvoice.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors["products.0.productId"]).toBeDefined();
  });

  it("❌ Debería fallar si falta el campo requerido 'total'", async () => {
    const invalidInvoice = new Invoice({
      userId: new mongoose.Types.ObjectId(),
      products: [{ productId: new mongoose.Types.ObjectId(), quantity: 1 }],
      paymentMethod: "efecty",
    });

    let err;
    try {
      await invalidInvoice.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.total).toBeDefined();
  });

  it("❌ Debería fallar si el método de pago no es válido", async () => {
    const invalidInvoice = new Invoice({
      userId: new mongoose.Types.ObjectId(),
      products: [{ productId: new mongoose.Types.ObjectId(), quantity: 1 }],
      total: 300,
      paymentMethod: "paypal", // ❌ no está en el enum
    });

    let err;
    try {
      await invalidInvoice.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.paymentMethod).toBeDefined();
    expect(err.errors.paymentMethod.message).toContain("`paypal` is not a valid enum value");
  });
});
