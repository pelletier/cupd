var widget = new Object();

widget.id = "hello_world";
widget.height = 200;
widget.sources = []; // Does not register any source.

widget.draw = function(place) {
    place.html("Hello world");
};

widget.on_data = function(place, data) {
    // This widget actually does not receive data.
};


register["hello_world"] = widget;
