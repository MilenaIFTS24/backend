export const requestLogger = (req, res, next) => {
    console.log('Logger middleware --> URL recibida:', req.method, req.originalUrl);
    console.log('Logger middleware --> Query params:', req.query);
    next();
};