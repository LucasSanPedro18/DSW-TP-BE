import { Request, Response, NextFunction } from 'express';
import { Organizador } from './organizador.entity.js';
import { Evento } from '../evento/evento.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const em = orm.em;
const SALT_ROUNDS = 10;

// Función auxiliar para hashear contraseña
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function sanitizedOrganizadorInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

async function findEventosByOrganizador(req: Request, res: Response) {
  try {
    const organizadorId = Number.parseInt(req.params.id);

    // Aseguramos que el ID del organizador sea válido
    if (isNaN(organizadorId)) {
      return res.status(400).json({ message: 'ID de organizador inválido' });
    }

    // Buscar los eventos del organizador directamente con todas las relaciones pobladas
    const eventos = await em.find(
      Evento,
      { organizador: organizadorId },
      { 
        populate: [
          'entradas', 
          'tiposEntrada', 
          'usuarios', 
          'eventoCategoria',
          'organizador'
        ] 
      }
    );

    // Si no hay eventos, se maneja aquí
    if (eventos.length === 0) {
      return res.status(200).json({
        message: 'No se encontraron eventos para este organizador.',
        data: [],
      });
    }

    // Devolver los eventos
    res.status(200).json({
      message: 'Eventos del organizador encontrados',
      data: eventos,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener los eventos del organizador' });
  }
}

async function login(req: Request, res: Response) {
  const { mail, password } = req.body;

  try {
    const organizador = await em.findOne(Organizador, { mail });

    if (!organizador) {
      return res.status(404).json({ message: 'Organizador no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, organizador.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      organizador: {
        id: organizador.id,
        CUIT: organizador.CUIT,
        nickname: organizador.nickname,
        mail: organizador.mail,
        description: organizador.description
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
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
      return res
        .status(400)
        .json({ message: 'El correo electrónico ya está registrado' });
    }

    // Verificar si el nickname ya está registrado
    const existingNickname = await em.findOne(Organizador, { nickname });
    if (existingNickname) {
      return res
        .status(400)
        .json({ message: 'El nickname ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Si todo está bien, crear el nuevo organizador
    const newOrganizador = em.create(Organizador, {
      nickname,
      mail,
      password: hashedPassword,
      CUIT,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar el organizador en la base de datos
    await em.persistAndFlush(newOrganizador);

    res.status(201).json({
      message: 'Organizador registrado exitosamente',
      data: {
        ...newOrganizador,
        password: undefined // No devolver la contraseña hasheada
      }
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
    res
      .status(200)
      .json({ message: 'found all organizadores', data: organizadores });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const organizador = await em.findOneOrFail(
      Organizador,
      { id },
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
    const id = Number.parseInt(req.params.id);
    const organizadorToUpdate = await em.findOneOrFail(Organizador, { id });

    // Si se está actualizando la contraseña, hashearla
    if (req.body.sanitizedInput.password) {
      req.body.sanitizedInput.password = await hashPassword(req.body.sanitizedInput.password);
    }

    em.assign(organizadorToUpdate, req.body.sanitizedInput);
    await em.flush();

    // Crear un objeto de respuesta sin la contraseña
    const responseData = {
      id: organizadorToUpdate.id,
      CUIT: organizadorToUpdate.CUIT,
      nickname: organizadorToUpdate.nickname,
      mail: organizadorToUpdate.mail,
      description: organizadorToUpdate.description,
      createdAt: organizadorToUpdate.createdAt,
      updatedAt: organizadorToUpdate.updatedAt
    };

    res.status(200).json({
      message: 'Organizador updated',
      data: responseData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const organizador = em.getReference(Organizador, id);
    await em.removeAndFlush(organizador);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizedOrganizadorInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  login,
  register,
  findEventosByOrganizador,
};
