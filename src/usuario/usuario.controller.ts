import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const em = orm.em;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-temporal'; // En producción, usar variables de entorno

function sanitizedUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    DNI: req.body.DNI,
    nickname: req.body.nickname,
    password: req.body.password,
    mail: req.body.mail,
    description: req.body.description,
    photo: req.body.photo,
    eventosUsuario: req.body.eventosUsuario,
    entradas: req.body.entradas,
    categoriasSeguidas: req.body.categoriasSeguidas,
  };
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findEntradasByUsuario(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);

    // Aseguramos que el ID del usuario sea válido
    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    // Buscar el usuario por su ID y cargar las entradas con populate
    const usuario = await em.findOneOrFail(
      Usuario,
      { id: usuarioId },
      { populate: ['entradas'] } // Asegúrate de que 'entradas' esté correctamente poblado
    );

    // Si no hay entradas, se maneja aquí
    if (usuario.entradas.isEmpty()) {
      return res.status(200).json({
        message: 'No se encontraron entradas para este usuario.',
        data: [],
      });
    }

    // Devolver las entradas
    res.status(200).json({
      message: 'Entradas del usuario encontradas',
      data: usuario.entradas.getItems(), // Usamos getItems() para convertir la colección en un array
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener las entradas del usuario' });
  }
}

async function register(req: Request, res: Response) {
  const { nickname, mail, password, DNI, description } = req.body;

  try {
    // Validar la fortaleza de la contraseña
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 8 caracteres' 
      });
    }

    // Verificar si el DNI ya está registrado
    const existingDNI = await em.findOne(Usuario, { DNI });
    if (existingDNI) {
      return res.status(400).json({ message: 'El DNI ya está registrado' });
    }

    // Verificar si el correo electrónico ya está registrado
    const existingMail = await em.findOne(Usuario, { mail });
    if (existingMail) {
      return res.status(400).json({ 
        message: 'El correo electrónico ya está registrado' 
      });
    }

    // Verificar si el nickname ya está registrado
    const existingNickname = await em.findOne(Usuario, { nickname });
    if (existingNickname) {
      return res.status(400).json({ 
        message: 'El nickname ya está registrado' 
      });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = em.create(Usuario, {
      nickname,
      mail,
      password: hashedPassword, // Guardar la contraseña hasheada
      DNI,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await em.persistAndFlush(newUser);

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser.id, mail: newUser.mail },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Establecer cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: newUser.id,
        nickname: newUser.nickname,
        mail: newUser.mail,
        DNI: newUser.DNI,
        description: newUser.description
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
}

async function login(req: Request, res: Response) {
  const { mail, password } = req.body;

  try {
    const usuario = await em.findOne(Usuario, { mail });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña ingresada con la hasheada
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: usuario.id, mail: usuario.mail },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Establecer cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.status(200).json({
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        DNI: usuario.DNI,
        nickname: usuario.nickname,
        mail: usuario.mail,
        description: usuario.description
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
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

async function add(req: Request, res: Response) {
  try {
    const usuario = em.create(Usuario, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Usuario created', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = Number.parseInt(req.params.id);
    const usuarioToUpdate = await em.findOneOrFail(Usuario, { id: userId });

    // Verificar que el usuario autenticado es el mismo que se está actualizando
    const authUser = req.user;
    if (!authUser || authUser.userId !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este usuario' });
    }

    const updateData = req.body;

    // Si se está actualizando la contraseña, hashearla
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Actualizar solo los campos proporcionados
    em.assign(usuarioToUpdate, updateData);
    await em.flush();

    // No devolver la contraseña en la respuesta
    const { password, ...usuarioSinPassword } = usuarioToUpdate;

    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      usuario: usuarioSinPassword
    });
  } catch (error: any) {
    console.error('Error al actualizar usuario:', error);
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
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

export {
  sanitizedUsuarioInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  login,
  register,
  findEntradasByUsuario,
};
