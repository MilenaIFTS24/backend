export const notFoundHandler = (req, res, next) => {
    res.status(404).json({ error: "Ruta no encontrada" });
    next();
};

export const errorHandler = (err, req, res, next) => {
    console.error('Error middleware --> Error: ', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
};