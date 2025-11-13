import * as usersService from '../services/users.service.js';

export const getUsers = async (req, res) => {
    try {
        const users = await usersService.getAllUsers();
        if (users.length === 0) {
            return res.status(404).json({ error: 'No hay usuarios' });
        }

        console.log("Capa Controlador ---> getUsers: ", users);
        return res.status(200).json(users);
    } catch (error) {
        console.error('Capa Controlador --> Error al obtener los usuarios:', error);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }
        const user = await usersService.getUserById(id);

        console.log("Capa Controlador ---> getUserById: ", user);
        return res.status(200).json(user);

    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al obtener el usuario:', error);
        return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ error: 'Email de usuario inválido' });
        }
        const user = await usersService.getUserByEmail(email);

        console.log("Capa Controlador ---> getUserByEmail: ", user);
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al obtener el usuario:', error);
        return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

export const searchUserByName = async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        const filteredUsers = await usersService.searchUserByName(name);

        console.log('Capa Controlador ---> name: ', name);
        console.log('Capa Controlador ---> searchUserByName: ', filteredUsers);
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.error('Capa Controlador --> Error al buscar el usuario por nombre:', error);
        return res.status(500).json({ error: 'Error al buscar el usuario por nombre' });
    }
}


export const createUser = async (req, res) => {
    const validation = usersService.validateUserData(req.body);

    if (!validation.valid) {
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

        console.log("Capa Controlador ---> createUser: ", newUser);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Capa Controlador --> Error al crear el usuario:', error);
        return res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const validation = usersService.validateUserUpdateData(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const cleanData = validation.cleanData;

    try {
        const updatedUser = await usersService.updateUser(id, cleanData); 
        
        console.log("Capa Controlador ---> updateUser: ", updatedUser);
        return res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al actualizar el usuario:', error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        const deletedUser = await usersService.deleteUser(id);

        console.log("Capa Controlador ---> deleteUser: ", deletedUser);
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al eliminar el usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}