import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Cuenta {
  @PrimaryKey()
  id?: number;

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
}
