var con = require('../lib/conexionbd');

function crearCompetencia(req,res){
    nombre = req.body.nombre;
    genero = req.body.genero;
    director = req.body.director;
    actor = req.body.actor;

    genero = (genero > 0) ? genero : null;
    actor = (actor > 0) ? actor : null;
    director = (director > 0) ? director : null;

    sql_peliculas = 'select * from pelicula p '
    
    if (actor){
        sql_peliculas = sql_peliculas + ' join actor_pelicula ap on p.id = ap.pelicula_id '
    }

    if (director){
        sql_peliculas = sql_peliculas + ' join director_pelicula dp on p.id = dp.pelicula_id '
    }

    if (genero || actor || director){
        sql_peliculas = sql_peliculas + ' where ';
    }
    
    if (genero) {
        sql_peliculas = sql_peliculas + ' genero_id = ' + genero + ' and'
    }

    if (actor) {
        sql_peliculas = sql_peliculas + ' ap.actor_id = ' + actor + ' and'
    }

    if (director) {
        sql_peliculas = sql_peliculas + ' dp.director_id = ' + director + ' and'
    }

    if (genero || actor || director){
        sql_peliculas = sql_peliculas.slice(0, -3);
    }
    
    var sql = 'insert into competencia (id, nombre, genero_id, director_id, actor_id ) values (null,"'+ nombre + '", ' + genero + ',' + director + ',' + actor  + ' );';
    
    con.query(sql_peliculas, function(error,resultado_chequeo,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        if (resultado_chequeo.length<2){
            console.log('No existen dos peliculas con los criterios seleccionados');
            return res.status(422).send("No existen dos peliculas con los criterios seleccionados");
        }

        con.query(sql, function(error,resultado,fields){
            if (error){
                console.log('Hubo un error en la consulta',error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            var response = {
                
            };
            res.status(200).send('Elemento Creado');
        
        });
    });
}

function borrarTodosVotos(req,res){
    id = req.params.id;
    var sql = 'delete from voto where id_competencia='+ id + ';';
    con.query(sql, function(error,resultado,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length == 0) {
            console.log('No existe el id de la competencia');
            return res.status(404).send("No existe la competencia");
        }
 ;
        res.status(200).send('Elemento Borrado');
    
    });

}

function todosLosGeneros(req,res){
    var sql = 'select id,nombre from genero';
    con.query(sql, function(error,resultado,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            
        };
        res.status(200).send(JSON.stringify(resultado));
    
    });

}

function todosLosDirectores(req,res){
    var sql = 'select id,nombre from director';
    con.query(sql, function(error,resultado,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            
        };
        res.send(JSON.stringify(resultado));
    
    });

}

function todosLosActores(req,res){
    var sql = 'select id,nombre from actor';
    con.query(sql, function(error,resultado,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            
        };
        res.send(JSON.stringify(resultado));
    
    });

}

function editarNombre(req,res){
    var id = req.params.id;
    var nombre = req.body.nombre;
    var sql = 'update competencia set nombre = "' + nombre + '" where id = ' + id;
    con.query(sql, function(error,resultado,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.status(200).send('Elemento editado');
    
    });

}

function eliminarCompetencia(req,res){
    var id = req.params.id;
    
    var sql = 'update competencia set inactivo = 1 where id = ' + id;
    con.query(sql, function(error,resultado,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.status(200).send('Elemento eliminado');
    
    });

}


module.exports = {
    
    crearCompetencia: crearCompetencia,
    borrarTodosVotos: borrarTodosVotos,
    todosLosGeneros: todosLosGeneros,
    todosLosDirectores: todosLosDirectores,
    todosLosActores: todosLosActores,
    editarNombre: editarNombre,
    eliminarCompetencia: eliminarCompetencia

};