import { Request, Response, NextFunction } from 'express';
import { Organizador } from './organizador.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcryptjs';
import { Usuario } from '../usuario/usuario.entity.js';

const em = orm.em;

function sanitizedOrganizadorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    CUIT: req.body.CUIT,
    nickname: req.body.nickname,
    password: req.body.password,
    mail: req.body.mail,
    description: req.body.description,
    photo: req.body.photo,
    eventos: req.body.eventos,
  };

  // Validación de los campos requeridos
  if (!req.body.sanitizedInput.nickname || !req.body.sanitizedInput.password || !req.body.sanitizedInput.mail || !req.body.sanitizedInput.CUIT) {
    return res.status(400).json({ message: "Faltan campos obligatorios (nickname, password, mail, CUIT)" });
  }

  // Validación del CUIT (verifica si es un número)
  if (isNaN(Number(req.body.sanitizedInput.CUIT))) {
    return res.status(400).json({ message: "El CUIT debe ser un número válido" });
  }

  // Validación del correo electrónico único
  em.count(Organizador, { mail: req.body.sanitizedInput.mail }).then((count) => {
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
    const organizadorData = req.body.sanitizedInput; // Usamos la entrada sanitizada
    const organizador = em.create(Organizador, organizadorData); // Creamos el organizador con los datos sanitizados

    // Si la contraseña es parte del registro, debes encriptarla antes de guardarla
    if (organizadorData.password) {
      const hashedPassword = await bcrypt.hash(organizadorData.password, 10); // Encriptamos la contraseña
      organizador.password = hashedPassword; // Asignamos la contraseña encriptada al organizador
    }

    await em.flush(); // Guardamos en la base de datos

    res.status(201).json({ success: true, message: 'Organizador creado', data: organizador });
  } catch (error) {
    console.error('Error al registrar el organizador:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al registrar el organizador' });
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

export { sanitizedOrganizadorInput, findAll, findOne, add, update, remove  };
