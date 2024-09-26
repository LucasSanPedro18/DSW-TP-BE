import { Entity, Property, Rel, ManyToOne, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Ubicacion } from '../ubicacion/ubicacion.entity.js';
import { Pais } from '../pais/pais.entity.js';

@Entity()
export class Localidad extends BaseEntity {

  @Property({ nullable: false, unique: true })
  name!: string;

  @ManyToOne(() => Pais, {nullable: false})
  pais!: Rel<Pais>

  @OneToMany(() => Ubicacion, (ubicacion) => ubicacion.localidad, {
    cascade: [Cascade.ALL],
  })
  ubicaciones = new Collection<Ubicacion>(this)
}
