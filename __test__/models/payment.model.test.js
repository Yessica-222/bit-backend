import mongoose from "mongoose";
import Payment from "../../src/models/payment.js";
import { afterAll, afterEach, beforeAll, describe, it, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockPaymentData, mockPayment;

beforeAll(async () => {
  // Datos de prueba
  mockPaymentData = {
    invoiceId: new mongoose.Types.ObjectId(),
    method: "Nequi",
    amount: 100000,
    status: "pendiente",
  };
  mockPayment = new Payment(mockPaymentData);

  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Payment.deleteMany();
});

describe("Payment model test", () => {
  it(" Debería guardar un pago correctamente", async () => {
    const savedPayment = await mockPayment.save();

    expect(savedPayment._id).toBeDefined();
    expect(savedPayment.invoiceId).toBeDefined();
    expect(savedPayment.method).toBe("Nequi");
    expect(savedPayment.amount).toBe(100000);
    expect(savedPayment.status).toBe("pendiente");
    expect(savedPayment.createdAt).toBeDefined();
  });

  it(" Debería fallar si falta el campo requerido 'invoiceId'", async () => {
    const invalidPayment = new Payment({
      method: "Bancolombia",
      amount: 50000,
    });

    let err;
    try {
      await invalidPayment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.invoiceId).toBeDefined();
  });

  it(" Debería fallar si falta el campo requerido 'method'", async () => {
    const invalidPayment = new Payment({
      invoiceId: new mongoose.Types.ObjectId(),
      amount: 80000,
    });

    let err;
    try {
      await invalidPayment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.method).toBeDefined();
  });

  it(" Debería fallar si el método de pago no es válido", async () => {
    const invalidPayment = new Payment({
      invoiceId: new mongoose.Types.ObjectId(),
      method: "PayPal", // no está en el enum
      amount: 60000,
    });

    let err;
    try {
      await invalidPayment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.method).toBeDefined();
    expect(err.errors.method.message).toContain("`PayPal` is not a valid enum value");
  });

  it(" Debería fallar si falta el campo requerido 'amount'", async () => {
    const invalidPayment = new Payment({
      invoiceId: new mongoose.Types.ObjectId(),
      method: "Efecty",
    });

    let err;
    try {
      await invalidPayment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.amount).toBeDefined();
  });
});
