import { Router } from 'express';
import { getUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser, searchUserByName } from '../controllers/users.controller.js';
import { auth, requiresAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/search', auth, requiresAdmin, searchUserByName); //admin
router.get('/', auth, requiresAdmin,getUsers); //admin
router.get('/:id', auth, requiresAdmin, getUserById); //admin
router.get('/:email', getUserByEmail); //publico (login)
router.post('/', createUser); //publico
router.put('/:id', auth, updateUser); //user y admin
router.delete('/:id', auth, deleteUser); //user y admin

export default router;