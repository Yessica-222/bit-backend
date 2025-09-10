import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

//  Mock de Appointment model
const saveMock = jest.fn();
const populateMock = jest.fn();

jest.unstable_mockModule("../../src/models/appointment.js", () => {
  const AppointmentMock = jest.fn(function (data) {
    return { ...data, save: saveMock, _id: "appt123" };
  });
  AppointmentMock.find = jest.fn(() => ({
    populate: jest.fn().mockReturnThis(),
  }));
  AppointmentMock.findById = jest.fn(() => ({
    populate: jest.fn().mockReturnThis(),
  }));
  AppointmentMock.findByIdAndUpdate = jest.fn(() => ({
    populate: jest.fn().mockReturnThis(),
  }));
  AppointmentMock.findByIdAndDelete = jest.fn();
  return { default: AppointmentMock };
});

// Importar controlador y modelo con mocks aplicados
const AppointmentController = (await import("../../src/controllers/appointment.js")).default;
const Appointment = (await import("../../src/models/appointment.js")).default;

let res, reqMock;
beforeAll(() => {
  reqMock = {
    body: { serviceId: "service123", appointmentDate: "2025-09-10" },
    user: { id: "user123" },
    params: { id: "appt123" },
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
   CREATE (Crear cita)
   ========================================================== */
describe("AppointmentController - createAppointment", () => {
  it(" Debería crear una cita y retornar 201", async () => {
    saveMock.mockResolvedValue(true);
    Appointment.findById.mockReturnValueOnce({
      populate: () => ({
        populate: jest.fn().mockResolvedValue({ _id: "appt123", serviceId: "service123" }),
      }),
    });

    await AppointmentController.createAppointment(reqMock, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: "appt123" }));
  });

  it(" Debería retornar 500 si ocurre un error al crear", async () => {
    saveMock.mockRejectedValue(new Error("DB error"));

    await AppointmentController.createAppointment(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error creating appointment" }));
  });
});

/* ==========================================================
   READ (Obtener todas las citas - Admin)
   ========================================================== */
describe("AppointmentController - getAllAppointments", () => {
  it(" Debería retornar lista de citas", async () => {
    const mockAppointments = [{ _id: "appt123" }];
    Appointment.find.mockReturnValueOnce({
      populate: () => ({
        populate: jest.fn().mockResolvedValue(mockAppointments),
      }),
    });

    await AppointmentController.getAllAppointments({}, res);

    expect(Appointment.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockAppointments);
  });

  it(" Debería retornar 500 si ocurre un error", async () => {
    Appointment.find.mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    await AppointmentController.getAllAppointments({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error fetching appointments" }));
  });
});

/* ==========================================================
   UPDATE (Actualizar una cita)
   ========================================================== */
describe("AppointmentController - updateAppointment", () => {
  it(" Debería actualizar una cita", async () => {
    const updatedAppointment = { _id: "appt123", serviceId: "serviceUpdated" };
    Appointment.findByIdAndUpdate.mockReturnValueOnce({
      populate: () => ({
        populate: jest.fn().mockResolvedValue(updatedAppointment),
      }),
    });

    await AppointmentController.updateAppointment(reqMock, res);

    expect(Appointment.findByIdAndUpdate).toHaveBeenCalledWith("appt123", reqMock.body, { new: true });
    expect(res.json).toHaveBeenCalledWith(updatedAppointment);
  });

  it(" Debería retornar 404 si la cita no existe", async () => {
    Appointment.findByIdAndUpdate.mockReturnValueOnce({
      populate: () => ({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    await AppointmentController.updateAppointment(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Appointment not found" });
  });

  it(" Debería retornar 500 si ocurre un error", async () => {
    Appointment.findByIdAndUpdate.mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    await AppointmentController.updateAppointment(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error updating appointment" }));
  });
});

/* ==========================================================
   DELETE (Eliminar una cita)
   ========================================================== */
describe("AppointmentController - deleteAppointment", () => {
  it(" Debería eliminar una cita", async () => {
    Appointment.findByIdAndDelete.mockResolvedValue({ _id: "appt123" });

    await AppointmentController.deleteAppointment(reqMock, res);

    expect(Appointment.findByIdAndDelete).toHaveBeenCalledWith("appt123");
    expect(res.json).toHaveBeenCalledWith({ message: "Appointment deleted" });
  });

  it(" Debería retornar 404 si no encuentra la cita", async () => {
    Appointment.findByIdAndDelete.mockResolvedValue(null);

    await AppointmentController.deleteAppointment(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Appointment not found" });
  });

  it(" Debería retornar 500 si ocurre un error", async () => {
    Appointment.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await AppointmentController.deleteAppointment(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error deleting appointment" }));
  });
});

/* ==========================================================
   READ (Obtener citas de un usuario autenticado)
   ========================================================== */
describe("AppointmentController - getUserAppointments", () => {
  it(" Debería retornar citas del usuario", async () => {
    const mockAppointments = [{ _id: "appt123", userId: "user123" }];
    Appointment.find.mockReturnValueOnce({
      populate: () => ({
        populate: jest.fn().mockResolvedValue(mockAppointments),
      }),
    });

    await AppointmentController.getUserAppointments(reqMock, res);

    expect(Appointment.find).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.json).toHaveBeenCalledWith(mockAppointments);
  });

  it(" Debería retornar 500 si ocurre un error", async () => {
    Appointment.find.mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    await AppointmentController.getUserAppointments(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error fetching user appointments" }));
  });
});
