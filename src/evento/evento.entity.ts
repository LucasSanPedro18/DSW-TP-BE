import { Entity, Property, DateTimeType, Rel, ManyToOne, ManyToMany, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Categoria } from '../categoria/categoria.entity.js';
import { Ubicacion } from '../ubicacion/ubicacion.entity.js';
import { Organizador } from '../organizador/organizador.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { TipoEntrada } from '../tipoEntrada/tipoEntrada.entity.js';
import { Entrada } from '../entrada/entrada.entity.js';

@Entity()
export class Evento extends BaseEntity {

  @Property({ nullable: false, unique: true })
  name!: string;
  
  @Property({ nullable: false, unique: true })
  cupos!: number;

  @Property({ nullable: false, unique: false })
  description!: string;

  @Property({ nullable: true })
  photo?: number; //blob

  @Property({ type: DateTimeType, nullable: true })
  date?: Date; 

  @OneToMany(() => Entrada, (entrada) => entrada.evento, {
    cascade: [Cascade.ALL],
  })
  entradas = new Collection<Entrada>(this)

  @OneToMany(() => TipoEntrada, (tipoEntrada) => tipoEntrada.evento, {
    cascade: [Cascade.ALL],
  })
  tiposEntrada = new Collection<TipoEntrada>(this)

  @ManyToOne(() => Categoria, {nullable: false})
  categoria!: Rel<Categoria>

  @ManyToOne(() => Ubicacion, {nullable: false})
  ubicacion!: Rel<Ubicacion>

  @ManyToOne(() => Organizador, {nullable: false})
  organizador!: Rel<Organizador>

  @ManyToMany(() => Usuario, (usuario) => usuario.eventosUsuario)
  usuarios = new Collection<Usuario>(this);

  
}
