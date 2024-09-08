import { Repository } from '../shared/repository.js'
import { cuenta } from './cuenta.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class cuentaRepository implements Repository<cuenta> {
  public async findAll(): Promise<cuenta[] | undefined> {
    const [cuentas] = await pool.query('select * from cuentas')
    return cuentas as cuenta[]
  }

  public async findOne(item: { id: string }): Promise<cuenta | undefined> {
    const id = Number.parseInt(item.id)
    const [cuentas] = await pool.query<RowDataPacket[]>('select * from cuentas where id = ?', [id])
    if (cuentas.length === 0) {
      return undefined
    }
    const cuenta = cuentas[0] as cuenta
    return cuenta
  }

  public async add(cuentaInput: cuenta): Promise<cuenta | undefined> {
    const { idCuenta, ...cuentaRow } = cuentaInput
    const [result] = await pool.query<ResultSetHeader>('insert into cuentas set ?', [cuentaRow])
    cuentaInput.idCuenta = result.insertId
    return cuentaInput
  } 

  public async update(id: string, cuentaInput: cuenta): Promise<cuenta | undefined> {
    const cuentaId = Number.parseInt(id)
    await pool.query('update cuentas set ? where id = ?', [cuentaId])
    await pool.query('delete from cuentaItems where cuentaId = ?', [cuentaId])
    return await this.findOne({ id })
  }

  public async delete(item: { id: string }): Promise<cuenta | undefined> {
    try {
      const cuentaToDelete = await this.findOne(item)
      const cuentaId = Number.parseInt(item.id)
      await pool.query('delete from cuentas where id = ?', cuentaId)
      return cuentaToDelete
    } catch (error: any) {
      throw new Error('unable to delete cuenta')
    }
  }
}