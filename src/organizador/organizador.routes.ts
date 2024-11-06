import { Router } from 'express';
import {
  sanitizedOrganizadorInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './organizador.controller';

export const organizadorRouter = Router();

organizadorRouter.get('/', findAll);
organizadorRouter.get('/:id', findOne);
organizadorRouter.post('/add', sanitizedOrganizadorInput, add);  // Ruta para registrar organizador
organizadorRouter.put('/:id', sanitizedOrganizadorInput, update);
organizadorRouter.patch('/:id', sanitizedOrganizadorInput, update);
organizadorRouter.delete('/:id', remove);
