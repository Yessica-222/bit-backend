import mongoose from "mongoose";
import Appointment from "../../src/models/appointment.js";
import { afterAll, afterEach, beforeAll, describe, it, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockAppointmentData, mockAppointment;

beforeAll(async () => {
  // Datos de prueba
  mockAppointmentData = {
    userId: new mongoose.Types.ObjectId(),
    serviceId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-09-10T10:00:00Z"),
    status: "pending",
  };
  mockAppointment = new Appointment(mockAppointmentData);

  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Appointment.deleteMany();
});

describe("Appointment model test", () => {
  it(" Debería guardar una cita correctamente", async () => {
    const savedAppointment = await mockAppointment.save();

    expect(savedAppointment._id).toBeDefined();
    expect(savedAppointment.userId).toBeDefined();
    expect(savedAppointment.serviceId).toBeDefined();
    expect(savedAppointment.appointmentDate).toEqual(new Date("2025-09-10T10:00:00Z"));
    expect(savedAppointment.status).toBe("pending");
    expect(savedAppointment.createdAt).toBeDefined();
    expect(savedAppointment.updatedAt).toBeDefined();
  });

  it("✅ Debería asignar estado 'pending' por defecto si no se especifica", async () => {
    const appointmentWithDefaultStatus = new Appointment({
      userId: new mongoose.Types.ObjectId(),
      serviceId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date(),
    });

    const savedAppointment = await appointmentWithDefaultStatus.save();

    expect(savedAppointment.status).toBe("pending"); // valor por defecto
  });

  it(" Debería fallar si falta el campo requerido 'userId'", async () => {
    const invalidAppointment = new Appointment({
      serviceId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date(),
    });

    let err;
    try {
      await invalidAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it(" Debería fallar si falta el campo requerido 'serviceId'", async () => {
    const invalidAppointment = new Appointment({
      userId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date(),
    });

    let err;
    try {
      await invalidAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.serviceId).toBeDefined();
  });

  it(" Debería fallar si falta el campo requerido 'appointmentDate'", async () => {
    const invalidAppointment = new Appointment({
      userId: new mongoose.Types.ObjectId(),
      serviceId: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await invalidAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.appointmentDate).toBeDefined();
  });

  it(" Debería fallar si el estado no es válido", async () => {
    const invalidAppointment = new Appointment({
      userId: new mongoose.Types.ObjectId(),
      serviceId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date(),
      status: "in-progress", // no está en el enum
    });

    let err;
    try {
      await invalidAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.status).toBeDefined();
    expect(err.errors.status.message).toContain("`in-progress` is not a valid enum value");
  });
});
