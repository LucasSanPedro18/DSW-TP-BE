import { Router } from 'express';
import multer from 'multer';  // Importación de multer directamente
import { sanitizedEventoInput, findAll, findOne, add, update, remove } from './evento.controller.js';
import upload from '../multer.js';  // Importar el middleware de multer desde el archivo 'multer.ts'

export const eventoRouter = Router();

// Aquí ya no es necesario redefinir `upload`, solo debes usar el middleware importado
eventoRouter.get('/', findAll);
eventoRouter.get('/:id', findOne);
eventoRouter.post('/', upload.single('photo'), sanitizedEventoInput, add); // `upload.single('photo')` maneja el archivo
eventoRouter.put('/:id', upload.single('photo'), sanitizedEventoInput, update);
eventoRouter.patch('/:id', upload.single('photo'), sanitizedEventoInput, update);
eventoRouter.delete('/:id', remove);
