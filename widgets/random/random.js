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
    console.log(a.width());

    this.plot = $.plot(place.find("#placeholder"), [], options);
};

widget.draw = function(place) {
    place = this.get_place();
    var ph = place.find("#placeholder");
    console.log(ph.width());
    console.log(place.width());
    ph.width(place.width());
    ph.height(place.height());
    this.plot.resize();
    console.log(this.plot.width());
};

widget.on_data = function(place, data) {
    console.log(this);
    console.log(this.plot.height());

    this.plot.setData([data]);
    this.plot.setupGrid();
    this.plot.draw();
};

register['random'] = widget;
