import { Router } from 'express';
// 1. Importar controlador 
import * as authController from '../controllers/authController.js';

// 2. Importamos el middleware de Autentificación
import { verificarAutenticacion } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta PUBLICA (No lleva middleware porque el usuario apenas va a iniciar sesión)
router.post('/login', authController.login);

// Ruta PROTEGIDA (Lleva el middleware en el medio)
// Si el token es válido, pasa; si no, rebota con error.
router.get('/perfil', verificarAutenticacion, (req, res) => {
    res.json({
        mensaje: '¡Acceso concedido! Tienes un token válido.',
        usuarioAutenticado: req.usuario
    });
});

export default router;