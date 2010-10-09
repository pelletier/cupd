/*
 * Hello world
 *
 * An example widget for Cupd.
 * It is meant to show the minimal requirements for building a working Cupd
 * widget. Please read the corresponding wiki pages for more informations.
 */

/* Your exported code must stay in a single object */
my_code = {};

/* The refresh function is called by the dashboard to force your widget to
 * display nicely (for instance when the user loads the page, or changes
 * critical display settings).
 */
my_code.refresh = function(){
    console.log('Hello world just refreshed!');
    console.log('my father is ');
    console.log(this);

    var me = $('#'+this.name);
    me.html("<h3>Hello, world!</h3><p></p>");
    me.css('color', 'white');
};

/* The update function is called when your widget receives some informations
 * from its server-side friendly plugin.
 * The data argument is the raw data received by the dashboard.
 */
my_code.update = function(data){
    $('#'+this.name+' p').html(data.text);
};

/* Finaly register your code into the client's dashboard code base.
 * 'hello_world' is the slugified name of the plugin. It is the plugin
 * identifier, so stay consistent otherwise your code will be doomed.
 */
code_base['hello_world'] = my_code;
