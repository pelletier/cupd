/*
 * IRC Bot widget
 */

/* Your exported code must stay in a single object */
my_code = {};

my_code.refresh = function(){
    var me = $('#'+this.name);
    me.html("<h3>On #ubuntu...</h3><p></p>");
    me.css('color', 'white');
};

/* The update function is called when your widget receives some informations
 * from its server-side friendly plugin.
 * The data argument is the raw data received by the dashboard.
 */
my_code.update = function(data){
    $('#'+this.name+' p').append("<div><span style='color: rgb(252, 149, 30);'>"+data.username+": </span>"+data.text+"</div>");
};

/* Finaly register your code into the client's dashboard code base.
 * 'hello_world' is the slugified name of the plugin. It is the plugin
 * identifier, so stay consistent otherwise your code will be doomed.
 */
code_base['irc_bot'] = my_code;
