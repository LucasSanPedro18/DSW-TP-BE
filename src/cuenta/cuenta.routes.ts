import { Router } from "express";
import { sanitizedCuentaInput, findAll, findOne, add, update, remove } from "./cuenta.controler.js";

export const cuentaRouter = Router()

cuentaRouter.get('/', findAll)
cuentaRouter.get('/:id', findOne)
cuentaRouter.post('/', sanitizedCuentaInput, add)
cuentaRouter.put('/:id', sanitizedCuentaInput, update)
cuentaRouter.patch('/:id', sanitizedCuentaInput, update)
cuentaRouter.delete('/:id', remove)