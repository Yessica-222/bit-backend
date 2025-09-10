import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

// Mock de Service model
const saveMock = jest.fn();
jest.unstable_mockModule("../../src/models/service.js", () => {
  const mockConstructor = jest.fn(() => ({ save: saveMock }));
  mockConstructor.find = jest.fn();
  mockConstructor.findByIdAndUpdate = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  return { default: mockConstructor };
});

// Importar controlador y modelo
const ServiceController = (await import("../../src/controllers/service.js")).default;
const Service = (await import("../../src/models/service.js")).default;

let res, reqMock, emptyReqMock;
beforeAll(() => {
  reqMock = {
    body: { name: "Corte", description: "Corte de cabello", price: 15000, duration: 30 },
    params: { id: "123" },
  };
  emptyReqMock = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

/* ==========================================================
   CREATE (Crear un nuevo servicio)
   ========================================================== */
describe("ServiceController - createService", () => {
  it(" Debería crear un servicio y retornar 201", async () => {
    saveMock.mockResolvedValue(true);

    await ServiceController.createService(reqMock, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it(" Debería retornar 500 si ocurre un error al crear", async () => {
    saveMock.mockRejectedValue(new Error("DB error"));

    await ServiceController.createService(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error creating service" }));
  });
});

/* ==========================================================
   READ (Obtener todos los servicios)
   ========================================================== */
describe("ServiceController - getAllServices", () => {
  it("✅ Debería retornar lista de servicios", async () => {
    const mockServices = [{ name: "Corte", price: 15000 }];
    Service.find.mockResolvedValue(mockServices);

    await ServiceController.getAllServices(emptyReqMock, res);

    expect(Service.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockServices);
  });

  it(" Debería retornar 500 si ocurre un error al leer", async () => {
    Service.find.mockRejectedValue(new Error("DB error"));

    await ServiceController.getAllServices(emptyReqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error fetching services" }));
  });
});

/* ==========================================================
   UPDATE (Actualizar un servicio existente)
   ========================================================== */
describe("ServiceController - updateService", () => {
  it(" Debería actualizar un servicio existente", async () => {
    const updatedService = { name: "Corte actualizado" };
    Service.findByIdAndUpdate.mockResolvedValue(updatedService);

    await ServiceController.updateService(reqMock, res);

    expect(Service.findByIdAndUpdate).toHaveBeenCalledWith("123", reqMock.body, { new: true });
    expect(res.json).toHaveBeenCalledWith(updatedService);
  });

  it(" Debería retornar 404 si el servicio no existe", async () => {
    Service.findByIdAndUpdate.mockResolvedValue(null);

    await ServiceController.updateService(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Service not found" });
  });

  it(" Debería retornar 500 si ocurre un error al actualizar", async () => {
    Service.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

    await ServiceController.updateService(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error updating service" }));
  });
});

/* ==========================================================
   DELETE (Eliminar un servicio por ID)
   ========================================================== */
describe("ServiceController - deleteService", () => {
  it(" Debería eliminar un servicio existente", async () => {
    Service.findByIdAndDelete.mockResolvedValue({ _id: "123" });

    await ServiceController.deleteService(reqMock, res);

    expect(Service.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith({ message: "Service deleted" });
  });

  it(" Debería retornar 404 si no encuentra el servicio", async () => {
    Service.findByIdAndDelete.mockResolvedValue(null);

    await ServiceController.deleteService(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Service not found" });
  });

  it(" Debería retornar 500 si ocurre un error al eliminar", async () => {
    Service.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await ServiceController.deleteService(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error deleting service" }));
  });
});
