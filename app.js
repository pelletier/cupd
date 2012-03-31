/** Module dependencies {{{ */

var express = require('express'),
    util = require('util'),
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
        "dashlayout": dash_conf["layout"]
    }
    res.render('dashboard.jade', variables);
});

app.listen(app.set('conf')["dashboard"]["port"]);
util.log("* Dashboard server - " + app.address().port);

/* }}} */
/** Dashboard WebSocket {{{ */

var dash_ws = new ws.Server(app.set('conf')["dashboard"]["websocket"]);
util.log("* Dashboard WebSocket server - " + dash_ws.options.port);

/* }}} */
/** Services WebSocket {{{ */

var services_ws = new ws.Server(app.set('conf')["services"]["websocket"]);
util.log("* Services WebSocket server - " + services_ws.options.port);
/* }}} */
