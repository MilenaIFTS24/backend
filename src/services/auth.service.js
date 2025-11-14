import jwt from "jsonwebtoken";
import { authenticateUser } from "./users.service.js";
import { log, logError } from '../utils/logger.utils.js';

export const authService = {
    login: async (email, password) => {

        const user = await authenticateUser(email, password);

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        }

        // Genero el token
        const token = jwt.sign(payload, process.env.JWT_secret, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });

        const response = {
            success: true,
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                accountEnabled: user.accountEnabled,
                dateOfBirth: user.dateOfBirth,
                phone: user.phone,
                address: user.address
            }
        };
        log('Servicio', 'login', 'Usuario logueado exitosamente');
        return response;
    },

    verifyToken: (token) => {
        try {
            // Verifico el token
            log('Servicio', 'verifyToken', 'Token verificado exitosamente');
            return jwt.verify(token, process.env.JWT_secret);
        } catch (error) {
            // Si el token es inválido o expiró
            logError('Servicio', 'verifyToken', error, 'Token inválido');
            throw new Error('Token inválido');
        }
    },
};