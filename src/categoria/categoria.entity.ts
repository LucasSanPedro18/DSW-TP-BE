import { Entity, Property, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Evento } from '../evento/evento.entity.js';

@Entity()
export class Categoria extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string;
    
    @Property ({ nullable: true })
    description?: string;

    @OneToMany(() => Evento, (evento) => evento.categoria, {
      cascade: [Cascade.ALL],
    })
    eventos = new Collection<Evento>(this)
}