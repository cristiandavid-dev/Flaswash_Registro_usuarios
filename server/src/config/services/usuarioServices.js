import { pool } from '../db.js';

// Servicio para obtener todos los usuarios (Método GET)
export const obtenerUsuariosService = async () => {
    const [rows] = await pool.query('SELECT id, nombre, usuario, email, telefono FROM usuarios');
    return rows;
};

// Servicio para buscar un usuario por su correo y evitar duplicados
export const buscarCorreoService = async (email) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
};

// Servicio para registrar un nuevo usuario en la base de datos (Método POST)
export const registrarUsuarioService = async (datosUsuario) => {
    const { nombre, usuario, email, telefono, password } = datosUsuario;
    
    const query = 'INSERT INTO usuarios (nombre, usuario, email, telefono, password) VALUES (?, ?, ?, ?, ?)';
    
    const [result] = await pool.query(query, [nombre, usuario, email, telefono, password]);
    
    return result;
};