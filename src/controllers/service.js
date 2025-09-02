import Service from "../models/service.js";

// Controlador para gestionar los servicios
const ServiceController = {
  // Crear un nuevo servicio
  createService: async (req, res) => {
    try {
      const { name, description, price, duration } = req.body;
      const newService = new Service({ name, description, price, duration });
      await newService.save();
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ message: "Error creating service", error });
    }
  },

  // Obtener todos los servicios
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Error fetching services", error });
    }
  },

  // Actualizar un servicio por su ID
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Service.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updated)
        return res.status(404).json({ message: "Service not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating service", error });
    }
  },

  // Eliminar un servicio por su ID
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Service.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ message: "Service not found" });
      res.json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting service", error });
    }
  },
};

export default ServiceController;
