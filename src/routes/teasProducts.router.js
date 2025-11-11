import { Router } from 'express';
import { getTeasProducts, getTeaProductById, createTeaProduct, updateTeaProduct, deleteTeaProduct, searchTeaProductByName } from '../controllers/teasProducts.controller.js';
import { auth, requiresAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/search', searchTeaProductByName) //publico
router.get('/', getTeasProducts); //publico
router.get('/:id', getTeaProductById); //publico
router.post('/', auth, requiresAdmin, createTeaProduct); //admin
router.put('/:id', auth, requiresAdmin, updateTeaProduct); //admin
router.delete('/:id', auth, requiresAdmin, deleteTeaProduct); //admin

export default router;