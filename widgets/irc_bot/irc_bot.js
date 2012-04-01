/*
 * IRC Bot widget
 */

/* Your exported code must stay in a single object */
var widget = new Object();

widget.id = 'irc_bot';
widget.height = 300;
widget.sources = ['irc_bot'];


widget.draw = function(place) {
    place.html("<h3>On #archlinux...</h3><p></p>");
};

/* The update function is called when your widget receives some informations
 * from its server-side friendly plugin.
 * The data argument is the raw data received by the dashboard.
 */
widget.on_data = function(place, data) {
    place.find('p').append("<div><span style='color: rgb(252, 149, 30);'>"+data.username+": </span>"+data.text+"</div>");
    if (place.find('p div').size() > 15) {
        place.find('p div').first().remove();
    }
};

/* Finaly register your code into the client's dashboard code base.
 * 'hello_world' is the slugified name of the plugin. It is the plugin
 * identifier, so stay consistent otherwise your code will be doomed.
 */
register['irc_bot'] = widget;
