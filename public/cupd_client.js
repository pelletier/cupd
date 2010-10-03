/*
 * This is the browser-side javascript code of cupd.
 *
 * Note:
 *  jQuery must be loaded before this script.
 *  The browser which runs this script must be websocket-76 compliant.
 */



/*
 * Define global variables
 */

var widgets = {};
var code_base = new Object();


/*
 * Define some handsome functions
 */

function dynamic_load_js(uri, callback){
    $.getScript(uri, callback);
}


/*
 * Define the websocket callbacks
 */

var websocket_onopen = function(event) {
    console.log('Websocket connection opened.');
};

var websocket_onclose = function(event) {
    console.log('Websocket connection closed.');
};

var websocket_onmessage = function(event) {
    console.log('Message received through websocket.');

    /* This message must be JSON-formatted (specs) */
    var message = JSON.parse(event.data);

    if (message.type == 'new_widget') {
        var name = message.name;
        var uri = message.uri;

        dynamic_load_js(uri, function(){
            var new_widget = new Widget(name);
            widgets[name] = new_widget;
            widgets[name].refresh();

        });
    }
};

var websocket_onerror = function(event) {
    console.log('Websocket error happened:' + event.data);
};


/*
 * Define the widget object
 */

function Widget(name) {
    console.log('Creating widget ' + name);
    /* Retain its name */
    this.name = name;
    /* Create a new div to display in */
    $('body').append("<div class='widget' id='"+this.name+"'></div>");

    /* Grab its loaded code base */
    var code = code_base[name];
    
    /* Associate the given code */
    this.refresh = code.refresh;
    this.update = code.update;
}

/*
 * Callbacks triggered when the webpage is fully loaded. Used to initiate most
 * of connections and other callbacks.
 */

$(document).ready(function(){
    /* 
     * Once the very very small page is loaded, initiate the websocket
     * connection.
     */

    var websocket_uri = "ws://"+WEBSOCKET_SERVER;

    var websocket = new WebSocket(websocket_uri);
    websocket.onopen = websocket_onopen;
    websocket.onclose = websocket_onclose;
    websocket.onmessage = websocket_onmessage;
    websocket.onerror = websocket_onerror;
    
});
