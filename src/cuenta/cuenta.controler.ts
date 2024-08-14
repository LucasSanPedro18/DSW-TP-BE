import { Request, Response, NextFunction } from "express";
import { CuentaRepository } from "./cuenta.repository.js";
import { cuenta } from "./cuenta.entity.js";

const repository = new CuentaRepository()

function sanitizedCuentaInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizedInput = { 
        id : req.body.id,
        mail : req.body.mail,
        nombre : req.body.nombre,
        contraseña : req.body.contraseña,
        descripcion : req.body.descripcion,
        foto : req.body.foto,
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
    const nuevaCuenta = repository.findOne({id:Number(req.params.id)}) 
    if (!nuevaCuenta) {
        return res.status(404).send({message: 'Cuenta no encontrada'})
    }
    return res.json(nuevaCuenta)
}


function add(req: Request,res: Response) {
    //req.body donde se encuentra la informacion del post
    const input = req.body.sanitizedInput
    const nuevaCuentaInput = new cuenta(
        input.id,
        input.mail, 
        input.nombre, 
        input.contraseña,
        input.descripcion,  
        input.foto
    )
    const nuevaCuenta = repository.add(nuevaCuentaInput)
    return res.status(201).send({message: 'Cuenta creada', data: nuevaCuenta})
}
    

function update(req: Request, res: Response){
    req.body.sanitizedInput.id = req.params.id
    const busca = repository.findOne({id:Number(req.params.id)})
    
    if(!busca){
        return res.status(404).send({message: 'Cuenta no encontrada'})
    }
    const nuevaCuenta = repository.update(req.body.sanitizedInput)
    return res.status(200).send({message:'Cuenta actualizada correctamente', data: nuevaCuenta})
}
//NO ANDA SI PONGO EL ID EN LA API, SI LO PONGO EN EL JSON SI


function remove(req: Request,res: Response) {
    const id=Number(req.params.id)
    const nuevaCuenta = repository.findOne({id:Number(req.params.id)})

    if(!nuevaCuenta) {
        res.status(404).send({message:'Cuenta no encontrada'})
    }else {
        const nuevaCuenta = repository.delete({id})
        res.status(200).send({message: 'Cuenta borrada satisfactoriamente'})
    }
}


export {sanitizedCuentaInput, findAll, findOne, add, update, remove}