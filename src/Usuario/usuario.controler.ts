import { Request, Response, NextFunction } from "express";
import { UsuarioRepository } from "./usuario.repository.js";
import { usuario } from "./usuario.entity.js";

const repository = new UsuarioRepository()

function sanitizedUsuarioInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizedInput = { 
        DNI : req.body.dni,
        fotoDni1 : req.body.fotoDni1,
        fotoDni2 : req.body.fotoDni2,
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
    const nuevoUsuario = repository.findOne({id:Number(req.params.DNI)}) 
    if (!nuevoUsuario) {
        return res.status(404).send({message: 'usuario no encontrado'})
    }
    return res.json(nuevoUsuario)
}


function add(req: Request,res: Response) {
    //req.body donde se encuentra la informacion del post
    const input = req.body.sanitizedInput
    const nuevoUsuarioInput = new usuario(
        input.dni,
        input.fotoDni1, 
        input.fotoDni2,
    )
    const nuevoUsuario = repository.add(nuevoUsuarioInput)
    return res.status(201).send({message: 'Usuario creado', data: nuevoUsuario})
}
    

function update(req: Request, res: Response){
    req.body.sanitizedInput.id = req.params.id
    const nuevoUsuario = repository.update(req.body.sanitizedInput)
    
    if(!nuevoUsuario){
        return res.status(404).send({message: 'usuario no encontrado'})
    }
    return res.status(200).send({message:'usuario actualizado correctamente', data: nuevoUsuario})
}
//NO ANDA SI PONGO EL ID EN LA API, SI LO PONGO EN EL JSON SI


function remove(req: Request,res: Response) {
    const id = Number(req.params.dni)
    const nuevoUsuario = repository.delete({id})

    if(!nuevoUsuario) {
        res.status(404).send({message:'Usuario no encontrado'})
    }else {
        res.status(200).send({message: 'Usuario borrado satisfactoriamente'})
    }
}


export {sanitizedUsuarioInput, findAll, findOne, add, update, remove}