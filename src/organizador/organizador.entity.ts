import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  OneToMany,
  Collection,
} from '@mikro-orm/core'
import { Ubicacion } from "../ubicacion/ubicacion.entity.js";
import { Evento } from "../evento/evento.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { BaseEntity } from '../shared/db/baseEntity.entity.js';


@Entity()
export class Organizador extends BaseEntity {
  @Property({ nullable: false, unique: true })
  CUIT!: number;

  @Property({ nullable: false, unique: true })
  score!: number;

  @OneToMany(() => Ubicacion, (ubicacion) => ubicacion.organizador, {
    cascade: [Cascade.ALL],
  })
  ubicaciones = new Collection<Ubicacion>(this);

  @OneToMany(() => Evento, (evento) => evento.organizador, {
    cascade: [Cascade.ALL],
  })
  eventos = new Collection<Evento>(this);

  /*@ManyToMany(() => Usuario, (usuario) => usuario.seguidos, {
    cascade: [Cascade.ALL],
  })
  seguidores = new Collection<Usuario>(this);*/

  @Property({ nullable: false, unique: true })
  nickname!: string;

  @Property()
  password!: string;

  @Property()
  mail!: string;

  @Property()
  description?: string;

  @Property()
  photo?: number; //blob
}{}
