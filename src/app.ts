import express from 'express'
import cors from 'cors'
import { EventoRouter } from './evento/evento.routes.js'
import { CuentaRouter } from './cuenta/cuenta.routes.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/eventos', EventoRouter)
app.use('/api/cuentas', CuentaRouter)

app.use((req, res) => {
    return res.status(404).send({message:'Error 404. Recurso no encontrado!'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})

