import * as usuarioService from '../services/usuarioServices.js';

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuariosService();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener los usuarios."
        });
    }
};

export const registrarUsuario = async (req, res) => {
    try {

        const {
            nombre,
            usuario,
            email,
            telefono,
            password
        } = req.body;

        // Validación
        if (!nombre || !usuario || !email || !password) {
            return res.status(400).json({
                mensaje: "Los campos nombre, usuario, email y password son obligatorios."
            });
        }

        // Verificar si el correo ya existe
        const existeCorreo = await usuarioService.buscarCorreoService(email);

        if (existeCorreo) {
            return res.status(400).json({
                mensaje: "El correo electrónico ya está registrado."
            });
        }

        // Registrar usuario
        const resultado = await usuarioService.registrarUsuarioService({
            nombre,
            usuario,
            email,
            telefono,
            password
        });

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            usuario: {
                id: resultado.insertId,
                nombre,
                usuario,
                email,
                telefono
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }
};