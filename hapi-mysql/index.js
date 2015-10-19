var Hapi = require('hapi');
//var corsHeaders = require('hapi-cors-headers')
//import and use mysql package to connect with mySql db
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'demo'
});
connection.connect();
//import and use hapi plugin to handle server services
var server = new Hapi.Server();
server.connection({
  host : 'localhost',
  port: 3000,
  routes: {cors: true}
});

server.route({
    method:'GET',
    path:'/people',
    handler: function(request, reply){
        connection.query('SELECT * FROM people', function(err, rows, fields) {
          if (err) throw err;
          reply(rows);
        });
    }
});

server.route({
    method:'GET',
    path:'/person/{id}',
    handler: function(request, reply){
        connection.query('SELECT * FROM people WHERE id=' + request.params.id, function(err, rows, fields) {
          if (err) throw err;
          reply(rows[0]);
        });
    }
});

server.route({
    method:'DELETE',
    path:'/person/{id}',
    handler: function(request, reply){
        connection.query('DELETE FROM people WHERE id=' + request.params.id, function(err, rows, fields) {
          if (err) throw err;
          reply('success');
        });
    }
});


server.route({
    method:'PUT',
    path:'/person',
    handler: function(request, reply){
        var person = {
            firstname: request.payload.firstname,
            lastname: request.payload.lastname,
            birthdate: request.payload.birthdate,
            description: request.payload.description
        };
        connection.query("UPDATE people SET ? WHERE id= ? ",[person, request.payload.id],
        function(err, rows, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
            reply('success');
        });
    }
});

server.route({
    method:'POST',
    path:'/person',
    handler: function(request, reply){
        var person = {
            firstname: request.payload.firstname,
            lastname: request.payload.lastname,
            birthdate: request.payload.birthdate,
            description: request.payload.description
        };
        connection.query("INSERT INTO people set ? ",person,
        function(err, rows, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
            reply('success');
        });
    }
});


server.start(function(){
     console.log('Server running at:', server.info.uri);
});


