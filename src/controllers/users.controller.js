import * as usersService from '../services/users.service.js';
import { log, logError } from '../utils/logger.utils.js';

export const getUsers = async (req, res) => {
    try {
        const users = await usersService.getAllUsers();
        if (users.length === 0) {
            log('Controlador', 'getUsers', 'No existen usuarios');
            return res.status(404).json({ error: 'No existen usuarios' });
        }

        log('Controlador', 'getUsers', 'Usuarios obtenidos', users);
        return res.status(200).json(users);
    } catch (error) {
        logError('Controlador', 'getUsers', error, 'Error al obtener los usuarios');
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'getUserById', 'ID de usuario inválido');
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }
        const user = await usersService.getUserById(id);

        log('Controlador', 'getUserById', 'Usuario obtenido', user);
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'getUserById', error, 'Error al obtener el usuario');
        return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            log('Controlador', 'getUserByEmail', 'Email de usuario inválido');
            return res.status(400).json({ error: 'Email de usuario inválido' });
        }
        const user = await usersService.getUserByEmail(email);

        log('Controlador', 'getUserByEmail', 'Usuario obtenido', user);
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'getUserByEmail', error, 'Error al obtener el usuario');
        return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

export const searchUserByName = async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        log('Controlador', 'searchUserByName', 'Se requiere el query param << name >>');
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        const filteredUsers = await usersService.searchUserByName(name);

        log('Controlador', 'searchUserByName', 'name', name);
        log('Controlador', 'searchUserByName', 'filteredUsers', filteredUsers);
        return res.status(200).json(filteredUsers);
    } catch (error) {
        logError('Controlador', 'searchUserByName', error, 'Error al buscar el usuario por nombre');
        return res.status(500).json({ error: 'Error al buscar el usuario por nombre' });
    }
};

export const createUser = async (req, res) => {
    const validation = usersService.validateUserData(req.body);

    if (!validation.valid) {
        log('Controlador', 'createUser', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { fullName, dateOfBirth, email, password, accountEnabled, phone, address, role } = req.body;

    try {
        const newUser = await usersService.createUser({
            fullName,
            dateOfBirth,
            email,
            password,
            accountEnabled,
            phone,
            address,
            role
        });

        log('Controlador', 'createUser', 'Usuario creado', newUser);
        return res.status(201).json(newUser);
    } catch (error) {
        logError('Controlador', 'createUser', error, 'Error al crear el usuario');
        return res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        log('Controlador', 'updateUser', 'ID de usuario inválido');
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const validation = usersService.validateUserUpdateData(req.body);

    if (!validation.valid) {
        log('Controlador', 'updateUser', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const cleanData = validation.cleanData;

    try {
        const updatedUser = await usersService.updateUser(id, cleanData); 
        
        log('Controlador', 'updateUser', 'Usuario actualizado', updatedUser);
        return res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'updateUser', error, 'Error al actualizar el usuario');
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'deleteUser', 'ID de usuario inválido');
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        const deletedUser = await usersService.deleteUser(id);

        log('Controlador', 'deleteUser', 'Usuario eliminado', deletedUser);
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'deleteUser', error, 'Error al eliminar el usuario');
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};