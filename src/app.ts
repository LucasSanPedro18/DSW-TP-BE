import express from 'express'
import { evento } from './evento.js'

const app = express()


// get -> obtener info sobre recursos
// get /api/characters/ -> obtener la lsita de characters || get /api/characters/:id -> obtener el character con id = :id
//
// post -> crear nuevos recursos 
// post /api/characters/ -> crea nuevo character
//
// delete -> borrar recursos
// delete /api/characters/:id -> borrar character con id = :id
//
//put & patch -> modificar recursos
//put & patch /api/characters/:id -> modifica character con id = :id
//
// character -> /api/characters/


const unEvento = [
    new evento (
        123123,
        'Techno',
        3000,
        'asdasd',
        123,
        'asdasd',
        20,
    ),
]

app.get('/api/eventos',(req,res)=>{
    res.json(unEvento)
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})