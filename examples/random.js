var WebSocket = require('ws');

var ws = new WebSocket('ws://127.0.0.1:8000/')

var uid = null;

ws.on('open', function() {
    var auth_message = {
        'type': 'auth',
        'id': 'random',
        'password': 'another password'
    };

    ws.send(JSON.stringify(auth_message));
});


ws.on('message', function(raw_data) {
    var data = JSON.parse(raw_data);

    if (!data['type'] == 'auth') {
        console.log("This should not happen for now");
        return 1;
    }

    if (data['status'] == 'allowed') {
        uid = data['uid'];
        update();
    }
    else {
        console.log("Wrong credentials!");
    }
});


var data = [], totalPoints = 300;


var update = function () {
    if (data.length > 0) {
        data = data.slice(1);
    }


    while(data.length < totalPoints) {
        var prev = data.length > 0 ? data[data.length-1] : 50;
        var y = prev + Math.random() * 10 - 5;
        if (y < 0) {
            y = 0;
        }
        if (y > 100) {
            y = 100;
        }
        data.push(y);
    }

    var res = [];
    for (var i = 0; i < data.length; i++) {
        res.push([i, data[i]]);
    }


    var update_message = {
        'type': 'data',
        'uid': uid,
        'data': res
    };
    ws.send(JSON.stringify(update_message));
    setTimeout(update, 100);
}
