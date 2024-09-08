import { Repository } from '../shared/repository.js'
import { evento } from './evento.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class eventoRepository implements Repository<evento> {
  public async findAll(): Promise<evento[] | undefined> {
    const [eventos] = await pool.query('select * from eventos')
    return eventos as evento[]
  }

  public async findOne(item: { id: string }): Promise<evento | undefined> {
    const id = Number.parseInt(item.id)
    const [eventos] = await pool.query<RowDataPacket[]>('select * from eventos where id = ?', [id])
    if (eventos.length === 0) {
      return undefined
    }
    const evento = eventos[0] as evento
    return evento
  }

  public async add(eventoInput: evento): Promise<evento | undefined> {
    const { idEvento, ...eventoRow } = eventoInput
    const [result] = await pool.query<ResultSetHeader>('insert into eventos set ?', [eventoRow])
    eventoInput.idEvento = result.insertId
    return eventoInput
  } 

  public async update(id: string, eventoInput: evento): Promise<evento | undefined> {
    const eventoId = Number.parseInt(id)
    await pool.query('update eventos set ? where id = ?', [eventoId])
    await pool.query('delete from eventoItems where eventoId = ?', [eventoId])
    return await this.findOne({ id })
  }

  public async delete(item: { id: string }): Promise<evento | undefined> {
    try {
      const eventoToDelete = await this.findOne(item)
      const eventoId = Number.parseInt(item.id)
      await pool.query('delete from eventos where id = ?', eventoId)
      return eventoToDelete
    } catch (error: any) {
      throw new Error('unable to delete evento')
    }
  }
}