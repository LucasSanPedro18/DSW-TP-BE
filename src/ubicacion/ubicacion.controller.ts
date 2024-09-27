import { Request, Response, NextFunction } from 'express'
import { Ubicacion } from './ubicacion.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizedUbicacionInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    maxCap: req.body.maxCap,
    address: req.body.address,
    locationPhoto: req.body.locationPhoto,
    mapHyperlink: req.body.mapHyperlink,
    organizador: req.body.organizador,
    localidad: req.body.localidad,
    eventos: req.body.evento
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
    const ubicaciones = await em.find(
      Ubicacion,
      {},
      { populate: ['localidad', 'organizador', 'eventos'] }
    )
    res.status(200).json({ message: 'found all ubicaciones', data: ubicaciones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const ubicacion = await em.findOneOrFail(
      Ubicacion,
      { id },
      { populate: ['localidad', 'organizador', 'eventos'] }
    )
    res.status(200).json({ message: 'found ubicacion', data: ubicacion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const ubicacion = em.create(Ubicacion, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'ubicacion created', data: ubicacion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const ubicacionToUpdate = await em.findOneOrFail(Ubicacion, { id })
    em.assign(ubicacionToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'ubicacion updated', data: ubicacionToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const ubicacion = em.getReference(Ubicacion, id)
    await em.removeAndFlush(ubicacion)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedUbicacionInput, findAll, findOne, add, update, remove }