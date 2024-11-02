import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  Collection,
  OneToMany,
  PrimaryKey,
  ManyToOne,
  DateTimeType,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Organizador } from '../organizador/organizador.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { TipoEntrada } from '../tipoEntrada/tipoEntrada.entity.js';
import { Entrada } from '../entrada/entrada.entity.js';
import { Categoria } from '../categoria/categoria.entity.js';

@Entity()
export class Evento extends BaseEntity {

  @PrimaryKey()
  id?: number

  @Property({ nullable: false, unique: false })
  name!: string;
  
  @Property({ nullable: false, unique: true })
  cupos!: number;

  @Property({ nullable: false, unique: false })
  description!: string;

  @Property({ nullable: true })
  photo?: number; //blob

  @Property({ type: DateTimeType, nullable: true })
  date?: Date; 

  @Property({ nullable: false, unique: false })
  ubicacion!: string;

  @OneToMany(() => Entrada, (entrada) => entrada.evento, {
    cascade: [Cascade.ALL],
  })
  entradas = new Collection<Entrada>(this)

  @OneToMany(() => TipoEntrada, (tipoEntrada) => tipoEntrada.eventos, {
    cascade: [Cascade.ALL],
  })
  tiposEntrada = new Collection<TipoEntrada>(this)

  @ManyToOne(() => Categoria, {nullable: false})
  eventoCategoria! : Categoria;

  @ManyToOne(() => Organizador, {nullable: false})
  organizador!: Organizador;

  @ManyToMany(() => Usuario, (usuario) => usuario.eventosUsuario)
  usuarios = new Collection<Usuario>(this);

  
}
