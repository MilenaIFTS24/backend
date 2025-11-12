import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    console.log(req.headers);

    const token = req.headers["authorization"]?.split(" ")[1]; // Aca tomo authorization y divido el Bearer del Token

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Auth middleware --> Token inválido:', err.message);
            return res.status(403).json({
                success: false,
                error: 'Token inválido o expirado'
            });
        }
        req.user = decoded;
        console.log('Auth middleware --> Usuario autenticado:', req.user.email)
        next();
    });


};

export const requiresAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Usuario no autenticado'
        });
    }

    if (req.user.role !== "admin") {
        console.warn(`Auth middleware --> Intento de acceso no autorizado. Usuario: ${req.user.email}, Rol: ${req.user.role}`);
        return res.status(403).json({
            error: 'Acceso denegado. Se requiere rol de administrador'
        });
    }

    console.log(`Auth middleware --> Acceso admin autorizado para: ${req.user.email}`);
    next();
};