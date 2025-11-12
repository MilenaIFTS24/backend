import { Router } from 'express';
import { getEvents, getEventById, searchEventByTitle, createEvent, updateEvent, deleteEvent } from '../controllers/events.controller.js';
import { auth, requiresAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/search', searchEventByTitle); //publico
router.get('/', getEvents); //publico
router.get('/:id', getEventById); //publico
router.post('/', auth, requiresAdmin, createEvent); //admin
router.put('/:id', auth, requiresAdmin, updateEvent); //admin
router.delete('/:id', auth, requiresAdmin, deleteEvent); //admin

export default router;