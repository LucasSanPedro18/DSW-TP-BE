import { Repository } from '../shared/repository.js'
import { usuario } from './usuario.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class usuarioRepository implements Repository<usuario> {
  public async findAll(): Promise<usuario[] | undefined> {
    const [usuarios] = await pool.query('select * from usuarios')
    return usuarios as usuario[]
  }

  public async findOne(item: { id: string }): Promise<usuario | undefined> {
    const id = Number.parseInt(item.id)
    const [usuarios] = await pool.query<RowDataPacket[]>('select * from usuarios where DNI = ?', [id])
    if (usuarios.length === 0) {
      return undefined
    }
    const usuario = usuarios[0] as usuario
    return usuario
  }

  public async add(usuarioInput: usuario): Promise<usuario | undefined> {
    const { DNI, ...usuarioRow } = usuarioInput
    const [result] = await pool.query<ResultSetHeader>('insert into usuarios set ?', [usuarioRow])
    usuarioInput.DNI = result.insertId
    return usuarioInput
  } 

  public async update(id: string, usuarioInput: usuario): Promise<usuario | undefined> {
    const usuarioId = Number.parseInt(id)
    await pool.query('update usuarios set ? where id = ?', [usuarioId])
    await pool.query('delete from usuarioItems where usuarioId = ?', [usuarioId])
    return await this.findOne({ id })
  }

  public async delete(item: { id: string }): Promise<usuario | undefined> {
    try {
      const usuarioToDelete = await this.findOne(item)
      const usuarioId = Number.parseInt(item.id)
      await pool.query('delete from usuarios where id = ?', usuarioId)
      return usuarioToDelete
    } catch (error: any) {
      throw new Error('unable to delete usuario')
    }
  }
}