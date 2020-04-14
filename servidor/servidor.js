
require('dotenv').config();



//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controladorCompetencias = require('./controladores/controladorCompetencias');
var controladorAdministrador = require('./controladores/controladorAdministrador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', controladorCompetencias.todasLasCompetencias);
app.get('/competencias/:id/peliculas', controladorCompetencias.buscarOpciones);
app.get('/competencias/:id/resultados', controladorCompetencias.resultadosCompetencias);
app.get('/competencias/:id', controladorCompetencias.obtenerCompetencia);
app.get('/generos', controladorAdministrador.todosLosGeneros);
app.get('/actores', controladorAdministrador.todosLosActores);
app.get('/directores', controladorAdministrador.todosLosDirectores);

app.post('/competencias/:id/voto', controladorCompetencias.recibirVotos);
app.post('/competencias', controladorAdministrador.crearCompetencia);

app.put('/competencias/:id', controladorAdministrador.editarNombre);

app.delete('/competencias/:id/votos', controladorAdministrador.borrarTodosVotos);
app.delete('/competencias/:id', controladorAdministrador.eliminarCompetencia);
//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

