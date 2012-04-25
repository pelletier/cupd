var widget = new Object();

widget.id = 'random';
widget.height = 300;
widget.sources = ['random'];

widget.init = function(place) {
    var options = {
        series: { shadowSize: 0},
        yaxis: {min:0, max: 100},
        xaxis: {show: false}
    };

    place = this.get_place();
    place.html("<div id=\"placeholder\"></div>");
    var ph = place.find("#placeholder");
    ph.width(100);
    ph.height(100);

    var a = place.find("#placeholder");

    this.plot = $.plot(place.find("#placeholder"), [], options);
};

widget.draw = function(place) {
    place = this.get_place();
    var ph = place.find("#placeholder");
    ph.width(place.width());
    ph.height(place.height());
    this.plot.resize();
};

widget.on_data = function(place, data) {
    this.plot.setData([data]);
    this.plot.setupGrid();
    this.plot.draw();
};

register['random'] = widget;
