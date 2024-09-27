import { Request, Response, NextFunction } from 'express'
import { Categoria } from './categoria.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizedCategoriaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    eventos: req.body.eventos,
  
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
    const categorias = await em.find(
      Categoria,
      {},
      { populate: ['eventos'] }
    )
    res.status(200).json({ message: 'found all categorias', data: categorias })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entrada = await em.findOneOrFail(
      Categoria,
      { id },
      { populate: ['eventos'] }
    )
    res.status(200).json({ message: 'found entrada', data: entrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const entrada = em.create(Categoria, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'entrada created', data: entrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entradaToUpdate = await em.findOneOrFail(Categoria, { id })
    em.assign(entradaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'entrada updated', data: entradaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entrada = em.getReference(Categoria, id)
    await em.removeAndFlush(entrada)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedCategoriaInput, findAll, findOne, add, update, remove }