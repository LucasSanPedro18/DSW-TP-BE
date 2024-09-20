import { Router } from 'express'
import { sanitizedCuentaInput, findAll, findOne, add, update, remove } from './cuenta.controler.js'

export const CuentaRouter = Router()

CuentaRouter.get('/', findAll)
CuentaRouter.get('/:id', findOne)
CuentaRouter.post('/', sanitizedCuentaInput, add)
CuentaRouter.put('/:id', sanitizedCuentaInput, update)
CuentaRouter.patch('/:id', sanitizedCuentaInput, update)
CuentaRouter.delete('/:id', remove)