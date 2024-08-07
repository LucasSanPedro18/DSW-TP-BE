import { Request, Response, NextFunction } from "express";
import { CuentaRepository } from "./evento.repository.js";
import { cuenta } from "./evento.entity.js";

const repository = new CuentaRepository()

function sanitizedCuentaInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizedInput = { 
        mail : req.body.mail,
        nombre : req.body.nombre,
        contraseña : req.body.contraseña,
        descripcion : req.body.descripcion,
        fotoPerfil : req.body.fotoPerfil,
    };
    //validar tipo de datos, etc etc etc etc etc etc etc

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}

function findAll(req: Request,res: Response) {
    return res.json({data:repository.findAll()})
}

function findOne(req: Request,res: Response) {
    const nuevoCuenta = repository.findOne({id:Number(req.params.id)}) 
    if (!nuevoCuenta) {
        return res.status(404).send({message: 'evento no encontrado'})
    }
    return res.json(nuevoEvento)
}


function add(req: Request,res: Response) {
    //req.body donde se encuentra la informacion del post
    const input = req.body.sanitizedInput
    const nuevoEventoInput = new evento(
        input.idEvento,
        input.nombre, 
        input.cuposGral, 
        input.descripcion, 
        input.fotoEvento, 
        input.fecha, 
        input.hora
    )
    const nuevoEvento = repository.add(nuevoEventoInput)
    return res.status(201).send({message: 'Evento creado', data: nuevoEvento})
}
    

function update(req: Request, res: Response){
    req.body.sanitizedInput.id = req.params.id
    const nuevoEvento = repository.update(req.body.sanitizedInput)
    
    if(!nuevoEvento){
        return res.status(404).send({message: 'evento no encontrado'})
    }
    return res.status(200).send({message:'Evento actualizado correctamente', data: nuevoEvento})
}
//NO ANDA SI PONGO EL ID EN LA API, SI LO PONGO EN EL JSON SI


function remove(req: Request,res: Response) {
    const id=Number(req.params.id)
    const nuevoEvento = repository.delete({id})

    if(!nuevoEvento) {
        res.status(404).send({message:'Evento no encontrado'})
    }else {
        res.status(200).send({message: 'Evento borrado satisfactoriamente'})
    }
}


export {sanitizedEventoInput, findAll, findOne, add, update, remove}