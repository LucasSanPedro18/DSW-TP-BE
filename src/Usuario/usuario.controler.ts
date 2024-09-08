import { Request, Response, NextFunction } from 'express'
import { usuario } from './usuario.entity.js'
import { usuarioRepository } from './usuario.repository.js'


const repository = new usuarioRepository()

function sanitizedusuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    cuposGral: req.body.cuposGral,
    descripcion: req.body.descripcion,
    fotousuario: req.body.fotousuario,
    fecha: req.body.fecha,
    hora: req.body.hora,
    idusuario : req.body.idusuario,
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
  const usuario = await repository.findOne({ id })
  if (!usuario) {
    return res.status(404).send({ message: 'usuario not found' })
  }
  res.json({ data: usuario })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const usuarioInput = new usuario(
    input.DNI,
    input.fotoDni1,
    input.fotoDni2,
  )

  const nuevousuario = await repository.add(usuarioInput)
  return res.status(201).send({ message: 'usuario created', data: usuario })
}

async function update(req: Request, res: Response) {
  const usuario = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!usuario) {
    return res.status(404).send({ message: 'usuario not found' })
  }

  return res.status(200).send({ message: 'usuario updated successfully', data: usuario })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const usuario = await repository.delete({ id })

  if (!usuario) {
    res.status(404).send({ message: 'usuario not found' })
  } else {
    res.status(200).send({ message: 'usuario deleted successfully' })
  }
}

export { sanitizedusuarioInput, findAll, findOne, add, update, remove }