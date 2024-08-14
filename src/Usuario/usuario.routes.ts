import { Router } from "express";
import { sanitizedUsuarioInput, findAll, findOne, add, update, remove } from "./usuario.controler.js";

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:idEvento', findOne)
usuarioRouter.post('/', sanitizedUsuarioInput, add)
usuarioRouter.put('/:idEvento', sanitizedUsuarioInput, update)
usuarioRouter.patch('/:idEvento', sanitizedUsuarioInput, update)
usuarioRouter.delete('/:idEvento', remove)