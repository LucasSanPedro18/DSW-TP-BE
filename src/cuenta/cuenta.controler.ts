import { Request, Response, NextFunction } from 'express'
import { cuentaRepository } from './cuenta.repository.js'
import { cuenta } from './cuenta.entity.js'

const repository = new cuentaRepository()

function sanitizedcuentaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    cuposGral: req.body.cuposGral,
    descripcion: req.body.descripcion,
    fotocuenta: req.body.fotocuenta,
    fecha: req.body.fecha,
    hora: req.body.hora,
    idcuenta : req.body.idcuenta,
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
  const cuenta = await repository.findOne({ id })
  if (!cuenta) {
    return res.status(404).send({ message: 'cuenta not found' })
  }
  res.json({ data: cuenta })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  const cuentaInput = new cuenta(
    input.idcuenta,
    input.mail,
    input.nombre,
    input.contraseña,
    input.descripcion,
    input.foto,
  )

  const nuevacuenta = await repository.add(cuentaInput)
  return res.status(201).send({ message: 'cuenta created', data: cuenta })
}

async function update(req: Request, res: Response) {
  const cuenta = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!cuenta) {
    return res.status(404).send({ message: 'cuenta not found' })
  }

  return res.status(200).send({ message: 'cuenta updated successfully', data: cuenta })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const cuenta = await repository.delete({ id })

  if (!cuenta) {
    res.status(404).send({ message: 'cuenta not found' })
  } else {
    res.status(200).send({ message: 'cuenta deleted successfully' })
  }
}

export { sanitizedcuentaInput, findAll, findOne, add, update, remove }