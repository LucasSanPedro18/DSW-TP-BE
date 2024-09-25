import { Cuenta } from '../cuenta.entity.js';
import { Entity, Property, OneToMany, Collection, Cascade, ManyToMany } from '@mikro-orm/core';
import { Evento } from '../../evento/evento.entity.js';
import { Organizador } from '../organizador/organizador.entity.js';
import { Entrada } from '../../entrada/entrada.entity.js';

@Entity()
export class Usuario extends Cuenta {
  @Property({ nullable: false, unique: true })
  DNI!: number;

  @Property({ nullable: false, unique: true })
  photoDNI1!: number; //blob

  @Property({ nullable: false, unique: true })
  photoDNI2!: number; //blob
  
  @ManyToMany(() => Organizador, (organizador) => organizador.seguidores, {
    })seguidos = new Collection<Organizador>(this);

  @ManyToMany(() => Evento, (evento) => evento.usuarios, {
    cascade: [Cascade.ALL],}) eventosUsuario = new Collection<Evento>(this)

  @OneToMany(() => Entrada, (entrada) => entrada.usuario, {
    cascade: [Cascade.ALL],
  })
  entradas = new Collection<Entrada>(this)

}{}