import { Router } from 'express';
import { getOffers, getOfferById, createOffer, updateOffer, deleteOffer, searchOfferByTitle } from '../controllers/offers.controller.js';
import { auth, requiresAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/search', searchOfferByTitle); //publico
router.get('/', getOffers); //publico
router.get('/:id', getOfferById); //publico
router.post('/', auth, requiresAdmin, createOffer); //admin
router.put('/:id', auth, requiresAdmin, updateOffer); //admin
router.delete('/:id', auth, requiresAdmin, deleteOffer); //admin

export default router;