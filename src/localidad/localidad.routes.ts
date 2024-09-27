import { Router } from 'express';
import {
  sanitizedLocalidadInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './localidad.controller.js';

export const localidadRouter = Router();

localidadRouter.get('/', findAll);
localidadRouter.get('/:id', findOne);
localidadRouter.post('/', sanitizedLocalidadInput, add);
localidadRouter.put('/:id', sanitizedLocalidadInput, update);
localidadRouter.patch('/:id', sanitizedLocalidadInput, update);
localidadRouter.delete('/:id', remove);