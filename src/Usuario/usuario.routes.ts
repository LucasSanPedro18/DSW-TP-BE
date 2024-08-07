import { Router } from "express";
import { sanitizedUsuarioInput, findAll, findOne, add, update, remove } from "./usuario.controler.js";

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/', sanitizedUsuarioInput, add)
usuarioRouter.put('/:id', sanitizedUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizedUsuarioInput, update)
usuarioRouter.delete('/:id', remove)