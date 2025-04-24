import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { orm } from '../shared/db/orm.js';
import { Usuario } from '../usuario/usuario.entity.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-temporal';

interface JwtPayload {
  userId: number;
  mail: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        mail: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Verificar si el usuario aún existe en la base de datos
    const usuario = await orm.em.findOne(Usuario, { id: decoded.userId });
    
    if (!usuario) {
      return res.status(401).json({ message: 'No autorizado - Usuario no encontrado' });
    }

    // Añadir información del usuario al request
    req.user = {
      userId: decoded.userId,
      mail: decoded.mail
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'No autorizado - Token expirado' });
    }
    return res.status(401).json({ message: 'No autorizado - Token inválido' });
  }
};
