import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcryptjs';

const em = orm.em;

function sanitizedUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    DNI: req.body.DNI,
    nickname: req.body.nickname,
    password: req.body.password,
    mail: req.body.mail,
    photoDNI1: req.body.photoDNI1,
    photoDNI2: req.body.photoDNI2,
    seguidos: req.body.seguidos,
    eventosUsuario: req.body.eventosUsuario,
    entradas: req.body.entradas,
  };

  // Validación de datos de entrada
  if (!req.body.sanitizedInput.nickname || !req.body.sanitizedInput.password || !req.body.sanitizedInput.mail) {
    return res.status(400).json({ message: "Faltan campos obligatorios (nickname, password, mail)" });
  }

  // Validación de email único
  em.count(Usuario, { mail: req.body.sanitizedInput.mail }).then((count) => {
    if (count > 0) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado" });
    }
    next();
  }).catch((error) => {
    return res.status(500).json({ message: error.message });
  });

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}



async function add(req: Request, res: Response) {
  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(req.body.sanitizedInput.password, 10);

    // Crear el usuario con la contraseña encriptada
    const usuario = em.create(Usuario, {
      ...req.body.sanitizedInput,
      password: hashedPassword  // Reemplaza la contraseña en texto plano por la encriptada
    });

    await em.flush();

    res.status(201).json({ message: 'Usuario creado', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
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
