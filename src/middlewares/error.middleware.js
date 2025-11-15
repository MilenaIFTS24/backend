import { logError } from "../utils/logger.utils.js";

export const notFoundHandler = (req, res, next) => {
    logError('Error middleware', 'notFoundHandler', 'Ruta no encontrada', 404, req.url);
    res.status(404).json({ error: "Ruta no encontrada" });
    next();
};

export const errorHandler = (err, req, res, next) => {
    logError('Error middleware', 'errorHandler', err, 500,'Error interno del servidor');
    res.status(500).json({ error: 'Error interno del servidor' });
};
