import { Request, Response, NextFunction } from 'express'
import { Evento } from './evento.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizedEventoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    cupos: req.body.cupos,
    descrption: req.body.photo,
    date: req.body.date,
    entradas: req.body.entradas,
    tiposEntrada: req.body.tiposEntrada,
    categoria: req.body.categoria,
    ubicacion: req.body.ubicacion,
    organizador: req.body.organizador,
    usuarios: req.body.usuarios,
  
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
  try {
    const eventos = await em.find(
      Evento,
      {},
      { populate: ['entradas', 'tiposEntrada', 'categoria', 'ubicacion', 'organizador', 'usuarios'] }
    )
    res.status(200).json({ message: 'found all events', data: eventos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const evento = await em.findOneOrFail(
      Evento,
      { id },
      { populate: ['entradas', 'tiposEntrada', 'categoria', 'ubicacion', 'organizador', 'usuarios'] }
    )
    res.status(200).json({ message: 'found evento', data: evento })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const evento = em.create(Evento, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'evento created', data: evento })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const eventoToUpdate = await em.findOneOrFail(Evento, { id })
    em.assign(eventoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'evento updated', data: eventoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const evento = em.getReference(Evento, id)
    await em.removeAndFlush(evento)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedEventoInput, findAll, findOne, add, update, remove }