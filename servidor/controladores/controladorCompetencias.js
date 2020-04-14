
var con = require('../lib/conexionbd');



function todasLasCompetencias(req,res){
    var sql = 'select * from competencia where inactivo <> 1';
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

function obtenerCompetencia(req,res){
    id = req.params.id;
    var sql = 'select * from competencia where id = '+id;
    con.query(sql, function(error,resultado,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            nombre: resultado[0].nombre
        };
        res.send(JSON.stringify(response));
    
    });

}



function buscarOpciones(req,res){
    var id = req.params.id;

    var sql_competencia = 'select * from competencia where id='+ id;
    var sql_peliculas = 'select id as pelicula_id, pelicula.* from pelicula order by rand() limit 2 '

    con.query(sql_competencia, function(error,resultado_competencias,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        if (resultado_competencias.length == 0) {
            console.log('No existe el id de la competencia');
            return res.status(404).send("No existe la competencia");
        }
        
        var genero = resultado_competencias[0].genero_id;
        var actor = resultado_competencias[0].actor_id;
        var director = resultado_competencias[0].director_id;

        if (genero || actor || director){
            sql_peliculas = 'select p.id as pelicula_id, p.* from pelicula p '
        }

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
            sql_peliculas = sql_peliculas + ' order by rand() limit 2 '; 
        }


        con.query(sql_peliculas, function(error,resultado_peliculas,fields){
            if (error){
                console.log('Hubo un error en la consulta',error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }  

            if (resultado_peliculas.length < 2){
                console.log('No existen dos peliculas con los criterios seleccionados');
                return res.status(422).send("No existen dos peliculas con los criterios seleccionados");
                
            }
            
            var response = {
                
                'competencias': resultado_competencias[0].nombre,
                'peliculas': resultado_peliculas.map(el => {
                    rObj = {};
                    rObj['id']= el.pelicula_id;
                    rObj['poster']= el.poster;
                    rObj['titulo']= el.titulo;
                    return rObj;
                })
            };
    
            res.send(JSON.stringify(response));
        
        });
    
    });

}

function recibirVotos(req,res){
    var id_competencia = req.params.id;
    var voto = req.body;
    var id_pelicula = voto.idPelicula;


    var sql_competencia = 'select * from competencia where id='+ id_competencia;
    var sql_peliculas = 'select * from pelicula where id='+ id_pelicula; 
    var sql_voto = 'insert into voto values (null,' + id_competencia + ',' + id_pelicula + ')';

    con.query(sql_competencia, function(error,resultado_competencias,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        if (resultado_competencias.length == 0) {
            console.log('No existe el id de la competencia');
            return res.status(404).send("No existe la competencia");
        }

        con.query(sql_peliculas, function(error,resultado_peliculas,fields){
            if (error){
                console.log('Hubo un error en la consulta',error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            if (resultado_peliculas.length == 0) {
                console.log('No existe el id de la pelicula');
                return res.status(404).send("No existe la pelicula");
            }

            con.query(sql_voto, function(error,resultado_voto,fields){
                if (error){
                    console.log('Hubo un error en la consulta',error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
                res.status(200).send('Voto submitido correctamente');
                
            });
            
        });
    
    });

}


function resultadosCompetencias(req,res){
    var id = req.params.id;

    var sql_competencia = 'select c.nombre, v.id_pelicula, count(*) as cantidad, p.titulo, p.poster from voto v join competencia c on c.id = v.id_competencia join pelicula p on v.id_pelicula = p.id where v.id_competencia = ' + id + ' group by 1,2 order by 3 desc limit 3;';
    

    con.query(sql_competencia, function(error,resultado_competencias,fields){
        if (error){
            console.log('Hubo un error en la consulta',error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        if (resultado_competencias.length == 0) {
            console.log('La competencia no tuvo votos');
            return res.status(422).send("La competencia no tuvo votos");
        }
            var response = {
                'competencias': resultado_competencias[0].nombre,
                'resultados': resultado_competencias.map(el => {
                    rObj = {};
                    rObj['pelicula_id']= el.pelicula_id;
                    rObj['poster']= el.poster;
                    rObj['titulo']= el.titulo;
                    rObj['votos']= el.cantidad;
                    return rObj;
                })
            };
    
            res.send(JSON.stringify(response));
        
     
    
    });

}




module.exports = {
    
    todasLasCompetencias: todasLasCompetencias,
    buscarOpciones: buscarOpciones,
    recibirVotos: recibirVotos,
    resultadosCompetencias: resultadosCompetencias,
    obtenerCompetencia: obtenerCompetencia,
    

};