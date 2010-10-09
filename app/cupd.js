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
var events = require('events');
var express = require('express');
var haml = require('../lib/haml');
var websocket = require('../lib/ws');



/*
 * UUID generator
 */

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01

    var uuid = s.join("");
    return uuid;
}


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

sys.log('Running in environment ' + environment);
var configuration = require('../config/'+environment);

for (variable_name in configuration) {
    var value = configuration[variable_name];
    app.set(variable_name, value);
}


/*
 * Create the services-side websocket server and define its callbacks.
 */

var websocket_services_server = websocket.createServer();


websocket_services_server.addListener('connection', function(conn){

    sys.log("[services] new connection");

    var uid = createUUID();
    conn.storage.set('uid', uid);
    conn.storage.set('authenticated', false);
    var message = { 'uid': uid, 'type': 'welcome' };
    conn.send( JSON.stringify(message) );


    conn.addListener('message', function(message){
        var output = {};
        message = JSON.parse(message);

        function must_authenticate() {
            if (conn.storage.get('authenticated') === false) {
                output.type = 'error';
                output.message = 'You must be authenticated';
                throw 'end';
            }
        }


        try{
            sys.log("Comparing " + message.uid);
            sys.log("With " + conn.storage.get('uid'));
            if (message.uid == undefined) {
                output.type = 'warning';
                output.message = 'You forgot the uid';
                throw 'end';
            }
            if (message.uid != conn.storage.get('uid')) {
                output.type = 'error';
                output.message = 'Bad uid';
                throw 'end';
            }

            switch (message.type) {
                case "auth":
                    conn.storage.set('name', message.name);
                    conn.storage.set('authenticated', true);
                    break;

                case "data":
                    must_authenticate();

                    var js_message = {};
                    js_message.type = 'data';
                    js_message.name = conn.storage.get('name');
                    js_message.data = message.data;

                    websocket_dashboard_server.broadcast(js_message);
                    output.type = 'success';
                    output.message = 'Data sent to the clients';
                    break;

                default:
                    output.type = 'error';
                    output.message = 'Bad message type';
                    throw 'end';
            }
        }
        catch(err) {
            if (err == 'end') {
                conn.send( JSON.stringify(output) );
            }
            else {
                sys.log("[services] " + err);
            }
        }
    });

});

/*
 * Create the websocket server and define its callbacks. Those are:
 *  - connection: triggered when a new connection is established.
 *  - close: triggered when a connection is closed (either properly or not).
 *  - messsage: triggered when a message is received from a client. According
 *      to the specs, it must be JSON-formatted.
 */

var websocket_dashboard_server = websocket.createServer();

/* Bind websocket callbacks */
websocket_dashboard_server.addListener('connection', function(conn){
    sys.log('[websocket] New connection.');

    /* As this is a new connection, we have to send to the client the source
     * code of every plugins. */
    sys.log('starting to send plugins');
    for (plugin_name in plugins) {
        sys.log('sending '+plugin_name);

        var js_message = {};
        js_message.name = plugin_name;
        js_message.type = 'new_widget';
        js_message.uri = "http://"+app.set('web_host')
                            + ":" + app.set('web_port')
                            + "/widget/" + plugin_name + "/";

        var json_message = JSON.stringify(js_message);
        conn.send(json_message);

        sys.log('sent');
    }
});

websocket_dashboard_server.addListener('close', function(conn){
    /* Remove the connection from the current ones */
    sys.log('[websocket] A connection closed.');
});

websocket_dashboard_server.addListener('message', function(message){
   /* Not used yet */ 
});


/*
 * Load the plugins into the 'plugins' variable. This variable is used as
 * a hash, associating the name of the plugin to its code.
 */

for (index in app.set('plugins')) {
    var plugin_name = app.set('plugins')[index];
    sys.log("Loading plugin " + plugin_name);

    plugins[plugin_name] = {};
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

websocket_services_server.listen(app.set('websocket_services_port'));
websocket_dashboard_server.listen(app.set('websocket_port'));
app.listen(app.set('web_port'));

sys.log("Services websocket - " + app.set('websocket_services_port'));
sys.log("Dashboard websocket - " + app.set('websocket_port'));
sys.log("Web dashboard - " + app.set('web_port'));

