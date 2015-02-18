var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var nextID = 0;

app.get('/', function(req, res){
	res.sendFile(__dirname + '\\client.html');
});

io.on('connection', function(socket){	
	var id = nextID;
	nextID = nextID + 1;
	console.log(id + ' connected');
	fs.readFile(__dirname + '\\client.js', function(err, buf) {
		socket.emit('script', { buffer: buf.toString('base64') });
		console.log('Sending script');
	});
	socket.on('disconnect', function () {
		console.log(id + ' disconnected'); 
	});
	
	socket.on('request_image', function () {
		fs.readFile(__dirname + '\\images\\coffee_shop.jpg', function(err, buf){
			socket.emit('image', { image: 0, buffer: buf.toString('base64') });
			console.log('Sending image');
		});
	
		fs.readFile(__dirname + '\\images\\go_to_the_coffee_shop.jpg', function(err, buf){
			socket.emit('image', { image: 1, buffer: buf.toString('base64') });
			console.log('Sending image');
		});
	
		fs.readFile(__dirname + '\\images\\inventory.png', function (err, buf){
			socket.emit('image', { image: 2, buffer: buf.toString('base64') });
			console.log('Sending image');
		});
	});
	
});

http.listen(80, function(){
	console.log('Server started on port 80');
});