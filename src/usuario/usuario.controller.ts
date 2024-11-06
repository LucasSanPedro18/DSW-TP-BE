import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizedUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    DNI: req.body.DNI,
    photoDNI1: req.body.photoDNI1,
    photoDNI2: req.body.photoDNI2,
    seguidos: req.body.seguidos,
    eventosUsuario: req.body.eventosUsuario,
    entradas: req.body.entradas,
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
    const usuarios = await em.find(
      Usuario,
      {},
      { populate: ['eventosUsuario', 'entradas'] }
    );
    res.status(200).json({ message: 'found all Usuarios', data: usuarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const DNI = Number.parseInt(req.params.DNI);
    const usuario = await em.findOneOrFail(
      Usuario,
      { DNI },
      { populate: ['eventosUsuario', 'entradas'] }
    );
    res.status(200).json({ message: 'found Usuario', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = em.create(Usuario, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Usuario created', data: usuario});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const DNI = Number.parseInt(req.params.DNI);
    const usuarioToUpdate = await em.findOneOrFail(Usuario, { DNI });
    em.assign(usuarioToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Usuario updated', data: usuarioToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const DNI = Number.parseInt(req.params.DNI);
    const usuario = em.getReference(Usuario, DNI);
    await em.removeAndFlush(usuario);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizedUsuarioInput, findAll, findOne, add, update, remove };