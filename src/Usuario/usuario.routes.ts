import { Router } from 'express'
import { sanitizedusuarioInput, findAll, findOne, add, update, remove } from './usuario.controler.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/', sanitizedusuarioInput, add)
usuarioRouter.put('/:id', sanitizedusuarioInput, update)
usuarioRouter.patch('/:id', sanitizedusuarioInput, update)
usuarioRouter.delete('/:id', remove)