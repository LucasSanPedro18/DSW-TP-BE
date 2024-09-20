import { Repository } from '../shared/repository.js'
import { Cuenta } from './cuenta.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class CuentaRepository implements Repository<Cuenta> {
  public async findAll(): Promise<Cuenta[] | undefined> {
    const [cuentas] = await pool.query('select * from cuentas')
    return cuentas as Cuenta[]
  }

  public async findOne(item: { id: string }): Promise<Cuenta | undefined> {
    const id = Number.parseInt(item.id)
    const [cuentas] = await pool.query<RowDataPacket[]>('select * from cuentas where id = ?', [id])
    if (cuentas.length === 0) {
      return undefined
    }
    const cuenta = cuentas[0] as Cuenta
    return cuenta
  }

  public async add(cuentaInput: Cuenta): Promise<Cuenta | undefined> {
    const { id, ...cuentaRow } = cuentaInput
    const [result] = await pool.query<ResultSetHeader>('insert into cuentas set ?', [cuentaRow])
    cuentaInput.id = result.insertId
    return cuentaInput
  } 

  public async update(id: string, cuentaInput: Cuenta): Promise<Cuenta | undefined> {
    const cuentaId = Number.parseInt(id)
    const {...cuentaRow } = cuentaInput
    await pool.query('update cuentas set ? where id = ?', [cuentaRow, cuentaId])
    return await this.findOne({ id })
  }

  public async delete(item: { id: string }): Promise<Cuenta | undefined> {
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