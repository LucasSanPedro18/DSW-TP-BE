import { Entity, Property, Rel, ManyToOne, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Localidad } from '../localidad/localidad.entity.js';
import { Evento } from '../evento/evento.entity.js';
import { Organizador } from '../cuenta/organizador/organizador.entity.js';

@Entity()
export class Ubicacion extends BaseEntity {

    @Property({ nullable: false, unique: true })
    name!: string

    @Property({ nullable: false, unique: true })
    maxCap!: number

    @Property({ nullable: false, unique: true })
    address!: string

    @Property({ nullable: true })
    locationPhoto?: string

    @Property({ nullable: false, unique: true })
    mapHyperlink!: string

    @ManyToOne(() => Organizador, {nullable: true})
    organizador?: Rel<Organizador>

    @ManyToOne(() => Localidad, {nullable: false})
    localidad!: Rel<Localidad>

    @OneToMany(() => Evento, (evento) => evento.ubicacion, {
        cascade: [Cascade.ALL],
    })
    eventos = new Collection<Evento>(this)
}