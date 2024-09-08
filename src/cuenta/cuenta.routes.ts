import { Router } from 'express'
import { sanitizedcuentaInput, findAll, findOne, add, update, remove } from './cuenta.controler.js'

export const cuentaRouter = Router()

cuentaRouter.get('/', findAll)
cuentaRouter.get('/:id', findOne)
cuentaRouter.post('/', sanitizedcuentaInput, add)
cuentaRouter.put('/:id', sanitizedcuentaInput, update)
cuentaRouter.patch('/:id', sanitizedcuentaInput, update)
cuentaRouter.delete('/:id', remove)