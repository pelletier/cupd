var refresh = function(){
    $('#'+this.name).html('<h2>Hello world!</h2>');
};

var incoming_data = function(data) {
};


exports.refresh = refresh;
exports.incoming_data = incoming_data;
