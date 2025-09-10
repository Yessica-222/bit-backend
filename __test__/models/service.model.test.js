import mongoose from "mongoose";
import Service from "../../src/models/service.js";
import { afterAll, afterEach, beforeAll, describe, it, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockServiceData, mockService;

beforeAll(async () => {
  // Datos de prueba
  mockServiceData = {
    name: "Limpieza",
    description: "Limpieza Completa",
    price: 45000,
    duration: 30,
  };
  mockService = new Service(mockServiceData);

  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Service.deleteMany();
});

describe("Service model test", () => {
  it(" Debería guardar un servicio correctamente", async () => {
    const savedService = await mockService.save();

    expect(savedService._id).toBeDefined();
    expect(savedService.name).toBe("Limpieza");
    expect(savedService.description).toBe("Limpieza Completa");
    expect(savedService.price).toBe(45000);
    expect(savedService.duration).toBe(30);
  });

  it(" Debería fallar si falta el campo requerido 'name'", async () => {
    const invalidService = new Service({
      price: 45000,
      duration: 30,
    });

    let err;
    try {
      await invalidService.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it(" Debería fallar si falta el campo requerido 'price'", async () => {
    const invalidService = new Service({
      name: "Servicio sin precio",
      duration: 45,
    });

    let err;
    try {
      await invalidService.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.price).toBeDefined();
  });

  it(" Debería fallar si falta el campo requerido 'duration'", async () => {
    const invalidService = new Service({
      name: "Servicio sin duración",
      price: 15,
    });

    let err;
    try {
      await invalidService.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.duration).toBeDefined();
  });
});
