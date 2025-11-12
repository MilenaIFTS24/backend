import { authService } from '../services/auth.service.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son requeridos'
            });
        }

        const result = await authService.login(email, password);

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

        console.error('Error en login:', error);
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};