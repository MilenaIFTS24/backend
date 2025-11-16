import { logError } from "../utils/logger.utils.js";

export const notFoundHandler = (req, res, next) => {
    logError('Error middleware', 'notFoundHandler', 'Ruta no encontrada', req.url, 404);
    res.status(404).json({ error: "Ruta no encontrada" });
    next();
};

export const errorHandler = (err, req, res, next) => {
    logError('Error middleware', 'errorHandler', err,'Error interno del servidor', 500);
    res.status(500).json({ error: 'Error interno del servidor' });
};
