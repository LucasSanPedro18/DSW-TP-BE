import { Router } from 'express';
import {
  sanitizedEntradaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './entrada.controller.js';

export const entradaRouter = Router();

entradaRouter.get('/', findAll);
entradaRouter.get('/:id', findOne);
entradaRouter.post('/', sanitizedEntradaInput, add);
entradaRouter.put('/:id', sanitizedEntradaInput, update);
entradaRouter.patch('/:id', sanitizedEntradaInput, update);
entradaRouter.delete('/:id', remove);
