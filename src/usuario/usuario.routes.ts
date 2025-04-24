import { Router } from 'express';
import {
  sanitizedUsuarioInput,
  register,
  login,
  findAll,
  findOne,
  update,
  remove,
  findEntradasByUsuario
} from './usuario.controller.js';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware.js';

const usuarioRouter = Router();

// Validaciones para registro
const registerValidation = [
  body('nickname').trim().notEmpty().withMessage('El nickname es requerido'),
  body('mail').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula'),
  body('DNI').notEmpty().withMessage('El DNI es requerido')
];

// Validaciones para actualización
const updateValidation = [
  body('nickname').optional().trim().notEmpty().withMessage('El nickname no puede estar vacío'),
  body('mail').optional().isEmail().withMessage('Email inválido'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula'),
  body('DNI').optional().notEmpty().withMessage('El DNI no puede estar vacío')
];

// Rutas públicas
usuarioRouter.post('/register', registerValidation, sanitizedUsuarioInput, register);
usuarioRouter.post('/login', login);

// Rutas protegidas
usuarioRouter.use(authMiddleware);
usuarioRouter.get('/', findAll);
usuarioRouter.get('/:DNI', findOne);
usuarioRouter.put('/update/:id', updateValidation, sanitizedUsuarioInput, update);
usuarioRouter.delete('/:DNI', remove);
usuarioRouter.get('/entradas/:DNI', findEntradasByUsuario);

export { usuarioRouter };
