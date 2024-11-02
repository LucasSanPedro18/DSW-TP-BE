import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { eventoRouter } from './evento/evento.routes.js'
import { tipoEntradaRouter } from './tipoEntrada/tipoEntrada.routes.js'
import { organizadorRouter } from './organizador/organizador.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { entradaRouter } from './entrada/entrada.routes.js'
import { categoriaRouter } from './categoria/categoria.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'



const app = express()
app.use(express.json())

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de negocio

app.use((req, res) => {
    return res.status(404).send({message:'Error 404. Recurso no encontrado!'})
})

await syncSchema() //never in production

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001/')
})


app.use('/api/entrada', entradaRouter)
app.use('/api/eventos', eventoRouter)
app.use('/api/tiposEntradas', tipoEntradaRouter)
app.use('/api/organizadores', organizadorRouter)
app.use('/api/usuarios', usuarioRouter)
app.use('/api/categorias', categoriaRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() //never in production

app.listen(3001, () => {
  console.log('Server runnning on http://localhost:3001/')
})
