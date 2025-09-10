import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

// ✅ Mock de Invoice y Product models
const saveMock = jest.fn();

jest.unstable_mockModule("../../src/models/invoice.js", () => {
  const InvoiceMock = jest.fn(function (data) {
    return { ...data, save: saveMock };
  });
  InvoiceMock.find = jest.fn(() => ({
    populate: () => ({
      populate: () => ({
        sort: jest.fn(),
      }),
    }),
  }));
  InvoiceMock.findByIdAndUpdate = jest.fn();
  InvoiceMock.findByIdAndDelete = jest.fn();
  return { default: InvoiceMock };
});

jest.unstable_mockModule("../../src/models/products.js", () => {
  return {
    default: {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    },
  };
});

// Importar controlador y modelos con mocks aplicados
const invoiceController = (await import("../../src/controllers/invoice.js")).default;
const Invoice = (await import("../../src/models/invoice.js")).default;
const Product = (await import("../../src/models/products.js")).default;

let res, reqMock, userReqMock;
beforeAll(() => {
  reqMock = {
    body: {
      userId: "user123",
      products: [{ productId: "507f1f77bcf86cd799439011", quantity: 2 }],
      total: 100,
      paymentMethod: "card",
      status: "pending",
    },
    params: { id: "inv123" },
  };

  userReqMock = {
    user: { id: "user123" },
    body: {
      products: [{ productId: "507f1f77bcf86cd799439011", quantity: 1 }],
      total: 50,
      paymentMethod: "cash",
    },
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
   CREATE (Admin crea factura)
   ========================================================== */
describe("invoiceController - createInvoice", () => {
  it(" Debería crear una factura y retornar 201", async () => {
    saveMock.mockResolvedValue({ _id: "inv123", ...reqMock.body });

    await invoiceController.createInvoice(reqMock, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: "inv123" }));
  });

  it(" Debería retornar 400 si falta userId", async () => {
    await invoiceController.createInvoice({ body: { ...reqMock.body, userId: null } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "userId requerido" }));
  });
});

/* ==========================================================
   READ (Obtener todas las facturas - Admin)
   ========================================================== */
describe("invoiceController - getAllInvoices", () => {
  it(" Debería retornar lista de facturas", async () => {
    const mockInvoices = [{ _id: "inv123" }];
    Invoice.find.mockReturnValueOnce({
      populate: () => ({
        populate: () => ({
          sort: jest.fn().mockResolvedValue(mockInvoices),
        }),
      }),
    });

    await invoiceController.getAllInvoices({}, res);

    expect(Invoice.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInvoices);
  });
});

/* ==========================================================
   READ (Obtener facturas de usuario)
   ========================================================== */
describe("invoiceController - getUserInvoices", () => {
  it(" Debería retornar facturas del usuario", async () => {
    const mockInvoices = [{ _id: "invUser1" }];
    Invoice.find.mockReturnValueOnce({
      populate: () => ({
        sort: jest.fn().mockResolvedValue(mockInvoices),
      }),
    });

    await invoiceController.getUserInvoices(userReqMock, res);

    expect(Invoice.find).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.json).toHaveBeenCalledWith(mockInvoices);
  });
});

/* ==========================================================
   UPDATE (Actualizar factura por ID - Admin)
   ========================================================== */
describe("invoiceController - updateInvoice", () => {
  it(" Debería actualizar una factura", async () => {
    const updatedInvoice = { _id: "inv123", status: "paid" };
    Invoice.findByIdAndUpdate.mockResolvedValue(updatedInvoice);

    await invoiceController.updateInvoice(reqMock, res);

    expect(Invoice.findByIdAndUpdate).toHaveBeenCalledWith("inv123", reqMock.body, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedInvoice);
  });

  it(" Debería retornar 404 si no encuentra la factura", async () => {
    Invoice.findByIdAndUpdate.mockResolvedValue(null);

    await invoiceController.updateInvoice(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Factura no encontrada" });
  });
});

/* ==========================================================
   DELETE (Eliminar factura por ID - Admin)
   ========================================================== */
describe("invoiceController - deleteInvoice", () => {
  it(" Debería eliminar una factura", async () => {
    Invoice.findByIdAndDelete.mockResolvedValue({ _id: "inv123" });

    await invoiceController.deleteInvoice(reqMock, res);

    expect(Invoice.findByIdAndDelete).toHaveBeenCalledWith("inv123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Factura eliminada con éxito" });
  });

  it(" Debería retornar 404 si no existe la factura", async () => {
    Invoice.findByIdAndDelete.mockResolvedValue(null);

    await invoiceController.deleteInvoice(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Factura no encontrada" });
  });
});

/* ==========================================================
   CREATE (Usuario crea factura propia con validación de stock)
   ========================================================== */
describe("invoiceController - createInvoiceUser", () => {
  it(" Debería crear factura del usuario y actualizar stock", async () => {
    saveMock.mockResolvedValue({ _id: "invUser123" });
    Product.findById.mockResolvedValue({ _id: "507f1f77bcf86cd799439011", stock: 5, name: "Laptop" });
    Product.findByIdAndUpdate.mockResolvedValue(true);

    await invoiceController.createInvoiceUser(userReqMock, res);

    expect(Product.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("507f1f77bcf86cd799439011", { $inc: { stock: -1 } });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: "invUser123" }));
  });

  it(" Debería retornar 404 si producto no existe", async () => {
    Product.findById.mockResolvedValue(null);

    await invoiceController.createInvoiceUser(userReqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Producto no encontrado") }));
  });

  it(" Debería retornar 400 si stock insuficiente", async () => {
    Product.findById.mockResolvedValue({ _id: "507f1f77bcf86cd799439011", stock: 0, name: "Laptop" });

    await invoiceController.createInvoiceUser(userReqMock, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Solo hay") }));
  });
});
