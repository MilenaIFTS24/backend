import * as model from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { log } from '../utils/logger.utils.js';

export const getAllUsers = async () => {
    log('Servicio', 'getAllUsers', 'Usuarios enviados');
    return await model.getAllUsers();
};

export const getUserById = async (id) => {
    const user = await model.getUserById(id);
    if (!user) {
        log('Servicio', 'getUserById', 'Usuario no encontrado');
        throw new Error('Usuario no encontrado');
    }

    log('Servicio', 'getUserById', 'Usuario enviado');
    return user;
}

export const getUserByEmail = async (email) => {
    const user = await model.getUserByEmail(email);
    if (!user) {
        log('Servicio', 'getUserByEmail', 'Usuario no encontrado');
        throw new Error('Usuario no encontrado');
    }

    log('Servicio', 'getUserByEmail', 'Usuario enviado');
    return user;
};

export const searchUserByFullName = async (fullName) => {
    const users = await model.getAllUsers();

    if (!Array.isArray(users)) {
        log('Servicio', 'searchUserByFullName', 'Error interno al obtener usuarios');
        throw new Error('Error interno al obtener usuarios');
    }

    const filteredUsers = users.filter((user) =>
        typeof user.fullName === 'string' &&
        user.fullName.toLowerCase().includes(fullName.toLowerCase().trim())
    );

    if (filteredUsers.length === 0) {
        log('Servicio', 'searchUserByFullName', 'No se encontraron usuarios con ese nombre');
        throw new Error('No se encontraron usuarios con ese nombre');
    }

    log('Servicio', 'searchUserByFullName', 'Usuario/s enviados');
    return filteredUsers;
};

export const createUser = async (data) => {

    const existingUser = await model.getUserByEmail(data.email);

    if (existingUser) {
        log('Servicio', 'createUser', 'El email ya esta registrado');
        throw new Error('El email ya está registrado');
    }

    log('Servicio', 'createUser', 'Enviado');
    return await model.createUser(data);
};

export const updateUser = async (id, updateData) => {
    const existingUser = await model.getUserById(id);
    if (!existingUser) {
        log('Servicio', 'updateUser', 'Usuario no encontrado');
        throw new Error('Usuario no encontrado');
    }

    // Valido que el email no se repita
    if (updateData.email && updateData.email !== existingUser.email) {
        const userWithEmail = await model.getUserByEmail(updateData.email);
        if (userWithEmail && userWithEmail.id !== id) {
            log('Servicio', 'updateUser', 'El email ya esta registrado por otro usuario');
            throw new Error('El email ya está registrado por otro usuario');
        }
    }

    log('Servicio', 'updateUser', 'Enviado');
    return await model.updateUser(id, updateData);
};

export const deleteUser = async (id) => {
    const userToDelete = await model.getUserById(id);
    if (!userToDelete) {
        log('Servicio', 'deleteUser', 'Usuario no encontrado');
        throw new Error('Usuario no encontrado');
    }

    log('Servicio', 'deleteUser', 'Enviado');
    return await model.deleteUser(id);
};

export const verifyPassword = async (plainPassword, hashedPassword) => { //Verifico la contraseña 
    log('Servicio', 'verifyPassword', 'Verificando contraseña...');
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export const authenticateUser = async (email, password) => { //Verifico credenciales y/o estado de la cuenta
    const user = await model.getUserByEmail(email);

    if (!user) {
        log('Servicio', 'authenticateUser', 'Credenciales inválidas');
        throw new Error('Credenciales inválidas');
    }

    //Verifico que la cuenta esté activa
    if (user.accountEnabled === false) {
        log('Servicio', 'authenticateUser', 'La cuenta está desactivada');
        throw new Error('La cuenta está desactivada');
    }

    // Verifico la contraseña
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
        log('Servicio', 'authenticateUser', 'Contraseña inválida');
        throw new Error('Contraseña inválida');
    }

    log('Servicio', 'authenticateUser', 'Usuario autenticado');
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
};

export const validateUserData = (data) => {
    const errors = [];

    log('Servicio', 'validateUserData', 'Validando datos del usuario...');
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
    const cleanData = {};
    const errors = [];

    log('Servicio', 'validateUserUpdateData', 'Validando datos para actualizar el usuario...');
    // Filtro solo campos definidos - Firestore no acepta campos undefined
    if (data.fullName !== undefined) cleanData.fullName = data.fullName;
    if (data.dateOfBirth !== undefined) cleanData.dateOfBirth = data.dateOfBirth;
    if (data.email !== undefined) cleanData.email = data.email;
    if (data.password !== undefined) cleanData.password = data.password;
    if (data.accountEnabled !== undefined) cleanData.accountEnabled = data.accountEnabled;
    if (data.phone !== undefined) cleanData.phone = data.phone;
    if (data.address !== undefined) cleanData.address = data.address;
    if (data.role !== undefined) cleanData.role = data.role;

    // Valido que al menos un campo esté presente 
    let hasFields = false;
    if (cleanData.fullName) hasFields = true;
    else if (cleanData.dateOfBirth) hasFields = true;
    else if (cleanData.email) hasFields = true;
    else if (cleanData.password) hasFields = true;
    else if (cleanData.accountEnabled !== undefined) hasFields = true;
    else if (cleanData.phone) hasFields = true;
    else if (cleanData.address) hasFields = true;
    else if (cleanData.role) hasFields = true;

    if (!hasFields) {
        errors.push('Debes proporcionar al menos un campo para actualizar el usuario.');
        return { valid: false, errors, cleanData: {} };
    }

    // --- Validaciones de cada campo (solo si están presentes) ---
    if (cleanData.fullName && (typeof cleanData.fullName !== 'string' || cleanData.fullName.trim().length < 1)) {
        errors.push('El campo "fullName" debe ser un string no vacío.');
    }

    const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
    if (cleanData.dateOfBirth && (typeof cleanData.dateOfBirth !== 'string' || !dateRegex.test(cleanData.dateOfBirth))) {
        errors.push('El campo "dateOfBirth" debe tener formato DD-MM-YY.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanData.email && (typeof cleanData.email !== 'string' || !emailRegex.test(cleanData.email))) {
        errors.push('El campo "email" debe ser un email válido.');
    }

    if (cleanData.password && (typeof cleanData.password !== 'string' || cleanData.password.trim().length < 6)) {
        errors.push('El campo "password" debe tener al menos 6 caracteres.');
    }

    if (cleanData.accountEnabled !== undefined && typeof cleanData.accountEnabled !== 'boolean') {
        errors.push('El campo "accountEnabled" debe ser un valor booleano.');
    }

    if (cleanData.phone && typeof cleanData.phone !== 'string') {
        errors.push('El campo "phone" debe ser un string.');
    }

    if (cleanData.address && typeof cleanData.address !== 'string') {
        errors.push('El campo "address" debe ser un string.');
    }

    const validRoles = ['user', 'admin'];
    if (cleanData.role && (typeof cleanData.role !== 'string' || !validRoles.includes(cleanData.role))) {
        errors.push('El campo "role" debe ser "user" o "admin".');
    }

    return { valid: errors.length === 0, errors, cleanData };
};