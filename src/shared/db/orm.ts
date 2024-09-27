import { MikroORM } from "@mikro-orm/core";
import { defineConfig } from '@mikro-orm/mysql';
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init(defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'sge',
  clientUrl: 'mysql://dsw:dsw@localhost:3306/sge',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
}))

export const syncSchema = async () => {

  const generator = orm.getSchemaGenerator()

  await generator.updateSchema()

  /*   Comandos por si queremos reinciar la base de datos
  await generator.dropSchema()
  await generator.createSchema()
  */
}