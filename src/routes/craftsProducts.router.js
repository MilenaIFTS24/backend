import { Router } from 'express';
import { createCraftProduct, deleteCraftProduct, getCraftProductById, getCraftsProducts, searchCraftProductByName, updateCraftProduct } from '../controllers/craftsProducts.controller.js';
import { auth, requiresAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/search', searchCraftProductByName); //publico
router.get('/', getCraftsProducts); //publico
router.get('/:id', getCraftProductById); //publico
router.post('/', auth, requiresAdmin, createCraftProduct); //admin
router.put('/:id', auth, requiresAdmin, updateCraftProduct); //admin
router.delete('/:id', auth, requiresAdmin,deleteCraftProduct); //admin


export default router;