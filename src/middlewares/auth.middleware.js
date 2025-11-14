import jwt from "jsonwebtoken";
import { log, logError } from "../utils/logger.utils.js";
export const auth = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Aca tomo authorization y divido el Bearer del Token

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            logError('Auth middleware', 'auth', err, 'Token inválido o expirado');
            return res.status(403).json({
                success: false,
                error: 'Token inválido o expirado'
            });
        }
        req.user = decoded;
        log('Auth middleware', 'auth', 'Token verificado exitosamente', req.user.email);
        next();
    });
};

export const requiresAdmin = (req, res, next) => {
    if (!req.user) {
        log('Auth middleware', 'requiresAdmin', 'Usuario no autenticado');
        return res.status(401).json({
            error: 'Usuario no autenticado'
        });
    }

    if (req.user.role !== "admin") {
        log('Auth middleware', 'requiresAdmin', 'Acceso denegado. Se requiere rol de administrador', req.user.role);
        return res.status(403).json({
            error: 'Acceso denegado. Se requiere rol de administrador'
        });
    }

    log('Auth middleware', 'requiresAdmin', 'Acceso concedido', req.user.role);
    next();
};