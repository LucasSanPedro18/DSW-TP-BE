import express from 'express';
import { evento } from './evento.js';
import { categoria } from './categoria.js';
import { cuenta } from './cuenta.js';
import { entrada } from './entrada.js';
import { localidad } from './localidad.js';
import { organizador } from './organizador.js';
import { pais } from './pais.js';
import { tipoentrada } from './tipoentrada.js';
import { usuario } from './usuario.js';
const app = express();
app.use(express.json());
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
const eventos = [
    new evento(123123, 'Techno', 3000, 'asdasd', 123, 'asdasd', 20),
];
const categorias = [
    new categoria(' ', 'asdsdasdasd'),
];
const cuentas = [
    new cuenta('', 'asdsdasdasd', 'asdasdasd1', '', 1),
];
const entradas = [
    new entrada(31, 'asdasdasd', 69, true, 999, false),
];
const localidades = [
    new localidad(''),
];
const organizadores = [
    new organizador('23012798475832467829569', 1),
];
const paises = [
    new pais('Argentina'),
];
const tipoEntradas = [
    new tipoentrada('Argentina', 999999, 5),
];
const usuarios = [
    new usuario('20202020202020', 1, 0),
];
app.get('/api/eventos', (req, res) => {
    res.json(eventos);
});
app.get('/api/eventos/:id', (req, res) => {
    const nuevoEvento = eventos.find((evento) => evento.idEvento === Number(req.params.id));
    if (!nuevoEvento) {
        res.status(404).send({ message: 'evento no encontrado' });
    }
    res.json(nuevoEvento);
});
app.post('/api/eventos', (req, res) => {
    //req.body donde se encuentra la informacion del post
    const { idEvento, nombre, cuposGral, descripcion, fotoEvento, fecha, hora } = req.body;
    const nuevoEvento = new evento(idEvento, nombre, cuposGral, descripcion, fotoEvento, fecha, hora);
    eventos.push(nuevoEvento);
    res.status(201).send({ message: 'Evento creado', data: nuevoEvento });
});
app.get('/api/categorias', (req, res) => {
    res.json(categorias);
});
app.get('/api/lasdosjuntas', (req, res) => {
    const lasdosjuntas = {
        evento: eventos,
        categoria: categorias,
    };
    res.json(lasdosjuntas);
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map