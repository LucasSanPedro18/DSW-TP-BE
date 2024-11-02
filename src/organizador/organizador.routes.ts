import { Router } from 'express';
import {
  sanitizedOrganizadorInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './organizador.controller.js';

export const organizadorRouter = Router();

organizadorRouter.get('/', findAll);
organizadorRouter.get('/:id', findOne);
organizadorRouter.post('/', sanitizedOrganizadorInput, add);
organizadorRouter.put('/:id', sanitizedOrganizadorInput, update);
organizadorRouter.patch('/:id', sanitizedOrganizadorInput, update);
organizadorRouter.delete('/:id', remove);
