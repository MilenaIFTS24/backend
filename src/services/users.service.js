import * as model from "../models/users.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async () => {
    return await model.getAllUsers();
}

export const getUserById = async (id) => {
    const user = await model.getUserById(id);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    return user;
}

export const getUserByEmail = async (email) => {
    const user = await model.getUserByEmail(email);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    return user;
};

export const searchUserByName = async (name) => {
    const users = await model.getAllUsers();

    if (!Array.isArray(users)) {
        throw new Error('Error interno al obtener usuarios');
    }

    const filteredUsers = users.filter((user) =>
        typeof user.name === 'string' &&
        user.name.toLowerCase().includes(name.toLowerCase().trim())
    );

    if (filteredUsers.length === 0) {
        throw new Error('No se encontraron usuarios con ese nombre');
    }

    return filteredUsers;
}

export const createUser = async (data) => {

    const existingUser = await model.getUserByEmail(data.email);

    if (existingUser) {
        throw new Error('El email ya está registrado');
    }

    return await model.createUser(data);
}

export const updateUser = async (id, updateData) => {
    const existingUser = await model.getUserById(id);
    if (!existingUser) {
        throw new Error('Usuario no encontrado');
    }

    // Valido que el email no se repita
    if (updateData.email && updateData.email !== existingUser.email) {
        const userWithEmail = await model.getUserByEmail(updateData.email);
        if (userWithEmail && userWithEmail.id !== id) {
            throw new Error('El email ya está registrado por otro usuario');
        }
    }

    return await model.updateUser(id, updateData);
}

export const deleteUser = async (id) => {
    const deleteUser = await model.getUserById(id);
    if (!deleteUser) {
        throw new Error('Usuario no encontrado');
    }
    return await model.deleteUser(id);
}

export const verifyPassword = async (plainPassword, hashedPassword) => { //Verifico la contraseña 
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export const authenticateUser = async (email, password) => { //Verifico credenciales y/o estado de la cuenta
    const user = await model.getUserByEmail(email);

    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    //Verifico que la cuenta esté activa
    if (user.accountEnabled === false) {
        throw new Error('La cuenta está desactivada');
    }

    // Verifico la contraseña
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
    }

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        accountEnabled: user.accountEnabled,
        phone: user.phone,
        address: user.address
    };
}

export const validateUserData = (data) => {
    const errors = [];

    // Verifico si se recibió algún dato
    if (!data) {
        errors.push("No se proporcionó data del usuario");
        return { valid: false, errors };
    }

    // Validación del campo "fullName"
    if (typeof data.fullName !== 'string' || data.fullName.trim().length < 1) {
        errors.push('El campo "fullName" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "dateOfBirth" (formato DD-MM-YY)
    if (!data.dateOfBirth || typeof data.dateOfBirth !== 'string') {
        errors.push('El campo "dateOfBirth" es obligatorio');
    } else {
        // Validar formato básico de fecha (DD-MM-YY)
        const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.dateOfBirth)) {
            errors.push('El campo "dateOfBirth" debe tener formato DD-MM-YY (ej: 20-05-90)');
        }
    }

    // Validación del campo "email"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
        errors.push('El campo "email" es obligatorio y debe ser un email válido');
    }

    // Validación del campo "password"
    if (!data.password || typeof data.password !== 'string' || data.password.trim().length < 6) {
        errors.push('El campo "password" es obligatorio y debe tener al menos 6 caracteres');
    }

    // Validación del campo "accountEnabled" (booleano)
    if (data.accountEnabled !== undefined && typeof data.accountEnabled !== 'boolean') {
        errors.push('El campo "accountEnabled" debe ser un valor booleano (true/false)');
    }

    // Validación del campo "phone" (opcional)
    if (data.phone !== undefined && typeof data.phone !== 'string') {
        errors.push('El campo "phone" debe ser un string');
    }

    // Validación del campo "address" (opcional)
    if (data.address !== undefined && typeof data.address !== 'string') {
        errors.push('El campo "address" debe ser un string');
    }

    // Validación del campo "role"
    // const validRoles = ['user', 'admin'];
    // if (!data.role || typeof data.role !== 'string' || !validRoles.includes(data.role)) {
    //     errors.push(`El campo "role" es obligatorio y debe ser uno de: ${validRoles.join(', ')}`);
    // }

    return { valid: errors.length === 0, errors };
};

export const validateUserUpdateData = (data) => {
    const {
        fullName, dateOfBirth, email, password, accountEnabled,
        phone, address, role
    } = data;

    const errors = [];

    // Verificar que al menos un campo esté presente para actualizar
    if (fullName === undefined && dateOfBirth === undefined && email === undefined &&
        password === undefined && accountEnabled === undefined && phone === undefined &&
        address === undefined && role === undefined) {
        errors.push('Debes proporcionar al menos un campo para actualizar el usuario.');
        return { valid: false, message: 'Debes proporcionar al menos un campo para actualizar el usuario.' };
    }

    // --- Validación del campo "fullName" ---
    if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim().length < 1)) {
        errors.push('El campo "fullName" debe ser un string no vacío.');
    }

    // --- Validación del campo "dateOfBirth" ---
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
    if (dateOfBirth !== undefined && (typeof dateOfBirth !== 'string' || !dateRegex.test(dateOfBirth))) {
        errors.push('El campo "dateOfBirth" debe tener formato DD-MM-YY (ej: 20-05-90).');
    }

    // --- Validación del campo "email" ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== undefined && (typeof email !== 'string' || !emailRegex.test(email))) {
        errors.push('El campo "email" debe ser un email válido.');
    }

    // --- Validación del campo "password" ---
    if (password !== undefined && (typeof password !== 'string' || password.trim().length < 6)) {
        errors.push('El campo "password" debe tener al menos 6 caracteres.');
    }

    // --- Validación del campo "accountEnabled" ---
    if (accountEnabled !== undefined && typeof accountEnabled !== 'boolean') {
        errors.push('El campo "accountEnabled" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "phone" ---
    if (phone !== undefined && typeof phone !== 'string') {
        errors.push('El campo "phone" debe ser un string.');
    }

    // --- Validación del campo "address" ---
    if (address !== undefined && typeof address !== 'string') {
        errors.push('El campo "address" debe ser un string.');
    }

    // --- Validación del campo "role" ---
    const validRoles = ['user', 'admin'];
    if (role !== undefined && (typeof role !== 'string' || !validRoles.includes(role))) {
        errors.push(`El campo "role" debe ser uno de: ${validRoles.join(', ')}.`);
    }

    return { valid: errors.length === 0, errors };
};