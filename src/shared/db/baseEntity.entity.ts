import { PrimaryKey, DateTimeType, Property} from '@mikro-orm/core'

export abstract class BaseEntity {
  @PrimaryKey()
  id?: number

  @Property({ type: DateTimeType, nullable: true })
  createdAt: Date = new Date();

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
    nullable: true 
  })
  updatedAt: Date = new Date();

}