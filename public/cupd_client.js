/*
 * This is the browser-side javascript code of cupd.
 *
 * Note:
 *  jQuery must be loaded before this script.
 *  The browser which runs this script must be websocket-76 compliant.
 */


/*
 * Define the websocket callbacks
 */

var websocket_onopen = function(event) {
    console.log('Websocket connection opened.');
}

var websocket_onclose = function(event) {
    console.log('Websocket connection closed.');
}

var websocket_onmessage = function(event) {
    console.log('Message received through websocket.');
}

var websocket_onerror = function(event) {
    console.log('Websocket error happened:' + event.data);
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
