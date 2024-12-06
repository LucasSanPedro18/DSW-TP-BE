import { Router } from 'express';
import {
  sanitizedUsuarioInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  login,
  register,
  findEntradasByUsuario,
} from './usuario.controller.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', findOne);
usuarioRouter.post('/', sanitizedUsuarioInput, add);
usuarioRouter.put('/update/:id', sanitizedUsuarioInput, update);
//usuarioRouter.patch('/:id', sanitizedUsuarioInput, update);
usuarioRouter.delete('/:id', remove);
usuarioRouter.post('/login', login);
usuarioRouter.post('/register', register);
usuarioRouter.get('/:id/entradas', findEntradasByUsuario);  // Aquí se obtiene las entradas por el id del usuario
