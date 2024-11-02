import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  OneToMany,
  Collection,
  PrimaryKeyProp,
  PrimaryKey,
} from '@mikro-orm/core'
import { Evento } from "../evento/evento.entity.js";
import { BaseEntity } from '../shared/db/baseEntity.entity.js';


@Entity()
export class Organizador extends BaseEntity {
  @PrimaryKey()
  CUIT!: number;

  @OneToMany(() => Evento, (evento) => evento.organizador, {
    cascade: [Cascade.ALL],
  })
  eventos = new Collection<Evento>(this);

  @Property({ nullable: false, unique: true })
  nickname!: string;

  @Property({ nullable: false})
  password!: string;

  @Property({ nullable: false, unique: true })
  mail!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({nullable: true})
  photo?: number; //blob

}{}
