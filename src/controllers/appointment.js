import Appointment from "../models/appointment.js";

const AppointmentController = {
  // Crear cita (el usuario agenda una cita con un servicio específico)
  createAppointment: async (req, res) => {
    try {
      const { serviceId, appointmentDate } = req.body;
      const userId = req.user.id; // viene del auth middleware

      const newAppointment = new Appointment({ userId, serviceId, appointmentDate });
      await newAppointment.save();

      // Traer la cita creada con populate para mostrar información del usuario y servicio
      const populatedAppointment = await Appointment.findById(newAppointment._id)
        .populate("serviceId")
        .populate("userId", "name email");

      res.status(201).json(populatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Error creating appointment", error });
    }
  },

  // Listar todas las citas (ADMIN)
  getAllAppointments: async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate("userId", "name email")
        .populate("serviceId");
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments", error });
    }
  },

  // Actualizar una cita (cambiar fecha, estado, etc.)
  updateAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
      })
        .populate("serviceId")
        .populate("userId", "name email");

      if (!updated)
        return res.status(404).json({ message: "Appointment not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating appointment", error });
    }
  },

  // Eliminar una cita
  deleteAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Appointment.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ message: "Appointment not found" });
      res.json({ message: "Appointment deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting appointment", error });
    }
  },

  // Listar las citas de un usuario autenticado
  getUserAppointments: async (req, res) => {
    try {
      const userId = req.user.id;
      const appointments = await Appointment.find({ userId })
        .populate("serviceId")
        .populate("userId", "name email");
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user appointments", error });
    }
  },
};

export default AppointmentController;
