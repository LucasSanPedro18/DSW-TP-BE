import { Cuenta } from "../cuenta.entity.js";
import { Entity, Property, OneToMany, Collection, Cascade, ManyToMany } from '@mikro-orm/core';
import { Ubicacion } from "../../ubicacion/ubicacion.entity.js";
import { Evento } from "../../evento/evento.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";


@Entity()
export class Organizador extends Cuenta {

    @Property({ nullable: false, unique: true })
    CUIT!: number;

    @Property({ nullable: false, unique: true })
    score!: number;

    @OneToMany(() => Ubicacion, (ubicacion) => ubicacion.organizador, {
      cascade: [Cascade.ALL],
    }) ubicaciones = new Collection<Ubicacion>(this);

    @OneToMany(() => Evento, (evento) => evento.organizador, {
      cascade: [Cascade.ALL],
    }) eventos = new Collection<Evento>(this);

    @ManyToMany(() => Usuario, (usuario) => usuario.seguidos, {
    cascade: [Cascade.ALL],
    }) seguidores = new Collection<Usuario>(this);
    }{}
