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
 * Side notes:
 *
 *  The '__dirname' variable is set by nodejs. It contains the absolute
 *  filesystem path to this very script (cupd.js).
 *
 *  The app.set() function used with only one argument actually means "get the
 *  configuration setting for key foo".
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
 * Script-wide variables
 */

var plugins = {};


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

    /* As this is a new connection, we have to send to the client the source
     * code of every plugins. */
    console.log('starting to send plugins');
    for (plugin_name in plugins) {
        console.log('sending '+plugin_name);

        var js_message = {};
        js_message.name = plugin_name;
        js_message.type = 'new_widget';
        js_message.uri = "http://"+app.set('web_host')
                            + ":" + app.set('web_port')
                            + "/widget/" + plugin_name + "/";

        var json_message = JSON.stringify(js_message);
        conn.send(json_message);

        console.log('sent');
    }
});

websocket_server.addListener('close', function(conn){
    /* Remove the connection from the current ones */
    var idx = websocket_connections.indexOf(conn.id);
    if(idx != -1) websocket_connections.splice(idx, 1);
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

/* /widget/<name> returns the complete client-side javascript code for the
 * given widget */
app.get('/widget/:name', function(req, res){
    var name = req.params.name;
    var read_stream = fs.createReadStream(__dirname + '/../plugins/'+name+'/widget.js');

    read_stream.setEncoding('utf8');

    read_stream.addListener("open", function(fd){
        res.writeHead(200, {"Content-type": "text/javascript"});
    });

    read_stream.addListener("data", function(data){
        res.write(data);
    });

    read_stream.addListener("error", function(err){
        res.writeHead(500, {"Content-type": "text/plain"});
        res.write("OMG han error happnzz" + err);
        res.close();
    });

    read_stream.addListener("close", function(){
        res.close();
    });
});

/*
 * Make the different servers to start listening on their respective ports (see
 * the /config/ files for more informations on settings.
 */

websocket_server.listen(app.set('websocket_port'));
app.listen(app.set('web_port'));


