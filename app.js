/** Module dependencies {{{ */

var express = require('express'),
    util = require('util'),
    fs = require('fs'),
    ws = require('ws');

/* }}} */
/** Bootstrap Express {{{ */

var app = module.exports = express.createServer();

/* }}} */
/** Configuration {{{ */

// Configure Express.
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/widgets'));
});

// Add some environment-based configuration (errors logging).
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Load the user Cupd configuration.
util.log("Loading configuration");
var configuration = require('./config');
app.set('conf', configuration);

/* }}} */
/** Dashboard {{{ */

app.get('/', function(req, res) {
    var dash_conf = app.set('conf')["dashboard"];
    var variables = {
        "style": dash_conf["style"],
        "dashlayout": dash_conf["layout"],
        "ws_server": dash_conf["ws_uri"]
    }
    res.render('dashboard.jade', variables);
});

app.listen(app.set('conf')["dashboard"]["port"]);
util.log("* Dashboard server - " + app.address().port);

/* }}} */
/** Dashboard WebSocket {{{ */

/* Load plugins */
var plugins = [];
fs.readdir("./widgets/", function(err, files) {
    util.log("Loading widgets");

    plugins = files.filter(function(f) { return f.indexOf(".") == -1 });

    util.log("= " + plugins.join(", "));
});

/* Create the server */
var clients = [];
var dash_ws = new ws.Server(app.set('conf')["dashboard"]["websocket"]);
util.log("* Dashboard WebSocket server - " + dash_ws.options.port);

dash_ws.on('connection', function(ws) {
    // TODO: Just one message should be sent.
    util.log("Connection established.");
    for (index in plugins) {
        var message = {
            "type": "new_widget",
            "name": plugins[index]
        };
        ws.send(JSON.stringify(message));
    }
    clients.push(ws);
});

/* }}} */
/** Services WebSocket {{{ */

function createUUID() {
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = "4";
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01]]

    var uuid = s.join("");
    return uuid;
}


var services_passwords = app.set('conf')["services"]["list"];

var services_ws = new ws.Server(app.set('conf')["services"]["websocket"]);
util.log("* Services WebSocket server - " + services_ws.options.port);


services_ws.on('connection', function(ws) {
    util.log("New service connected");

    this.uid = null;
    this.id = null;

    ws.on('message', function(message) {
        var data = JSON.parse(message);

        switch(data['type']) {
            case 'auth':
                if (services_passwords[data['id']] == data['password']) {
                    this.uid = createUUID();
                    var response = {
                        'type': 'auth',
                        'status': 'allowed',
                        'uid': this.uid
                    };
                    this.id = data['id'];
                    ws.send(JSON.stringify(response));
                }
                else {
                    var response = {
                        'type': 'auth',
                        'status': 'denied',
                    };
                    ws.send(JSON.stringify(response));
                }
                break;

            case "data":
                if (this.uid == null) {
                    var response = {
                        'type': 'error',
                        'message': 'You are not authenticated.',
                    };
                    ws.send(JSON.stringify(response));
                }
                else {
                    for (index in clients) {
                        var c = clients[index];
                        var msg = {
                            'type': 'data',
                            'id': this.id,
                            'data': data['data']
                        };
                        c.send(JSON.stringify(msg));
                    }
                    // TODO: Send a response to the service?
                }
                break;

            default:
                util.log('Unhandled request');
                break;
        }
    });
});

/* }}} */
