import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

// Mock de Payment model
const saveMock = jest.fn();
const populateMock = jest.fn();
jest.unstable_mockModule("../../src/models/payment.js", () => {
  const mockConstructor = jest.fn(() => ({ save: saveMock }));
  mockConstructor.find = jest.fn(() => ({ populate: populateMock }));
  mockConstructor.findByIdAndUpdate = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  return { default: mockConstructor };
});

// Importar controlador y modelo
const paymentController = (await import("../../src/controllers/payment.js")).default;
const Payment = (await import("../../src/models/payment.js")).default;

let res, reqMock;
beforeAll(() => {
  reqMock = {
    body: { invoiceId: "inv123", method: "card", amount: 100, status: "completed" },
    params: { id: "pay123", invoiceId: "inv123" },
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
   CREATE (Crear un pago)
   ========================================================== */
describe("paymentController - createPayment", () => {
  it("✅ Debería crear un pago y retornar 201", async () => {
    saveMock.mockResolvedValue({ _id: "pay123", ...reqMock.body });

    await paymentController.createPayment(reqMock, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: "pay123" }));
  });

  it(" Debería retornar 500 si ocurre un error al crear", async () => {
    saveMock.mockRejectedValue(new Error("DB error"));

    await paymentController.createPayment(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error creando pago" }));
  });
});

/* ==========================================================
   READ (Listar todos los pagos - admin)
   ========================================================== */
describe("paymentController - getAllPayments", () => {
  it(" Debería retornar lista de pagos", async () => {
    const mockPayments = [{ _id: "pay123", amount: 100 }];
    populateMock.mockResolvedValue(mockPayments);

    await paymentController.getAllPayments({}, res);

    expect(Payment.find).toHaveBeenCalled();
    expect(populateMock).toHaveBeenCalledWith("invoiceId", "total createdAt");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPayments);
  });

  it(" Debería retornar 500 si ocurre un error al listar", async () => {
    populateMock.mockRejectedValue(new Error("DB error"));

    await paymentController.getAllPayments({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al obtener pagos" }));
  });
});

/* ==========================================================
   READ (Obtener pagos por factura)
   ========================================================== */
describe("paymentController - getPaymentsByInvoice", () => {
  it(" Debería retornar lista de pagos de una factura", async () => {
    const mockPayments = [{ _id: "pay123", invoiceId: "inv123" }];
    Payment.find.mockResolvedValue(mockPayments);

    await paymentController.getPaymentsByInvoice(reqMock, res);

    expect(Payment.find).toHaveBeenCalledWith({ invoiceId: "inv123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPayments);
  });

  it(" Debería retornar 500 si ocurre un error", async () => {
    Payment.find.mockRejectedValue(new Error("DB error"));

    await paymentController.getPaymentsByInvoice(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al obtener pagos de la factura" }));
  });
});

/* ==========================================================
   UPDATE (Actualizar estado de un pago - admin)
   ========================================================== */
describe("paymentController - updatePaymentStatus", () => {
  it(" Debería actualizar estado del pago", async () => {
    const updatedPayment = { _id: "pay123", status: "completed" };
    Payment.findByIdAndUpdate.mockResolvedValue(updatedPayment);

    await paymentController.updatePaymentStatus(reqMock, res);

    expect(Payment.findByIdAndUpdate).toHaveBeenCalledWith("pay123", { status: "completed" }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedPayment);
  });

  it(" Debería retornar 500 si ocurre un error al actualizar", async () => {
    Payment.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

    await paymentController.updatePaymentStatus(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al actualizar el estado del pago" }));
  });
});

/* ==========================================================
   DELETE (Eliminar un pago - admin)
   ========================================================== */
describe("paymentController - deletePayment", () => {
  it(" Debería eliminar un pago", async () => {
    Payment.findByIdAndDelete.mockResolvedValue({ _id: "pay123" });

    await paymentController.deletePayment(reqMock, res);

    expect(Payment.findByIdAndDelete).toHaveBeenCalledWith("pay123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Pago eliminado correctamente" });
  });

  it(" Debería retornar 500 si ocurre un error al eliminar", async () => {
    Payment.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await paymentController.deletePayment(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al eliminar pago" }));
  });
});
