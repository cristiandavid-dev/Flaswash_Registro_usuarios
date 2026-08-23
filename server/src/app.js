import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; 

const app = express();

// Middlewares esenciales
app.use(express.json());
app.use(cors()); 

// Registro de la ruta de autenticación
app.use('/api/auth', authRoutes); 

export default app;