import { Request, Response, NextFunction } from 'express';
import { Cuenta } from './cuenta.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizeCuentaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    id: req.body.id,
    nickname: req.body.nickname,
    password: req.body.password,
    mail: req.body.mail,
    description: req.body.description,
    photo: req.body.photo,
  };
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const cuentas = await em.find(
      Cuenta,
      {},
    );
    res.status(200).json({ message: 'found all Cuentas', data: cuentas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const cuenta = await em.findOneOrFail(
      Cuenta,
      { id },
    );
    res.status(200).json({ message: 'found Cuenta', data: cuenta });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cuenta = em.create(Cuenta, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Cuenta created', data: cuenta });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const cuentaToUpdate = await em.findOneOrFail(Cuenta, { id });
    em.assign(cuentaToUpdate, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: 'Cuenta updated', data: cuentaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const cuenta = em.getReference(Cuenta, id);
    await em.removeAndFlush(cuenta);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeCuentaInput, findAll, findOne, add, update, remove };
