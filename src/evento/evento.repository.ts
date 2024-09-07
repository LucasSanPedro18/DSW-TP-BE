import { Repository } from "../shared/repository.js";
import { evento } from "./evento.entity.js";
import { pool } from "../shared/db/conn.mysql.js";

const eventos = [
    new evento (
        123123,
        'Techno',
        3000,
        'asdasd',
        123,
        'asdasd',
        '20',
    ),
]

export class EventoRepository implements Repository<evento> {
public async findAll(): Promise<evento[] | undefined> {
    const [eventos] = await pool.query('select * from eventos')
    /* for (const evento of eventos as Evento[]) {
      const [items] = await pool.query('select itemName from characterItems where characterId = ?', [character.id])
      evento.items = (items as { itemName: string }[]).map((item) => item.itemName)
    }*/

    return eventos as evento[]
  }

    public findOne(item: { id: number; }): evento | undefined {
        throw new Error("Method not implemented.");
    }

    public add(item: evento): evento | undefined {
        throw new Error("Method not implemented.");
    }

    public update(item: evento): evento | undefined {
        throw new Error("Method not implemented.");
    }

    public delete(item: { id: number; }): evento | undefined {
              const eventoIDx = eventos.findIndex((evento) => evento.idEvento === item.id)
    if(eventoIDx !== -1) {
        const deletedEventos = eventos[eventoIDx]
        eventos.splice(eventoIDx, 1)
        return deletedEventos
        }
    }
}