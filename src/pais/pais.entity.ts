import { Entity, Property, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Localidad } from '../localidad/localidad.entity.js';

@Entity()
export class Pais extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string;

    @OneToMany(() => Localidad, (localidad) => localidad.pais, {
      cascade: [Cascade.ALL],
    })
    localidades = new Collection<Localidad>(this)
} 