var MIN_WIDTH = 300;

function layout(widgets, dashboard_width, dashboard_height) {
    var number_per_row = Math.max(Math.floor(dashboard_width/MIN_WIDTH), 1);

    var rows = [];
    var current_row = [];
    var current_row_height = 0;

    var count = 0;
    for (index in widgets) {
        current_row.push(widgets[index]);
        current_row_height = Math.max(current_row_height, widgets[index].height);
        count += 1;

        if (count == number_per_row || index == widgets.length - 1) {
            count = 0;
            rows.push([current_row, current_row_height]);
            current_row = [];
            current_row_height = 0;
        }
    }

    output_w = [];

    for (row_i in rows) {
        var row = rows[row_i][0];
        var height = rows[row_i][1];
        var width = dashboard_width / row.length - 2;

        for (index in row) {
            var w = row[index];
            w.place_width = width;
            w.place_height = height;
            output_w.push(w);
        }
    }

    return output_w;
}
