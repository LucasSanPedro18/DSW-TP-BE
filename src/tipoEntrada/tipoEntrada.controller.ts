import { Request, Response, NextFunction } from 'express';
import { TipoEntrada } from './tipoEntrada.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizeTipoEntradaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    description: req.body.description,
    value: req.body.value,
    cupo: req.body.cupo,
    entradas: req.body.entradas,
    evento: req.body.evento,
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
    const tiposEntradas = await em.find(
      TipoEntrada,
      {},
      { populate: ['entradas'] }
    );
    res.status(200).json({ message: 'found all tipoEntradas', data: tiposEntradas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tipoEntrada = await em.findOneOrFail(
      TipoEntrada,
      { id },
      { populate: ['entradas'] }
    );
    res.status(200).json({ message: 'found tipoEntrada', data: tipoEntrada });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const tipoEntrada = em.create(TipoEntrada, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'tipoEntrada created', data: tipoEntrada });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tipoEntradaToUpdate = await em.findOneOrFail(TipoEntrada, { id });
    em.assign(tipoEntradaToUpdate, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: 'tipoEntrada updated', data: tipoEntradaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tipoEntrada = em.getReference(TipoEntrada, id);
    await em.removeAndFlush(tipoEntrada);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeTipoEntradaInput, findAll, findOne, add, update, remove };