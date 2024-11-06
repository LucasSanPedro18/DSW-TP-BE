import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../usuario/usuario.entity.js';
import { Organizador } from '../organizador/organizador.entity.js';
import { orm } from '../shared/db/orm.js';

const authRouter = express.Router();

// Función de autenticación de usuario o organizador
async function authenticateUser(email: string, password: string, role: string) {
  let user;
  if (role === 'usuario') {
    user = await orm.em.findOne(Usuario, { mail: email });
  } else if (role === 'organizador') {
    user = await orm.em.findOne(Organizador, { mail: email });
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  return user;
}

// Ruta de login
authRouter.post('/login', async (req, res) => {
  const { mail, password, role } = req.body;

  try {
    const user = await authenticateUser(mail, password, role);
    const token = jwt.sign({ id: user.id, role: role }, 'secretkey', { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (err: unknown) {
    // Verificamos si el error es una instancia de Error
    if (err instanceof Error) {
      res.status(400).json({ success: false, message: err.message });
    } else {
      // Si no es un Error, devolvemos un mensaje genérico
      res.status(400).json({ success: false, message: 'Ocurrió un error inesperado' });
    }
  }
});

// Ruta de registro
authRouter.post('/register', async (req, res) => {
  const { mail, password, role, nickname, DNI, CUIT, description, photo } = req.body;

  try {
    // Verificamos si el usuario ya existe según el rol
    const userExists = role === 'usuario'
      ? await orm.em.findOne(Usuario, { mail })
      : await orm.em.findOne(Organizador, { mail });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Dependiendo del rol, creamos el usuario o el organizador
    if (role === 'usuario') {
      const newUser = new Usuario();
      newUser.mail = mail;
      newUser.password = hashedPassword;
      newUser.nickname = nickname;
      newUser.DNI = DNI; // Aseguramos que el DNI esté presente
      newUser.description = description; // Si el campo description es opcional
      newUser.photo = photo; // Si el campo photo es opcional
      await orm.em.persistAndFlush(newUser);
    } else if (role === 'organizador') {
      const newOrganizador = new Organizador();
      newOrganizador.mail = mail;
      newOrganizador.password = hashedPassword;
      newOrganizador.nickname = nickname;
      newOrganizador.CUIT = CUIT; // Aseguramos que el CUIT esté presente
      newOrganizador.description = description; // Si el campo description es opcional
      newOrganizador.photo = photo; // Si el campo photo es opcional
      await orm.em.persistAndFlush(newOrganizador);
    }

    res.json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (err: unknown) {
    // Verificamos si el error es una instancia de Error
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: 'Error en el registro' });
    }
  }
});

export { authRouter };
