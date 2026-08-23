import { pool } from '../config/db.js';

// Función para validar las credenciales del usuario
export const validarCredenciales = async (email, password) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return { exito: false, mensaje: 'Usuario no encontrado' };
        }

        const usuario = rows[0];

        if (usuario.password !== password) {
            return { exito: false, mensaje: 'Contraseña incorrecta' };
        }

        return {
            exito: true,
            usuario: {
                id: usuario.id || usuario.idUsuario,
                nombre: usuario.nombre,
                email: usuario.email
            }
        };
    } catch (error) {
        console.error("Error en authServices:", error);
        return { exito: false, mensaje: 'Error en la base de datos' };
    }
};