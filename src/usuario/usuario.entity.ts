import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  Collection,
  OneToMany,
} from '@mikro-orm/core'
import { Evento } from '../evento/evento.entity.js';
import { Organizador } from '../organizador/organizador.entity.js';
import { Entrada } from '../entrada/entrada.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Usuario extends BaseEntity {
  @Property({ nullable: false, unique: true })
  DNI!: number;

  @Property({ nullable: false, unique: true })
  photoDNI1!: number; //blob

  @Property({ nullable: false, unique: true })
  photoDNI2!: number; //blob

  /*@ManyToMany(() => Organizador, (organizador) => organizador.seguidores, {})
  seguidos = new Collection<Organizador>(this);*/

  @ManyToMany(() => Evento, (evento) => evento.usuarios, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  eventosUsuario = new Collection<Evento>(this);

  @OneToMany(() => Entrada, (entrada) => entrada.usuario, {
    cascade: [Cascade.ALL],
  })
  entradas = new Collection<Entrada>(this);

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