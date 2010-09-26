/*
 * This is the server-side javascript code of cupd.
 *
 * Required libraries (ie, not built-in):
 *  - nodejs
 *  - expressjs
 *
 * You can start the cupd server with the following command:
 *  node app/cupd.js
 *
 * Side note:
 *  The '__dirname' variable is set by nodejs. It contains the absolute
 *  filesystem path to this very script (cupd.js).
 */


/*
 * Load the neeed libraries.
 */
var fs = require('fs');
var sys = require('sys');
var express = require('express');
var haml = require('../lib/haml');
var websocket = require('../lib/ws');


/*
 * Create the central application based on Express
 */

var app = express.createServer();


/*
 * Load the configuration according to the NODE_ENV variable. If NODE_ENV is
 * not provided, the fallback value is 'development'. The environement name is
 * used to grab the /config/<NODE_ENV>.js file.
 */

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


/*
 * Create the websocket server and define its callbacks. Those are:
 *  - connection: triggered when a new connection is established.
 *  - close: triggered when a connection is closed (either properly or not).
 *  - messsage: triggered when a message is received from a client. According
 *      to the specs, it must be JSON-formatted.
 */

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
     * the configuration live. */

    console.log('[websocket] message received!');
});


/*
 * Load the plugins into the 'plugins' variable. This variable is used as
 * a hash, associating the name of the plugin to its code.
 */

var plugins = {};
for (index in app.set('plugins')) {
    var plugin_name = app.set('plugins')[index];
    console.log("* Loading plugin " + plugin_name);

    var plugin_code = require('../plugins/'+plugin_name+'/'+plugin_name);
    plugins[plugin_name] = plugin_code;
}


/*
 * Configure the Express server static files. Those are actually:
 *  - jquery
 *  - the cupd client javascript library (cupd_client.js)
 *  - the dashboard.css file
 */

app.use(express.staticProvider(__dirname + '/../public'));


/*
 * Configure the views of the Express server.
 */

/* / maps to the dashboard by itself. */
app.get('/', function(req, res){
    res.render('dashboard.haml', {
        locals: {
            websocket_uri: app.set('websocket_uri')
        }
    });
});


/*
 * Make the different servers to start listening on their respective ports (see
 * the /config/ files for more informations on settings.
 */

websocket_server.listen(app.set('websocket_port'));
app.listen(app.set('web_port'));


