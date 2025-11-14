import { authService } from '../services/auth.service.js';
import { log, logError } from '../utils/logger.utils.js';
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            log('Controlador', 'login', 'Email y contraseña son requeridos');
            return res.status(400).json({
                error: 'Email y contraseña son requeridos'
            });
        }

        const result = await authService.login(email, password);

        log('Controlador', 'login', 'Usuario autenticado', result.user);
        return res.json({
            success: true,
            token: result.token,
            user: result.user
        });

    } catch (error) {        
        if (error.message === 'Credenciales inválidas') {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }
        
        logError('Controlador', 'login', error, 'Error interno del servidor');
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};