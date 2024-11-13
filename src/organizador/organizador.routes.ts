import { Router } from 'express';
import {
  sanitizedOrganizadorInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  login,
  register,
  findEventosByOrganizador,
} from './organizador.controller.js';

export const organizadorRouter = Router();

organizadorRouter.get('/', findAll);
organizadorRouter.get('/:id', findOne);
organizadorRouter.post('/', sanitizedOrganizadorInput, add);
organizadorRouter.put('/update/:id', sanitizedOrganizadorInput, update);
// organizadorRouter.patch('/:id', sanitizedOrganizadorInput, update);
organizadorRouter.delete('/:id', remove);
organizadorRouter.post('/login', login);
organizadorRouter.post('/register', register);
organizadorRouter.get('/:id/eventos', findEventosByOrganizador); // Nueva ruta para obtener eventos
