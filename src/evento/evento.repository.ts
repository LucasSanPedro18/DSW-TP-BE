import { Repository } from "../shared/repository.js";
import { evento } from "./evento.entity.js";

const eventos = [
    new evento (
        123123,
        'Techno',
        3000,
        'asdasd',
        123,
        'asdasd',
        20,
    ),
]

export class EventoRepository implements Repository<evento>{
    public findAll(): evento[] | undefined{
        return eventos
    }

    public findOne(item: { id: number; }): evento | undefined {
        return eventos.find((evento)=>evento.idEvento === item.id)
    }

    public add(item: evento): evento | undefined {
        eventos.push(item)
        return item
    }

    public update(item: evento): evento | undefined {
        const eventoIDx = eventos.findIndex((evento) => evento.idEvento === item.idEvento)
        if(eventoIDx !== -1){
            eventos[eventoIDx] = { ...eventos[eventoIDx], ...item }
        }
        return eventos[eventoIDx] 
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