import { auth } from '../middleware/auth.js'; // Middleware de autenticación
import express from 'express';
import AppointmentController from '../controllers/appointment.js';

const router = express.Router();

// Usuario logueado: ver solo sus citas
router.get('/my', auth, AppointmentController.getUserAppointments);

// CRUD de citas
router.post('/', auth, AppointmentController.createAppointment);   // Crear cita
router.get('/', AppointmentController.getAllAppointments);        // Listar todas las citas
router.put('/:id', AppointmentController.updateAppointment);      // Actualizar cita
router.delete('/:id', AppointmentController.deleteAppointment);   // Eliminar cita

export default router;
