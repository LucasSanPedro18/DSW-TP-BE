import { Entity, Property, DateTimeType, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { TipoEntrada } from "../tipoEntrada/tipoEntrada.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Evento } from "../evento/evento.entity.js";

@Entity()
export class Entrada extends BaseEntity {

  @Property({ nullable: false, type: DateTimeType, onCreate: () => new Date() })
  date: Date = new Date();

  @Property({ nullable: false })
  status!: string;

  @ManyToOne(() => TipoEntrada, { nullable: false })
  tipoEntrada!: Rel<TipoEntrada>;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Rel<Usuario>;

  @ManyToOne(() => Evento, { nullable: false })
  evento!: Rel<Evento>;
}
