import { Request, Response, NextFunction } from 'express';
import { Organizador } from './organizador.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizedOrganizadorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    CUIT: req.body.CUIT,
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
    const organizadores = await em.find(
      Organizador,
      {},
      { populate: ['eventos'] }
    );
    res.status(200).json({ message: 'found all organizadores', data: organizadores });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const CUIT = Number.parseInt(req.params.CUIT);
    const organizador = await em.findOneOrFail(
      Organizador,
      { CUIT },
      { populate: ['eventos'] }
    );
    res.status(200).json({ message: 'found Organizador', data: organizador });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const organizador = em.create(Organizador, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Organizador created', data: organizador });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const CUIT = Number.parseInt(req.params.CUIT);
    const organizadorToUpdate = await em.findOneOrFail(Organizador, { CUIT });
    em.assign(organizadorToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Organizador updated', data: organizadorToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const CUIT = Number.parseInt(req.params.CUIT);
    const organizador = em.getReference(Organizador, CUIT);
    await em.removeAndFlush(organizador);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizedOrganizadorInput, findAll, findOne, add, update, remove };