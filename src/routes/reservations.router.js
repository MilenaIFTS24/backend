import { Router } from 'express';
import { getReservations, getReservationById, createReservation, updateReservation, deleteReservation } from '../controllers/reservations.controller.js';
import { auth, requiresAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', auth, getReservations); //user y admin
router.get('/:id', auth, getReservationById); //user y admin
router.post('/', auth, requiresAdmin, createReservation); //admin
router.put('/:id', auth, requiresAdmin, updateReservation); //admin
router.delete('/:id', auth, requiresAdmin, deleteReservation); //admin

export default router;