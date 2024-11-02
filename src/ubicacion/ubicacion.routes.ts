import { Router } from 'express';
import {
  sanitizedUbicacionInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './ubicacion.controller.js';

export const ubicacionRouter = Router();

ubicacionRouter.get('/', findAll);
ubicacionRouter.get('/:id', findOne);
ubicacionRouter.post('/', sanitizedUbicacionInput, add);
ubicacionRouter.put('/:id', sanitizedUbicacionInput, update);
ubicacionRouter.patch('/:id', sanitizedUbicacionInput, update);
ubicacionRouter.delete('/:id', remove);