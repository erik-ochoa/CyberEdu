var app = require('express')();
var http_lib = require('http');
var https = require('https');
var http = http_lib.Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var SERVER_HOSTNAME = 'jrhansf.student.umd.edu';

var nextID = 0;
var used_usernames = [];

var ticket_to_username = [];

app.get('/login', function(req, res) {
	res.redirect('https://login.umd.edu/cas/login?service=http%3A%2F%2F' + SERVER_HOSTNAME + '%2F');
});

app.get('/', function (req, res) {
	if (req.query.ticket) {
		var request_path = '/cas/validate?ticket=' + req.query.ticket + '&service=http%3A%2F%2F' + SERVER_HOSTNAME + '%2F';
		https.get({ 
			host: 'login.umd.edu', 
			path: request_path }, function (validation_response) {
				var response_text = "";
				validation_response.on('data', function (chunk) {
					response_text += chunk.toString();
				});
				validation_response.on('end', function () {
					response_text = response_text.split('\n');
					if (response_text[0] == "yes") {
						var username = response_text[1];
						ticket_to_username[ticket_to_username.length] = [req.query.ticket, username];
						res.sendFile(__dirname + '\\client.html');
					} else {
						res.sendFile(__dirname + '\\loginfailed.html');
					}
				});
			}
		);
	} else {
		res.redirect('https://login.umd.edu/cas/login?service=http%3A%2F%2F' + SERVER_HOSTNAME + '%2F');
	}	
});

app.get('/mfa', function(req, res) {
	res.sendFile(__dirname + '\\video\\mfa.mp4');
});

app.get('/passwords', function(req, res) {
	res.sendFile(__dirname + '\\video\\Video 1 Passwords.mp4');
});

app.get('/virusremoval', function(req, res) {
	res.sendFile(__dirname + '\\video\\virusremoval.mp4');
});

app.get('/wifisniff', function(req, res) {
	res.sendFile(__dirname + '\\video\\wifisniff.mp4');
});

io.on('connection', function(socket){	
	var ticket = socket.handshake.headers.referer.split('ticket=')[1];
	var username = "";
	var saved_game_state;
	for (var i = 0; i < ticket_to_username.length; i++)
		if (ticket_to_username[i][0] == ticket)
			username = 	ticket_to_username.splice(i, 1)[0][1]
		
	if (username != "") {
		fs.readFile(__dirname + '\\users\\' + username, function (err, buf) {
			if (err && err.code == "ENOENT") {
				// Ignore this error, means a never before seen user has connected, and their data file doesn't exist
			} else if (err) {
				throw err;
			} else {
				saved_game_state = buf.toString('utf-8');
			}
		});
	}
	var id = nextID;
	nextID = nextID + 1;
	console.log(id + ' connected');
	
	fs.readFile(__dirname + '\\client.js', function(err, buf) {
		socket.emit('script', { buffer: buf.toString('base64') });
		if (saved_game_state) {
			socket.emit('load_save', saved_game_state);
			console.log('load_save event emitted');
		}
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
		
		fs.readFile(__dirname + '\\images\\mall 1.jpg', function (err, buf){
			socket.emit('image', { image: 3, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Freephonesoftware.jpg', function (err, buf){
			socket.emit('image', { image: 4, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Hookupmyphonedotnet.jpg', function (err, buf){
			socket.emit('image', { image: 5, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Opensourcephones.jpg', function (err, buf){
			socket.emit('image', { image: 6, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\browser_widescreen.jpg', function (err, buf){
			socket.emit('image', { image: 7, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\registration_page_demo.png', function (err, buf){
			socket.emit('image', { image: 8, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\404.png', function (err, buf) {
			socket.emit('image', { image: 9, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\phone.png', function (err, buf) {
			socket.emit('image', { image:10, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\phone_off.gif', function (err, buf) {
			socket.emit('image', { image:11, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\phone_home.png', function (err, buf) {
			socket.emit('image', { image:12, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\phone_install_software.png', function (err, buf) {
			socket.emit('image', { image:13, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\freephonesoftwarewebpage.png', function (err, buf) {
			socket.emit('image', { image:14, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Hookupmyphonedotnetwebpage.png', function (err, buf) {
			socket.emit('image', { image:15, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Opensourcephoneswebpage.png', function (err, buf) {
			socket.emit('image', { image:16, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\phone_all_programs_screen.png', function (err, buf) {
			socket.emit('image', { image:17, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\phone_inbox_screen.png', function (err, buf) {
			socket.emit('image', { image:18, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Library.jpg', function (err, buf) {
			socket.emit('image', { image:19, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Librarian-Close-Up.jpg', function (err, buf) {
			socket.emit('image', { image:20, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Zoom-1.jpg', function (err, buf) {
			socket.emit('image', { image:21, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Zoom-2.jpg', function (err, buf) {
			socket.emit('image', { image:22, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\Zoom-3.jpg', function (err, buf) {
			socket.emit('image', { image:23, buffer: buf.toString('base64') });
		});
		
		fs.readFile(__dirname + '\\images\\computer_file_system.png', function (err, buf) {
			socket.emit('image', { image:24, buffer: buf.toString('base64') });
		});
	});
	
	socket.on('request_audio', function () {
		fs.readFile(__dirname + '\\audio\\click.wav', function(err, buf) {
			socket.emit('audio', { audio: 0, buffer: buf.toString('base64') });
		});
	});
	
	socket.on('register', function (info) {
		var username_already_taken = false;
		console.log('User ' + id + ' registration information:\nusername: ' + info.username + '\npassword: ' + info.password + '\nemail: ' + info.email + '\nmfa: ' + info.mfa);
		for (var i = 0; i < used_usernames.length; i++)
			if (used_usernames[i] == info.username)
				username_already_taken = true;
		if (username_already_taken) {
			socket.emit('register_success', { success: false });
		} 
		else {
			fs.appendFile(__dirname + '\\users.txt', info.username + ' ' + info.password + ' ' + info.email + ' ' + info.mfa + '\r\n', function (err) {	});
			used_usernames[used_usernames.length] = info.username;
			socket.emit('register_success', { success: true });
		}
	});
	
	socket.on('scene_complete', function (info) {
		console.log('Player ' + id + ' completed ' + info.scene + ' with score ' + info.score);
	});
	
	socket.on('save_game', function (info) {
		fs.writeFile(__dirname + '\\users\\' + username, info, function (err) {
			if (err) {
				console.log("IO error in socket.on save_game");
				console.log(err);
			}
		});
	});
});

fs.readFile(__dirname + '\\users.txt', {encoding: 'utf-8'}, function (err, buf) {
	if (buf) {
		lines = buf.toString().split("\r\n");
		for (var i = 0; i < lines.length; i++) {
			columns = lines[i].split(" ");
			used_usernames[used_usernames.length] = columns[0];
		}
	}
});

http.listen(80, function(){
	console.log('Server started on port 80');
});