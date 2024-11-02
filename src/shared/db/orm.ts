import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { MySqlDriver } from '@mikro-orm/mysql';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'sge',
  driver: MySqlDriver,
  user: 'dsw',
  password: 'dsw',
  host: 'localhost',
  port: 3306,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});


export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  
  await generator.dropSchema()
  await generator.createSchema()
  
  await generator.updateSchema()
}