import { Router } from 'express';
import multer from 'multer';
import { sanitizedEventoInput, findAll, findOne, add, update, remove } from './evento.controller.js';

export const eventoRouter = Router();

// Configura el almacenamiento para `multer`
const upload = multer({ dest: 'uploads/' }); // Puedes especificar un directorio para guardar archivos cargados

eventoRouter.get('/', findAll);
eventoRouter.get('/:id', findOne);
eventoRouter.post('/', upload.single('photo'), sanitizedEventoInput, add); // `upload.single('photo')` maneja el archivo
eventoRouter.put('/:id', upload.single('photo'), sanitizedEventoInput, update);
eventoRouter.patch('/:id', upload.single('photo'), sanitizedEventoInput, update);
eventoRouter.delete('/:id', remove);
