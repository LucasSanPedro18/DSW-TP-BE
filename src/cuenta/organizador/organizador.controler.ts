import { Request, Response, NextFunction } from 'express'
import { organizador } from './organizador.entity.js'
import { organizadorRepository } from './organizador.repository.js'


const repository = new organizadorRepository()

function sanitizedorganizadorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    CUIT: req.body.CUIT,
    calificacion: req.body.calificacion,
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() })
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id
  const organizador = await repository.findOne({ id })
  if (!organizador) {
    return res.status(404).send({ message: 'organizador not found' })
  }
  res.json({ data: organizador })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const organizadorInput = new organizador(
    input.CUIT,
    input.calificacion,
  )

  const nuevoorganizador = await repository.add(organizadorInput)
  return res.status(201).send({ message: 'organizador created', data: organizador })
}

async function update(req: Request, res: Response) {
  const organizador = await repository.update(req.params.CUIT, req.body.sanitizedInput)

  if (!organizador) {
    return res.status(404).send({ message: 'organizador not found' })
  }

  return res.status(200).send({ message: 'organizador updated successfully', data: organizador })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const organizador = await repository.delete({ id })

  if (!organizador) {
    res.status(404).send({ message: 'organizador not found' })
  } else {
    res.status(200).send({ message: 'organizador deleted successfully' })
  }
}

export { sanitizedorganizadorInput, findAll, findOne, add, update, remove }