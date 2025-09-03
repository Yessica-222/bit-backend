import express from 'express';
import ServiceController from '../controllers/service.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Crear un nuevo servicio (solo admin)
router.post('/', auth, isAdmin, ServiceController.createService);

// Actualizar un servicio existente por ID (solo admin)
router.put('/:id', auth, isAdmin, ServiceController.updateService);

// Eliminar un servicio por ID (solo admin)
router.delete('/:id', auth, isAdmin, ServiceController.deleteService);

// Obtener todos los servicios (acceso para usuarios y administradores)
router.get('/', ServiceController.getAllServices);

export default router;
