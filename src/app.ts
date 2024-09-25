import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { EventoRouter } from './evento/evento.routes.js'
import { CuentaRouter } from './cuenta/cuenta.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'

const app = express()
app.use(express.json())
app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})
app.use(cors())

app.use('/api/eventos', EventoRouter)
app.use('/api/cuentas', CuentaRouter)

app.use((req, res) => {
    return res.status(404).send({message:'Error 404. Recurso no encontrado!'})
})

await syncSchema() //never in production

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})

