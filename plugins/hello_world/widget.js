alert('Hello, world!');

my_code = {};

my_code.refresh = function(){
    console.log('Hello world just refreshed!');
};

my_code.update = function(data){
    console.log('Hey dude, hello_world got updated with data: '+data);
};

code_base['hello_world'] = my_code;
