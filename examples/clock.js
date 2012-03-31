var WebSocket = require('ws');

var ws = new WebSocket('ws://127.0.0.1:8000/')

var uid = null;

ws.on('open', function() {
    var auth_message = {
        'type': 'auth',
        'id': 'clock',
        'password': 'this is dog'
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

var update = function () {
    var now = new Date();
    var update_message = {
        'type': 'data',
        'uid': uid,
        'data': now.toTimeString()
    };
    ws.send(JSON.stringify(update_message));
    setTimeout(update, 1000);
}
