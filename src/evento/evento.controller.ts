import { Request, Response, NextFunction } from 'express'
import { Evento } from './evento.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizedEventoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    cupos: req.body.cupos,
    description: req.body.description,
    date: req.body.date,
    ubicacion: req.body.ubicacion,
    entradas: req.body.entradas,
    tiposEntrada: req.body.tiposEntrada,
    eventoCategoria: req.body.eventoCategoria,
    organizador: req.body.organizador,
    usuarios: req.body.usuarios,
  };

  // Si el archivo fue cargado, añade la ruta del archivo a los datos
  if (req.file) {
    req.body.sanitizedInput.photo = req.file.path;
  }

  // Elimina los valores `undefined`
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const eventos = await em.find(
      Evento,
      {},
      { populate: ['entradas', 'tiposEntrada',  'usuarios'] }
    )
    res.status(200).json({ message: 'found all events', data: eventos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const evento = await em.findOneOrFail(
      Evento,
      { id },
      { populate: ['entradas', 'tiposEntrada', 'organizador', 'usuarios'] }
    )
    res.status(200).json({ message: 'found evento', data: evento })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function add(req: Request, res: Response) {
  try {
    // Obtener un fork del EntityManager global
    const em = orm.em.fork();

    // Los datos del evento (sin sanitización en este ejemplo, ajusta según necesidad)
    const eventoData = req.body;

    // Verifica si se subió un archivo de imagen
    if (req.file) {
      // Guarda la ruta del archivo en el campo `photo`
      eventoData.photo = req.file.path.replace(/\\/g, '/'); // Normaliza la ruta para sistemas Windows
    }

    // Crear el evento con los datos recibidos
    const evento = em.create(Evento, eventoData);

    // Persistir y hacer flush de los datos
    await em.persistAndFlush(evento);

    // Responder con el evento creado
    res.status(201).json({
      message: 'Evento creado con éxito',
      data: evento,
    });
  } catch (error) {
    const err = error as any;
    console.error('Error creando el evento:', err.message);
    res.status(500).json({
      message: `Error al crear el evento: ${err.message}`,
    });
  }
}


async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const eventoToUpdate = await em.findOneOrFail(Evento, { id })
    em.assign(eventoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'evento updated', data: eventoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const evento = em.getReference(Evento, id)
    await em.removeAndFlush(evento)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedEventoInput, findAll, findOne, add, update, remove }