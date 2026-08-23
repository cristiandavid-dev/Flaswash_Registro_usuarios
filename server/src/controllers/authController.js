import jwt from 'jsonwebtoken';
import * as authService from '../services/authServices.js';

// Controlador para el método POST de Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validamos que se proporcionen email y contraseña
    if (!email || !password) {
        return res.status(400).json({ error: 'Debes proporcionar email y contraseña' });
    }

    try {
        const resultado = await authService.validarCredenciales(email, password);

        if (!resultado.exito) {
            return res.status(401).json({ error: resultado.mensaje });
        }

        // Generamos el Token JWT firmado
        const token = jwt.sign(
            { id: resultado.usuario.id, email: resultado.usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Retornamos la respuesta exitosa con el token y los datos del usuario (sin la contraseña)
        return res.json({
            exito: true,
            mensaje: '¡Autenticación exitosa!',
            token: token,
            usuario: resultado.usuario
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};