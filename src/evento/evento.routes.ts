import { Router } from "express";
import { sanitizedEventoInput, findAll, findOne, add, update, remove } from "./evento.controler.js";

export const eventoRouter = Router()

eventoRouter.get('/', findAll)
eventoRouter.get('/:idEvento', findOne)
eventoRouter.post('/', sanitizedEventoInput, add)
eventoRouter.put('/:idEvento', sanitizedEventoInput, update)
eventoRouter.patch('/:idEvento', sanitizedEventoInput, update)
eventoRouter.delete('/:idEvento', remove)