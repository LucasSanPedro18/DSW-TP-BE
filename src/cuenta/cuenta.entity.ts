import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Cuenta extends BaseEntity {

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
