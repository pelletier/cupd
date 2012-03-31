var widgets = [];

function register_widget(name, height) {
    var object = new Object();
    object.name = name;
    object.height = height;
    object.place_height = 0;
    object.place_width = 0;


    object.draw = function(place) {
        place.html(this.name);
    };

    object.get_place = function() {
        return $("#dashboard #"+this.name);
    }

    widgets.push(object);

    $("#dashboard").append("<div class=\"widget\" id=\""+name+"\"></div>");
}

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

$(document).ready(function(){
    // add a couple of testing widgets
    register_widget("Helloworld", 200);
    register_widget("Clock1", 200);
    register_widget("Problemslist", 300);
    register_widget("Clock2", 200);
    register_widget("Helloworldbob", 200);
    register_widget("Clock1bob", 200);
    register_widget("Problemslistbob", 300);
    register_widget("Clock2bob", 200);
    register_widget("Problemslisttest", 300);
    register_widget("Clock2test", 200);

    $(window).resize(function() {
        draw_widgets();
    });

    draw_widgets();
});
