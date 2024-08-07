import express from 'express';
import { eventoRouter } from './evento/evento.routes.js';
const app = express();
app.use(express.json());
app.use('/api/eventos', eventoRouter);
app.use((req, res) => {
    return res.status(404).send({ message: 'Recurso no encontrado' });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
// user -> request -> express -> middleware que forme el req.body (express.json()) -> app.post -> response -> user
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
//# sourceMappingURL=app.js.map