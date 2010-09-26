/* Libraries loading */
var fs = require('fs');
var sys = require('sys');
var express = require('express');
var haml = require('../lib/haml');
var websocket = require('../lib/ws');


/* Create the central application based on Express */
var app = express.createServer();

/* Load the configuration */
var environment = 'development';
if ('NODE_ENV' in process.env) {
    environment = process.env['NODE_ENV'];
}

console.log('Running in environment ' + environment);
var configuration = require('../config/'+environment);
console.log(configuration);

for (variable_name in configuration) {
    var value = configuration[variable_name];
    app.set(variable_name, value);
}


/* Create the Websocket server */
var websocket_connections = [];
var websocket_server = websocket.createServer();

/* Bind websocket callbacks */
websocket_server.addListener('connection', function(conn){
    /* Store the connection for later */
    console.log('[websocket] New connection.');
    websocket_connections.push(conn.id);
});

websocket_server.addListener('close', function(conn){
    /* Remove the connection from the current ones */
    var idx = websocket_connections.indexOf(conn.id);
    if(idx != -1) websocket_connection.splice(idx, 1);
    console.log('[websocket] A connection closed.');
});

websocket_server.addListener('message', function(conn){
    /* Not used for now */

    /* Note: it will probably be used in order to let the users (admins?) set
     * the configuration live.
     */

    console.log('[websocket] message received!');
});

/* Let's load the plugins */
var plugins = new Array();
for (index in app.set('plugins')) {
    var plugin_name = app.set('plugins')[index];
    console.log("* Loading plugin " + plugin_name);
}

/* Set the static files path */
app.use(express.staticProvider(__dirname + '/../public'));
console.log(__dirname);

/* This is the dashboard by itself */
app.get('/', function(req, res){
    res.render('dashboard.haml', {
        locals: {
            websocket_uri: app.set('websocket_uri')
        }
    });
});


/* Start to listen on the given port */
websocket_server.listen(app.set('websocket_port'));
app.listen(app.set('web_port'));


