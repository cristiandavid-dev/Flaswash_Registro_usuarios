import jwt from 'jsonwebtoken'; // Importamos jsonwebtoken para verificar tokens

export const verificarAutenticacion = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Verificamos que el encabezado de autorización esté presente y tenga el formato correcto
    // Si no hay encabezado o no comienza con 'Bearer ', retornamos un error 401
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acceso denegado. Encabezado de autorización ausente o mal formado.'
        });
    }

    // Separar el token del encabezado de autorización
    const token = authHeader.split(' ')[1];

    try {
        // Validamos el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next(); // Enviamos al siguiente middleware o ruta

    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};