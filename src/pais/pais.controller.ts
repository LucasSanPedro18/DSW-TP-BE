import { Request, Response, NextFunction } from 'express'
import { Pais } from './pais.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizePaisInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    localidades: req.body.localidad
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
    const paises = await em.find(
      Pais,
      {},
      { populate: ['localidades'] }
    )
    res.status(200).json({ message: 'found all paises', data: paises })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const pais = await em.findOneOrFail(
      Pais,
      { id },
      { populate: ['localidades'] }
    )
    res.status(200).json({ message: 'found pais', data: pais })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const pais = em.create(Pais, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'pais created', data: pais })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const paisToUpdate = await em.findOneOrFail(Pais, { id })
    em.assign(paisToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'pais updated', data: paisToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const pais = em.getReference(Pais, id)
    await em.removeAndFlush(pais)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizePaisInput, findAll, findOne, add, update, remove }