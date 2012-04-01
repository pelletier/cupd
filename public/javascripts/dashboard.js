/* Global variable handling the widgets */
var widgets = [];
var register = new Object();

/* Register a new widget.
 * Loads the code and create fully working widget object */
function register_widget(widget) {
    console.log("Registering " + widget.id);
    widget.place_height = 0;
    widget.place_width = 0;

    widget.get_place = function() {
        return $("#dashboard #"+this.id);
    }

    widgets.push(widget);

    $("#dashboard").append("<div class=\"widget\" id=\""+widget.id+"\"></div>");

    try {
        widget.init(widget.get_place());
    }
    catch(e) {
        console.log("Widget init failure: " + e);
    }
}

/* Compute the layout and redraw every widget. */
function draw_widgets() {
    var dash = $("#dashboard");
    // The layout function is defined in the flexiblegrid.js file (or any other
    // layout file included in dashboard.jade).
    var wlayout = layout(widgets, dash.width(), dash.height());

    for (index in wlayout) {
        var w = wlayout[index];
        var place = w.get_place();
        place.width(w.place_width);
        place.height(w.place_height);
        w.draw(place);
    }

}

/* WebSocket connection opened callback */
function websocket_onopen() {
    console.log("Websocket opened.");
}

/* WebSocket connection closed callback */
function websocket_onclose() {
    console.log("Websocket connection closed.");
}

/* WebSocket message received callback */
function websocket_onmessage(evt) {
    console.log("Websocket message received.");
    var data = JSON.parse(evt.data);


    switch(data["type"]) {
        case "new_widget":
            var name = data["name"];
            console.log("widget " + name);
            $.getScript("/"+name+"/"+name+".js", function (s, textStatus) {
                console.log(textStatus);
                register_widget(register[name]);
                delete register[name];
                draw_widgets();
            });
            break;

        case "data":
            var id = data['id'];
            for (i in widgets) {
                var w = widgets[i];
                if (w.sources.indexOf(id) != -1) {
                    w.on_data(w.get_place(), data['data']);
                }
            }
            break;

        default:
            console.log("Unhandled type.");
            break;
    }
}

/* WebSocket error happened callback */
function websocket_onerror(err) {
    console.log("Websocket error received.");
}


/* Setup and initialization once the page is loaded. */
$(document).ready(function(){
    // Check for WebSocket.
    if (!("WebSocket" in window)) {
        alert("Your browser does not support WebSocket. Go upgrade!");
        return false;
    }

    // Establish the connection with the server through WebSocket.
    var websocket_uri = "ws://"+WEBSOCKET_SERVER;
    var websocket = new WebSocket(websocket_uri);
    websocket.onopen = websocket_onopen;
    websocket.onclose = websocket_onclose;
    websocket.onmessage = websocket_onmessage;
    websocket.onerror = websocket_onerror;

    // Recompute the layout and redraw the widgets when the window is resized.
    $(window).resize(draw_widgets);

    // Draw for the first time.
    draw_widgets();
});
