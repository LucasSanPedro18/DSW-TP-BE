import { Request, Response, NextFunction } from 'express';
import { Organizador } from './organizador.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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


async function login(req: Request, res: Response) {
  const { mail, password } = req.body;
  console.log('Datos recibidos:', { mail, password });  // Asegúrate de que los datos están llegando correctamente

  try {
    const organizador = await em.findOne(Organizador, { mail });

    if (!organizador) {
      return res.status(404).json({ message: 'Organizador no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(organizador.password, 10);
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    console.log('Contraseña válida');

    // Generar el token JWT
    const token = jwt.sign({ userId: organizador.id }, 'secreto', { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login exitoso',
      organizador: {
        CUIT: organizador.CUIT,
        nickname: organizador.nickname,
        mail: organizador.mail,
      },
      token: token,  // Aquí debes enviar el token generado
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}



async function register(req: Request, res: Response) {
  const { nickname, mail, password, CUIT, description } = req.body;

  try {
    // Verificar si el CUIT ya está registrado
    const existingCUIT = await em.findOne(Organizador, { CUIT });
    if (existingCUIT) {
      return res.status(400).json({ message: 'El CUIT ya está registrado' });
    }

    // Verificar si el correo electrónico ya está registrado
    const existingMail = await em.findOne(Organizador, { mail });
    if (existingMail) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Verificar si el nickname ya está registrado
    const existingNickname = await em.findOne(Organizador, { nickname });
    if (existingNickname) {
      return res.status(400).json({ message: 'El nickname ya está registrado' });
    }

    // Si todo está bien, crear el nuevo organizador
    const newOrganizador = em.create(Organizador, { 
      nickname, 
      mail, 
      password, 
      CUIT, 
      description, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
    
    // Guardar el organizador en la base de datos
    await em.persistAndFlush(newOrganizador);

    res.status(201).json({
      message: 'Organizador registrado exitosamente',
      data: newOrganizador,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el organizador' });
  }
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

export { sanitizedOrganizadorInput, findAll, findOne, add, update, remove, login, register };