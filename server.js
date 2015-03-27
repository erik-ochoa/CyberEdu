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
	});
	
	socket.on('disconnect', function () {
		console.log(id + ' disconnected'); 
	});
	
	socket.on('request_image', function () {
		fs.readFile(__dirname + '\\images\\coffee_shop.jpg', function(err, buf){
			socket.emit('image', { image: 0, buffer: buf.toString('base64') });
		});
	
		fs.readFile(__dirname + '\\images\\go_to_the_coffee_shop.jpg', function(err, buf){
			socket.emit('image', { image: 1, buffer: buf.toString('base64') });
		});
	
		fs.readFile(__dirname + '\\images\\inventory.png', function (err, buf){
			socket.emit('image', { image: 2, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\mall.png', function (err, buf){
			socket.emit('image', { image: 3, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\freephonesoftware.png', function (err, buf){
			socket.emit('image', { image: 4, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\hookmyphoneup.png', function (err, buf){
			socket.emit('image', { image: 5, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\opensourcephones.png', function (err, buf){
			socket.emit('image', { image: 6, buffer: buf.toString('base64') });
		});
	});
	
	socket.on('request_audio', function () {
		fs.readFile(__dirname + '\\audio\\click.wav', function(err, buf) {
			socket.emit('audio', { audio: 0, buffer: buf.toString('base64') });
		});
	});
	
	socket.on('request_video', function (info) {
		fs.readFile(__dirname + '\\video\\' + info + '.mp4', function(err, buf) {
			socket.emit('video', { video: 0, buffer: buf.toString('base64') });
		});
	});
	
	socket.on('scene_complete', function (info) {
		console.log('Player ' + id + ' completed ' + info.scene + ' with score ' + info.score);
	});
});

http.listen(80, function(){
	console.log('Server started on port 80');
});