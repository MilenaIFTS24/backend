import jwt from "jsonwebtoken";
import { authenticateUser } from "./users.service.js";

export const authService = {
    login: async (email, password) => {

        const user = await authenticateUser(email, password);

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        }

        // Generar token
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
        return response;
    },

    verifyToken: (token) => {
        // Lógica para verificar token
        try {
            // Verificar y decodificar el token JWT
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // Si el token es inválido o expiró
            throw new Error('Token inválido');
        }
    },
};