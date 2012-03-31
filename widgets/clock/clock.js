var widget = new Object();

widget.id = "clock";
widget.height = 200;
widget.sources = ['clock'];

widget.draw = function(place) {
    place.html("<h3>"+this.time+"</h3>");
}

widget.on_data = function(place, data) {
    place.html("<h3>"+data+"</h3>");
}

register["clock"] = widget;
