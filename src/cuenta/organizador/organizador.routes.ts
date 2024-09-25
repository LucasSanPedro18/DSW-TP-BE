import { Router } from 'express'
import { sanitizedorganizadorInput, findAll, findOne, add, update, remove } from './organizador.controler.js'

export const organizadorRouter = Router()

organizadorRouter.get('/', findAll)
organizadorRouter.get('/:id', findOne)
organizadorRouter.post('/', sanitizedorganizadorInput, add)
organizadorRouter.put('/:id', sanitizedorganizadorInput, update)
organizadorRouter.patch('/:id', sanitizedorganizadorInput, update)
organizadorRouter.delete('/:id', remove)