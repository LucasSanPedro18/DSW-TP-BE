import { Repository } from "../shared/repository.js";
import { usuario } from "./usuario.entity.js";
import { pool } from "../shared/db/conn.mysql.js";

const usuarios = [
    new usuario (
        'asdasd',
        1,
        2,
    )
]

export class UsuarioRepository implements Repository<usuario> {
public async findAll(): Promise<usuario[] | undefined> {
    const [eventos] = await pool.query('select * from usuarios')
        return usuarios as usuario[]
    }

    public findOne(item: { id: number; }): usuario | undefined {
        return usuarios.find((usuario)=>usuario.DNI === String(item.id))
    }

    public add(item: usuario): usuario | undefined {
        usuarios.push(item)
        return item
    }

    public update(item: usuario): usuario | undefined {
        const usuarioIDx = usuarios.findIndex((usuario) => usuario.DNI === item.DNI)
        if(usuarioIDx !== -1){
            usuarios[usuarioIDx] = { ...usuarios[usuarioIDx], ...item }
        }
        return usuarios[usuarioIDx] 
    }

    public delete(item: { id: number; }): usuario | undefined {
              const usuarioIDx = usuarios.findIndex((usuario) => usuario.DNI === String(item.id))
    if(usuarioIDx !== -1) {
        const deletedusuarios = usuarios[usuarioIDx]
        usuarios.splice(usuarioIDx, 1)
        return deletedusuarios
        }
    }
}