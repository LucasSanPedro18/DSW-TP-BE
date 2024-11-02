import { Router } from 'express';
import {
  sanitizeTipoEntradaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './tipoEntrada.controller.js';

export const tipoEntradaRouter = Router();

tipoEntradaRouter.get('/', findAll);
tipoEntradaRouter.get('/:id', findOne);
tipoEntradaRouter.post('/', sanitizeTipoEntradaInput, add);
tipoEntradaRouter.put('/:id', sanitizeTipoEntradaInput, update);
tipoEntradaRouter.patch('/:id', sanitizeTipoEntradaInput, update);
tipoEntradaRouter.delete('/:id', remove);