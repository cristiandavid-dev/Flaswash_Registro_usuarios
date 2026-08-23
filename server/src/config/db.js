import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Crear un pool de conexiones 
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión
try {
    const connection = await pool.getConnection();
    console.log(' Conectado exitosamente a la base de datos MySQL (Pool)');
    connection.release();
} catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
}

export default pool;
