import { Router } from 'express'
import { sanitizedEventoInput, findAll, findOne, add, update, remove } from './evento.controler.js'

export const EventoRouter = Router()

EventoRouter.get('/', findAll)
EventoRouter.get('/:id', findOne)
EventoRouter.post('/', sanitizedEventoInput, add)
EventoRouter.put('/:id', sanitizedEventoInput, update)
EventoRouter.patch('/:id', sanitizedEventoInput, update)
EventoRouter.delete('/:id', remove)