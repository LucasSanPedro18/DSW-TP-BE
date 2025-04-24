// src/server.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { eventoRouter } from './evento/evento.routes.js';
import { tipoEntradaRouter } from './tipoEntrada/tipoEntrada.routes.js';
import { organizadorRouter } from './organizador/organizador.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { entradaRouter } from './entrada/entrada.routes.js';
import { categoriaRouter } from './categoria/categoria.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
const app = express();
// Middleware de seguridad
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Sirve archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', (req, res, next) => {
    console.log(`Intentando servir: ${path.join(__dirname, 'uploads', req.path)}`);
    next();
}, express.static(path.join(__dirname, 'uploads')));
// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['set-cookie']
}));
// Creación del contexto para la base de datos
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
// Rate limiting para prevenir ataques de fuerza bruta
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // límite de 5 intentos por ventana por IP
    message: 'Demasiados intentos de inicio de sesión, por favor intente nuevamente después de 15 minutos'
});
// Aplicar rate limiting solo a las rutas de login
app.use('/api/usuarios/login', loginLimiter);
// Rutas de la API
app.use('/api/entrada', entradaRouter);
app.use('/api/eventos', eventoRouter);
app.use('/api/tiposEntradas', tipoEntradaRouter);
app.use('/api/organizadores', organizadorRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/categorias', categoriaRouter);
// Ruta para manejar recursos no encontrados
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
await syncSchema(); // Esta línea no debe usarse en producción
// Arrancar el servidor
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000/');
});
//# sourceMappingURL=app.js.map