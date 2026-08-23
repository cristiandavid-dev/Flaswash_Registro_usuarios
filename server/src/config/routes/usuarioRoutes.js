import { Router } from 'express';
import { obtenerUsuarios, registrarUsuario } from '../controllers/usuarioController.js';

const router = Router();

// Definimos los endpoints apuntando a sus controladores correspondientes
router.get('/', obtenerUsuarios);
router.post('/', registrarUsuario);

export default router;