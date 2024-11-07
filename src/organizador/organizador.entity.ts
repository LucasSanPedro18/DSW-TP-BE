import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { Evento } from "../evento/evento.entity.js";
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Organizador extends BaseEntity {
  // CUIT debe ser un número entero (si es largo, usar bigint)
  @Property({ nullable: false, unique: true })
  CUIT!: number;

  @OneToMany(() => Evento, (evento) => evento.organizador, {
    cascade: [Cascade.ALL], // Permite que los eventos se gestionen junto con el organizador
  })
  eventos = new Collection<Evento>(this);

  @Property({ nullable: false, unique: true })
  nickname!: string; // El nickname debe ser único

  @Property({ nullable: false })
  password!: string; // Contraseña, obligatoria

  @Property({ nullable: false, unique: true })
  mail!: string; // Correo electrónico, obligatorio y único

  @Property({ nullable: true })
  description?: string; // Descripción opcional del organizador

}
