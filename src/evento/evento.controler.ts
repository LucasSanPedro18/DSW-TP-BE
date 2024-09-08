import { Request, Response, NextFunction } from 'express'
import { evento } from './evento.entity.js'
import { eventoRepository } from './evento.repository.js'


const repository = new eventoRepository()

function sanitizedEventoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    cuposGral: req.body.cuposGral,
    descripcion: req.body.descripcion,
    fotoEvento: req.body.fotoEvento,
    fecha: req.body.fecha,
    hora: req.body.hora,
    idEvento : req.body.idEvento,
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
  const evento = await repository.findOne({ id })
  if (!evento) {
    return res.status(404).send({ message: 'evento not found' })
  }
  res.json({ data: evento })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const eventoInput = new evento(
    input.nombre,
    input.cuposGral,
    input.descripcion,
    input.fotoEvento,
    input.fecha,
    input.hora,
    input.idEvento
  )

  const nuevoevento = await repository.add(eventoInput)
  return res.status(201).send({ message: 'evento created', data: evento })
}

async function update(req: Request, res: Response) {
  const evento = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!evento) {
    return res.status(404).send({ message: 'evento not found' })
  }

  return res.status(200).send({ message: 'evento updated successfully', data: evento })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const evento = await repository.delete({ id })

  if (!evento) {
    res.status(404).send({ message: 'evento not found' })
  } else {
    res.status(200).send({ message: 'evento deleted successfully' })
  }
}

export { sanitizedEventoInput, findAll, findOne, add, update, remove }