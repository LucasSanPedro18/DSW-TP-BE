import { Entity, Collection, Property, OneToMany, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entrada } from '../entrada/entrada.entity.js';
import { Evento } from '../evento/evento.entity.js';

@Entity()
export class TipoEntrada extends BaseEntity {
  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: true })
  value?: number;

  @Property({ nullable: true })
  cupos?: number;

  @OneToMany(() => Entrada, (entrada) => entrada.tipoEntrada)
  entradas = new Collection<Entrada>(this);

  @ManyToOne(() => Evento, { nullable: false })
  eventos!: Rel<Evento>;
}