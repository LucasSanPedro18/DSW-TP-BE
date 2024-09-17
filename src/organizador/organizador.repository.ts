import { Repository } from '../shared/repository.js'
import { organizador } from './organizador.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class organizadorRepository implements Repository<organizador> {
  public async findAll(): Promise<organizador[] | undefined> {
    const [organizadores] = await pool.query('select * from organizadors')
    return organizadores as organizador[]
  }

  public async findOne(item: { id: string }): Promise<organizador | undefined> {
    const id = Number.parseInt(item.id)
    const [organizadores] = await pool.query<RowDataPacket[]>('select * from organizadors where CUIT = ?', [id])
    if (organizadores.length === 0) {
      return undefined
    }
    const organizador = organizadores[0] as organizador
    return organizador
  }

  public async add(organizadorInput: organizador): Promise<organizador | undefined> {
    const { CUIT, ...organizadorRow } = organizadorInput
    const [result] = await pool.query<ResultSetHeader>('insert into organizadores set ?', [organizadorRow])
    organizadorInput.CUIT = result.insertId
    return organizadorInput
  } 

  public async update(id: string, organizadorInput: organizador): Promise<organizador | undefined> {
    const organizadorCUIT = Number.parseInt(id)
    await pool.query('update organizadors set ? where CUIT = ?', [organizadorCUIT])
    
    return await this.findOne({ id })
  }

  public async delete(item: { id: string }): Promise<organizador | undefined> {
    try {
      const organizadorToDelete = await this.findOne(item)
      const organizadorCUIT = Number.parseInt(item.id)
      await pool.query('delete from organizadors where CUIT = ?', organizadorCUIT)
      return organizadorToDelete
    } catch (error: any) {
      throw new Error('unable to delete organizador')
    }
  }
}