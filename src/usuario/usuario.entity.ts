import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  Collection,
  OneToMany,
  PrimaryKey,
} from '@mikro-orm/core'
import { Evento } from '../evento/evento.entity.js';
import { Entrada } from '../entrada/entrada.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Categoria } from '../categoria/categoria.entity.js'

@Entity()
export class Usuario extends BaseEntity {

  @PrimaryKey({ nullable: false, unique: true })
  DNI!: number;

  @Property({ nullable: false, unique: true })
  nickname!: string;

  @Property({ nullable: false})
  password!: string;

  @Property({ nullable: false})
  mail!: string;

  @Property({nullable: true})
  description?: string;

  @Property({nullable: true})
  photo?: Blob; //blob

  @ManyToMany(() => Evento, (evento) => evento.usuarios, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  eventosUsuario = new Collection<Evento>(this);

  @OneToMany(() => Entrada, (entrada) => entrada.usuario, {
    cascade: [Cascade.ALL],
  })
  entradas = new Collection<Entrada>(this);

  @ManyToMany(() => Categoria, (categoria) => categoria.usuariosSeguidos, {
    owner: true,
  })
  categoriasSeguidas = new Collection<Categoria>(this);
}