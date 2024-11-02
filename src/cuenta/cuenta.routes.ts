import { Router } from 'express';
import {
  sanitizeCuentaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './cuenta.controller.js';

export const cuentaRouter = Router();

cuentaRouter.get('/', findAll);
cuentaRouter.get('/:id', findOne);
cuentaRouter.post('/', sanitizeCuentaInput, add);
cuentaRouter.put('/:id', sanitizeCuentaInput, update);
cuentaRouter.patch('/:id', sanitizeCuentaInput, update);
cuentaRouter.delete('/:id', remove);
