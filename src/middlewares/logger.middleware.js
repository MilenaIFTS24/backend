export const requestLogger = (req, res, next) => {
    console.log('🌐 [APP] URL recibida:', req.method, req.originalUrl);
    console.log('📝 [APP] Query params:', req.query);
    next();
};

export const simpleLogger = (message = 'Request recibida') => {
    return (req, res, next) => {
        console.log(`📋 [LOGGER] ${message}:`, req.method, req.url);
        next();
    };
};