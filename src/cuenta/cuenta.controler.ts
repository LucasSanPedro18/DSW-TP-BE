import { Request, Response, NextFunction } from 'express'
import { CuentaRepository } from './cuenta.repository.js'
import { Cuenta } from './cuenta.entity.js'

const repository = new CuentaRepository()

function sanitizedCuentaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    contraseña: req.body.contraseña,
    mail: req.body.mail,
    descripcion: req.body.descripcion,
    foto: req.body.foto,
    id : req.body.id,
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
    return res.status(404).send({ message: 'Error 404. Cuenta not found!' })
  }
  res.json({ data: cuenta })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  const cuentaInput = new Cuenta(
    input.nombre,
    input.contraseña,
    input.mail,
    input.descripcion,
    input.foto,
    input.id,
  )

  const nuevacuenta = await repository.add(cuentaInput)
  return res.status(201).send({ message: 'Cuenta created!', data: Cuenta })
}

async function update(req: Request, res: Response) {
  const cuenta = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!cuenta) {
    return res.status(404).send({ message: 'Error 404. Cuenta not found!' })
  }

  return res.status(200).send({ message: 'Cuenta updated successfully!', data: cuenta })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const cuenta = await repository.delete({ id })

  if (!cuenta) {
    res.status(404).send({ message: 'Error 404. Cuenta not found!' })
  } else {
    res.status(200).send({ message: 'Cuenta removed successfully!' })
  }
}

export { sanitizedCuentaInput, findAll, findOne, add, update, remove }