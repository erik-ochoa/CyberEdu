var http = require('http');
var https = require('https');
var socket_io = require('socket.io');
var fs = require('fs');
var url = require('url');
var child_process = require('child_process');

var app = http.createServer(handler);
var io = socket_io(app);

var SERVER_HOSTNAME = "http://localhost:8011"
var SERVER_PORT = 8011;
var EXCEPTION_EMAIL_NOTIFICATIONS_ENABLED = false;
var STDIN_COMMANDS_ENABLED = true;
var SURVEY_URL = "http://goo.gl/forms/D3BDtNGoFQEYKKL02"

// Include modules here.
eval(fs.readFileSync(__dirname + '/coffee_shop.js').toString());
eval(fs.readFileSync(__dirname + '/mall_scene.js').toString());
eval(fs.readFileSync(__dirname + '/library.js').toString());
eval(fs.readFileSync(__dirname + '/apartment.js').toString());
eval(fs.readFileSync(__dirname + '/introduction.js').toString());
eval(fs.readFileSync(__dirname + '/police_station.js').toString());
eval(fs.readFileSync(__dirname + '/final_module.js').toString());

// Prevent entire server from crashing in the event a single user causes an error.
process.on('uncaughtException', function (err) {
	writeToServerLog("system | Error: An exception has been caught at the top level. The server will continue to run.\r\n" + err.stack);

	if (EXCEPTION_EMAIL_NOTIFICATIONS_ENABLED) {
		sendEmail("FROM: cyber_edu@umd.edu\r\n" +
			"TO: jrhansf@terpmail.umd.edu\r\n" +
			"SUBJECT: Uncaught Exception on cyberedu.umd.edu\r\n" +
			"MIME-Version: 1.0\r\n" +
			"Content-Type: text/plain\r\n" +
			"\r\n" +
			err.stack
		);
	}
});


if (STDIN_COMMANDS_ENABLED) {
	// Reads from standard input. Seems to be reading one line at a time.
	process.stdin.on('data', function(data) {
		data = data.toString();
		if (data.indexOf("\r\n") != data.length - 2) {
			throw new Error ("Assertion Error: stdin read didn't end with CR LF.");
		} else {
			var command = data.substring(0, data.length - 2);
			if (command == "sessions") {
				console.log(active_sessions);
			} else if (command == "time") {
				console.log(Date.now());
			} else {
				console.log("Unrecognized command.");
			}
		}
	});
}

var Session = function (cookie, ip, username) {
	this.cookie = cookie;
	this.ip_address = ip;
	this.username = username;
	this.connected = false;
	this.created = Date.now();
	// Expiration date is in milliseconds since January 1, 1970.
	// This sets the expiration to five minutes from now.
	// The user will have five minutes to connect to Socket IO before the session times out.
	this.expires = this.created + 300000;
};

/* Map of session cookie OR user name -> Session object */
var active_sessions = {};

/* Helper function to generate a session id.
 * Ensures generation of an id that isn't already being used.
 */
function generateSessionId () {
	var id = Math.random().toString(36);
	while (typeof active_sessions[id] !== 'undefined')
		id = Math.random().toString(36);
	return id;
}

/* Helper function to grab the session cookie out of the cookies received from the HTTP header. */
function parseSessionCookie(cookies) {
	if (typeof cookies === 'undefined')
		return undefined;
	else {
		var split = cookies.split(';');
		for (var i = 0; i < split.length; i++) {
			var split2 = split[i].split('=');
			if (split2[0].trim() == 'session')
				return split2[1].trim();
		}
		return undefined;
	}
}

/* Helper function to test if a session has expired.
 * Note that an open connection will never expire.
 */
function hasExpired (session) {
	return !(session.connected || session.expires > Date.now());
}

/* Clears out all expired sessions.
 * DO NOT CALL THIS METHOD anywhere in the code because it sets up a timer to run itself again in the future.
 */
function clearExpiredSessions () {
	writeToServerLog("system | Clearing expired sessions. Active sessions are: " + JSON.stringify(active_sessions));
	for (item in active_sessions) {
		if (hasExpired(active_sessions[item])) {
			delete active_sessions[item];
		}
	}
	setTimeout(clearExpiredSessions, 3600000); // This runs every hour.
}

/* Guesses the MIME type of a given file based on its file extension. */
function guessMimeType(filename) {
	var split = filename.split('.');
	var extension = split[split.length - 1];

	if (extension == "html") {
		return "text/html";
	} else if (extension == "js") {
		return "application/javascript";
	} else if (extension == "css") {
		return "text/css";
	} else if (extension == "gif") {
		return "image/gif";
	} else if (extension == "jpg") {
		return "image/jpeg";
	} else if (extension == "png") {
		return "image/png";
	} else if (extension == "ico") {
		return "image/x-icon";
	} else if (extension == "mp3") {
		return "audio/mpeg";
	} else if (extension == "mp4") {
		return "video/mp4";
	} else if (extension == "wmv") {
		return "video/x-ms-wmv";
	} else {
		writeToServerLog("system | Warning: MIME type for " + filename + " could not be guessed.");
		return "text/plain";
	}
}

/* Processes an incoming HTTP request that has been authenticated. */
function processAuthenticatedRequest(request, response) {
	var request_url = url.parse(request.url, true);
	writeToServerLog("client: " + request.socket.remoteAddress + " | Responding with the file " + request_url.pathname + ".");

	var file;
	if (request_url.pathname == "/") {
		file = __dirname + '/index.html';
	} else {
		file = __dirname + request_url.pathname;
	}

	// Commented out code in this block handles HTTP range requests.  Doing so seems to cause problems with Internet Explorer.
	fs.stat(file, function (err, stats) {
		if (err) {
			response.writeHead(500);
			response.end("Error loading " + file);
		} else /*if (typeof request.headers.range === 'undefined') */ {
			var inputStream = fs.createReadStream(file);

			//response.setHeader('Accept-Ranges', 'bytes');
			response.setHeader('Content-Length', stats.size);
			response.setHeader('Content-Type', guessMimeType(file));
			response.writeHead(200);

			inputStream.on('open', function () {
				inputStream.pipe(response);
			});

			inputStream.on('error', function (err) {
				writeToServerLog("client : " + request.socket.remoteAddress + " | A ReadStream error occurred.");
				response.end();
				throw err;
			});
		} /* else {
			// Must serve the requested range of the file only.
			var range = request.headers.range;

			if (range.substring(0,6) != "bytes=") {
				response.writeHead(416);
				response.end();
				writeToServerLog("system | Encountered an HTTP range it couldn't parse: " + range);
			} else {
				console.log(range);
				var rangeParts = range.substring(6).split("-");
				var start;
				var end;

				if (rangeParts.length == 0 || rangeParts.length > 2) {
					response.writeHead(416);
					response.end(); // Something is wrong with the range.
					writeToServerLog("system | Encountered an HTTP range it couldn't parse: " + range);
				} else {
					if (rangeParts.length == 1 || rangeParts[1] == "") {
						start = parseInt(rangeParts[0]);
						end = stats.size - 1;
					} else {
						start = parseInt(rangeParts[0]);
						end = parseInt(rangeParts[1]);
					}
					if (start > end || start > stats.size || start < 0 || end < 0 || end > stats.size) {
						response.writeHead(416); // Range is out of bounds.
						response.end();
						writeToServerLog("system | Encountered an HTTP range out of bounds: " + range + " file length was : " + stats.size);
					} else {
						response.setHeader('Accept-Ranges', 'bytes');
						response.setHeader('Content-Length', end - start + 1);
						response.setHeader('Content-Type', guessMimeType(file));
						response.setHeader('Range', "bytes " + start + "-" + end + "/" + stats.size);
						response.writeHead(206);

						var inputStream = fs.createReadStream(file, {start: start, end: end});
						inputStream.on('open', function () {
							inputStream.pipe(response);
							console.log('input stream successfully piped in range request.');
							console.log('start = ' + start + ' end = ' + end);
						});

						inputStream.on('error', function (err) {
							writeToServerLog("client : " + request.socket.remoteAddress + " | A ReadStream error occurred.");
							response.end();
							throw err;
						});
					}
				}
			}
		}*/
	});
}

// Deals with incoming HTTP requests.
function handler (request, response) {
	var request_url = url.parse(request.url, true);
	writeToServerLog("client: " + request.socket.remoteAddress + " | HTTP request received for " + request_url.pathname + " with cookies " + request.headers.cookie + " and query parameters " + JSON.stringify(request_url.query));
	var session_cookie = parseSessionCookie(request.headers.cookie);

	// For some reason (at least IE and Firefox) sometimes do not send the cookies when requesting the favicon. This permits the favicon to be accessed without authentication.
	if (request_url.pathname == "/favicon.ico") {
		processAuthenticatedRequest(request, response);
		return;
	}

	// If the user has already logged in.
	if (typeof session_cookie !== 'undefined' && typeof active_sessions[session_cookie] !== 'undefined' && active_sessions[session_cookie].ip_address == request.socket.remoteAddress && !hasExpired(active_sessions[session_cookie])) {
		processAuthenticatedRequest(request, response);
	} else {

		if (typeof request_url.query.ticket === 'undefined') {
			// The user has not started the login process and, needs to be redirected to CAS.
			writeToServerLog("client: " + request.socket.remoteAddress + " | Redirecting user to the CAS server.");
			response.setHeader("Location", "https://login.umd.edu/cas/login?service=" + encodeURIComponent(SERVER_HOSTNAME + request_url.pathname));
			response.writeHead(303);
			response.end();
		} else {
			// The user has entered their login credentials into CAS and provided the server with a CAS ticket which must be validated.
			var cas_request = https.request ({ hostname: "login.umd.edu", port: 443, path: "/cas/validate?service=" + encodeURIComponent(SERVER_HOSTNAME + request_url.pathname) + "&ticket=" + request_url.query.ticket }, function (cas_response) {
				var validation_response = "";

				cas_response.on('data', function (chunk) {
					validation_response += chunk.toString();
				});

				cas_response.on('end', function () {
					var response_lines = validation_response.split("\n");
					if (response_lines[0] == "yes") {
						var username = response_lines[1];

						if (typeof active_sessions[username] !== 'undefined' && active_sessions[username].connected) {
							// User logged in successfully, but already had a valid session.
							response.writeHead(403);
							response.end("Login failed.\r\n\r\nReason: You're already logged in.");

							writeToServerLog("client: " + request.socket.remoteAddress + " | failed to login: already logged in.");
						} else {
							// Delete the previous session for this user, if one exists.
							// This is not session hijacking, since the user has started a new session and has authenticated through CAS.
							if (typeof active_sessions[username] !== 'undefined') {
								delete active_sessions[active_sessions[username].cookie];
								writeToServerLog("client: " + request.socket.remoteAddress + " | deleted previous session for " + username + ".");
							}

							// Creates and stores a new session for this user.
							var cookie = generateSessionId();
							response.setHeader("Set-Cookie", "session = " + cookie + "; PATH=/;");
							var new_session = new Session(cookie, request.socket.remoteAddress, username);
							active_sessions[cookie] = new_session;
							active_sessions[username] = new_session;

							writeToServerLog("client: " + request.socket.remoteAddress + " | logged in as " + username + ".");
							processAuthenticatedRequest(request, response);
						}
					} else {
						response.writeHead(403);
						response.end("Login failed.\r\n\r\nReason: CAS validation failed. Try deleting ?ticket=" + request_url.query.ticket + " from the URL and try again.");

						writeToServerLog("client: " + request.socket.remoteAddress + " | failed to login: bad CAS ticket.");
					}
				});
			});

			cas_request.on('error', function (err) {
				writeToServerLog("client: " + request.socket.remoteAddress +  " | An error occurred sending the validation request to CAS.");

				response.writeHead(500);
				response.end("Error communicating with the authentication server.");

				throw err;
			});

			writeToServerLog("client: " + request.socket.remoteAddress + " | Sending validation HTTPS request to CAS server");
			cas_request.end();
		}
	}
}

/* Sends an email message using sendmail.
 * content must be a string variable in MIME format, which is the entire
 * content of the email message. An example message could look like this:
TO: jrhansf@terpmail.umd.edu
FROM: cyber_edu@umd.edu
SUBJECT: the message's subject
MIME-Version: 1.0
Content-Type: multipart/alternative;boundary="boundary1"

--boundary1
Content-Type: text/plain

This the body of the message goes here. This section is a fallback for email clients that do not support (or are configured to refuse) HTML email content.
--boundary1
Content-Type: multipart/related;boundary="boundary2"

--boundary2
Content-Type: text/html

<html>
<body>
<p> The body of the message goes here. This will be displayed for most email clients, who support HTML. </p>
<p> Note that it is even possible to include an image in the email, like this: </p>
<img src="cid:image001"> </img>
</body>
</html>
--boundary2
Content-Type: image/gif
Content-Id: <image001>
Content-Transfer-Encoding: base64

(Image in base64 format)
--boundary2--

--boundary1--
 * Note that the FROM address MUST be cyber_edu@umd.edu.
 */
function sendEmail (content) {
	if (/FROM: cyber_edu@umd\.edu/i.test(content)) {
		var mail_process = child_process.exec('sendmail -t', function (error, stdout, stderr) {
			if (error) {
				writeToServerLog("sendmail | An error occurred. Error code: " + error);
			}
		});

		mail_process.stdin.write(content);
		mail_process.stdin.end();
	} else {
		throw new Error ("Invalid or unspecified FROM address in email content. Email was not sent.");
	}
}

/* This function updates the leaderboard page based on the current information in the save files.
 * DO NOT CALL THIS FUNCTION anywhere in the code, because it sets a timer to run itself again in the future.
 */
function updateLeaderboard () {
	fs.readdir(__dirname + '/saves', function (err, files) {
		if (err) throw err;

		/* To define additional leaderboard fields, you need to:
		 * - Set the field in the leaderboard_row object based on the game object inside the fs.readFile() callback.
		 * - Add the field to the total score (if desired).
		 * - Add the field to the leaderboard HTML itself in the writeLeaderboard() function.
		 */
		var leaderboard_row = [];

		// This runs when all the files have been read in
		function writeLeaderboard () {
			var outputStream = fs.createWriteStream(__dirname + '/leaderboard.html');

			leaderboard_row.sort(function (a, b) {
				// Sorts on total score in descending order.
				return b.total_score - a.total_score;
			});

			outputStream.write('<!DOCTYPE HTML>\r\n<html>\r\n<head>\r\n');
			outputStream.write('\t<meta charset="UTF-8">\r\n\t<title>CyberEdu Leaderboard</title>\r\n\t<link rel="shortcut icon" href="/favicon.ico"/>\r\n\t<style>\r\n');
			outputStream.write('\t\ttable, th, td {\r\n\t\t\tborder: 1px solid black;\r\n\t\t}\r\n'); // Creates a border around each cell, and the entire table.
			outputStream.write('\t\ttable td:last-child {\r\n\t\t\ttext-align: right;\r\n\t\t}\r\n'); // Aligns the text in the total score column to the right.
			outputStream.write('\t</style>\r\n</head>\r\n<body>\r\n\t<table>\r\n');
			outputStream.write('\t\t<tr> <th>Name</th> <th>Introduction </th> <th> Mall </th> <th>Coffee Shop</th> <th>Apartment</th> <th>Library</th> <th>Police Station</th> <th>Dorm Room</th> <th>Total</th> </tr>\r\n');
			for (var i = 0; i < leaderboard_row.length; i++) {
				outputStream.write('\t\t<tr> <td> '	+ leaderboard_row[i].player_name + '</td> <td>'
				+ leaderboard_row[i].introduction_score + '</td> <td>'
				+ leaderboard_row[i].mall_score + '</td> <td>'
				+ leaderboard_row[i].coffee_shop_score + '</td> <td>'
				+ leaderboard_row[i].apartment_score + '</td> <td>'
				+ leaderboard_row[i].library_score + '</td> <td>'
				+ leaderboard_row[i].police_station_score + '</td> <td>'
				+ leaderboard_row[i].dorm_room_score + '</td> <td>'
				+ leaderboard_row[i].total_score + '</td> </tr>\r\n');
			}

			outputStream.write('\t</table>\r\n');
			outputStream.write('\t<p>Last Updated: ' + new Date() + '</p>\r\n');
			outputStream.write('</body>\r\n</html>\r\n');
			outputStream.end(function () {
				writeToServerLog("system | wrote the leaderboard.");
			});
		}

		var files_processed = 0;

		for (var i = 0; i < files.length; i++) {
			/* This is a closure. It ensures that the
			 * correct value of i is passed into each of the callbacks. */
			(function (i) {
				fs.readFile(__dirname + '/saves/' + files[i], function (err, data) {
					if (err) throw err;

					var game_object = JSON.parse(data);

					leaderboard_row[i] = {};
					leaderboard_row[i].player_name = game_object.player_name;
					leaderboard_row[i].introduction_score = typeof game_object.introduction_variables === 'undefined' ? 0 : game_object.introduction_variables.score;
					leaderboard_row[i].mall_score = typeof game_object.mall_scene_variables === 'undefined' ? 0 : game_object.mall_scene_variables.score;
					leaderboard_row[i].coffee_shop_score = typeof game_object.coffee_shop_variables === 'undefined' ? 0 : game_object.coffee_shop_variables.score;
					leaderboard_row[i].apartment_score = typeof game_object.apartment_variables === 'undefined' ? 0 : game_object.apartment_variables.score;
					leaderboard_row[i].library_score = typeof game_object.library_variables === 'undefined' ? 0 : game_object.library_variables.score;
					leaderboard_row[i].police_station_score = typeof game_object.police_station_variables === 'undefined' ? 0 : (game_object.police_station_variables.module_complete ? 1 : 0);
					leaderboard_row[i].dorm_room_score = typeof game_object.final_module_variables === 'undefined' ? 0 : (game_object.final_module_variables.final_module_complete ? 1 : 0);

					leaderboard_row[i].total_score = leaderboard_row[i].introduction_score + leaderboard_row[i].mall_score + leaderboard_row[i].coffee_shop_score + leaderboard_row[i].apartment_score + leaderboard_row[i].library_score + leaderboard_row[i].police_station_score + leaderboard_row[i].dorm_room_score;

					files_processed++;
					if (files_processed == files.length) {
						writeLeaderboard();
					}
				});
			})(i);
		}
	});

	setTimeout(updateLeaderboard, 3600000); // Every hour.
}

/* Helper function that writes a line in the server log.
 */
function writeToServerLog (string) {
	console.log(new Date().toUTCString() + " | " + string);
}

app.listen(SERVER_PORT);
setTimeout(clearExpiredSessions, 3600000);
updateLeaderboard(); // Call this immediately.
writeToServerLog("system | CyberEDU server firing up on port " + SERVER_PORT);

/* Constructors */

/* Although it is possible in JavaScript to define classes (objects with methods), I
 * avoid doing so here because functions cannot be saved in JSON format.
 * Therefore, functions are defined separately from the objects, and take the objects as arguments.
 */

/* An invisible, rectangular button. Optionally may have associated text.
 * The first five arguments (name through y2) are required.
 * The three (text through font_color) are optional, but if text is provided, all must be provided.
 * The last (help_text) has meaning only for text field objects. It defines the text to show if the input field is blank and not selected.
 *
 * This constructor is also used to build text input fields. In that case, all input arguments are required.
 */
var Button = function (name, x1, y1, x2, y2, layer, text, font, font_color, help_text) {
	if (typeof text !== 'undefined' && (typeof font === 'undefined' || typeof font_color === 'undefined'))
		throw new Error("Illegal call to Button constructor; text provided, but not all optional arguments were provided!");

	this.name = name;
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.layer = layer;
	this.text = text;
	this.font = font;
	this.font_color = font_color;
	this.help_text = help_text;

};

// The image with the specified ID in the client HTML code, drawn at the specified position.
// The scale argument is optional, and if provided, it specifies the scale at which the image should be drawn.
var Image = function(id, x, y, layer, scale) {
	this.type = 'image';
	this.id = id;
	this.x = x;
	this.y = y;
	this.layer = layer;
	this.scale = scale;
};

// An animated GIF image, drawn at the specified position
var Animation = function (id, x, y, layer, callbackRequested) {
	this.type = 'animation'
	this.id = id;
	this.x = x;
	this.y = y;
	this.layer = layer;
	this.callbackRequested = callbackRequested;
}

// Text drawn at the specified position.
var Text = function (name, x1, y1, x2, y2, layer, text, font, font_color) {
	this.type = 'text';
	this.name = name;
	this.x = x1;
	this.y = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.layer = layer;
	this.text = text;
	this.font = font;
	this.font_color = font_color;
};

// A solid rectangle, drawn at the specified position.
var Rectangle = function (name, x1, y1, x2, y2, layer, fill_style) {
	this.type = 'rectangle';
	this.name = name;
	this.x = x1;
	this.y = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.layer = layer;
	this.font_color = fill_style;
};

/* A screen is a compound display element, consisting of a base display element (Image, Text, or Rectangle),
 * with additional display elements and buttons drawn on top of the base.
 * The additional display elements may be screens themselves.
 * All coordinates are relative to the x, y, and layer specified in this object. (Ex: if this.(x,y) = (40, 40), and base_element.(x,y) = (20, 20),
 * the base element will be drawn at position (60, 60). */
var Screen = function (x, y, layer, base_element, buttons, textInputFields, extra_elements) {
	this.type = 'screen';
	this.x = x;
	this.y = y;
	this.layer = layer;
	this.base = base_element;
	this.buttons = buttons;
	this.textFields = textInputFields;
	this.extras = extra_elements;
};

/* An extension of a regular screen, which is intended to mimic mobile App stores and be used
 * as the prompt when downloading apps. It has all the fields an ordinary screen has, and therefore
 * can be used anywhere that a screen may be.
 * The download_count argument should be an integer
 * The app permissions argument should be a comma-separated string.
 * Important note: the buttons are named app_purchase_screen_<app_name>_download and app_purchase_screen_<app_name>_cancel.
 * The cancel button's event is automatically handled, and returns the user to the phone's home screen. */
var AppPurchaseScreen = function (x, y, layer, app_icon_id, app_name, app_category, app_developer, download_count, app_permissions, app_description) {
	this.type = 'screen'
	this.x = x;
	this.y = y;
	this.layer = layer;
	this.base = new Rectangle ("app_purchase_screen_" + app_name + "_base", 0, 0, 173, 291, 0, 'rgba(255, 255, 255, 1)');

	/* Modification warning: the definition of the download button must be identical in the uninstallPhoneApp function,
	* and in the installPhoneApp function, the _already_installed text element should be created in the same position.
	*/
	this.buttons = [new Button ("app_purchase_screen_" + app_name + "_download", 5, 80, 84, 96, 3, "  Download", "11px Times", "rgba(0, 0, 0, 1)"),
					new Button ("app_purchase_screen_" + app_name + "_cancel", 89, 80, 168, 96, 3, "  Cancel", "11px Times", "rgba(0, 0, 0, 1)")
	];
	this.textFields = [];
	this.extras = [new Image (app_icon_id, 10, 10, 1),
					new Text("app_purchase_screen_" + app_name + "_title", 70, 10, 173, 30, 2, app_name, "14px Arial", "rgba(0, 0, 0, 1)"),
					new Text("app_purchase_screen_" + app_name + "_category", 70, 30, 173, 45, 2, app_category, "12px Arial", "rgba(0, 0, 0, 1)"),
					new Text("app_purchase_screen_" + app_name + "_developer", 70, 45, 173, 60, 2, "By " + app_developer, "12px Arial", "rgba(0, 0, 0, 1)"),
					new Text("app_purchase_screen_" + app_name + "_downloads", 70, 60, 173, 75, 2, "Downloads: " + download_count.toString(), "11px Times", "rgba(0, 0, 0, 1)"),
					new Text("app_purchase_screen_" + app_name + "_permissions", 5, 105, 168, 123, 2, "Permissions: " + app_permissions, "11px Arial", "rgba(0, 0, 0, 1)"),
					new Text("app_purchase_screen_" + app_name + "_description", 5, 125, 168, 293, 2, app_description, "12px Arial", "rgba(0, 0, 0, 1)"),
					new Rectangle("app_purchase_screen_" + app_name + "_download_button_background", 5, 80, 84, 96, 2, 'rgba(0, 255, 128, 1)'),
					new Rectangle("app_purchase_screen_" + app_name + "_cancel_button_background", 89, 80, 168, 96, 2, 'rgba(192, 192, 192, 1)')
	];
	/* Stored for possible future access. Modifying these fields will not effect the screen itself, so
	 * they are effectively read only. */
	this.app_icon_id = app_icon_id;
	this.app_name = app_name;
	this.app_category = app_category;
	this.app_developer = app_developer;
	this.download_count = download_count;
	this.app_permissions = app_permissions;
	this.app_description = app_description;
}

/* This is a sub-class of screen, which represents a vertically scrolling list.
 * Adding buttons/textFields/extras directly to this element should not be done (or at least done with extreme caution).
 *
 * Unlike the base screen, the lower and right boundaries are also required, for the purpose of deciding which elements can be displayed and which elements should not.
 * The scrolling list also contains two buttons, with names scrolling_list_<name>_scroll_up and scrolling_list_<name>_scroll_down, where <name> is the string passed as the name parameter.
 * Those buttons will control the scroll position appropriately.
 *
 * This constructor creates an empty scrollable list. Elements must be added through the .....
 */
var ScrollableList = function (name, x1, y1, x2, y2, layer, base) {
	var SCROLL_BUTTON_WIDTH = 10;
	var SCROLL_BUTTON_HEIGHT = 20;
	var SCROLL_BUTTON_FONT = '18px Arial';

	this.type = 'screen'
	this.x = x1;
	this.y = y1;
	this.layer = layer;
	this.base = base;

	this.scroll_position = 0;
	this.display_elements = [];
	this.display_element_sizes = [];
	this.x2 = x2;
	this.y2 = y2;
	this.width = this.x2 - this.x;
	this.height = this.y2 - this.y;

	this.buttons = [
		new Button ("scrolling_list_" + name + "_scroll_up", this.width - SCROLL_BUTTON_WIDTH, this.height/2 - SCROLL_BUTTON_HEIGHT, this.width, this.height/2, base.layer + 1, "/\\", SCROLL_BUTTON_FONT, 'rgba(0,0,0,1)'),
		new Button ("scrolling_list_" + name + "_scroll_down", this.width - SCROLL_BUTTON_WIDTH, this.height/2, this.width, this.height/2 + SCROLL_BUTTON_HEIGHT, base.layer + 1, "\\/", SCROLL_BUTTON_FONT, 'rgba(0,0,0,1)')
	];
	this.textFields = [];
	this.extras = [];
}

/* Helper function related to ScrollableList. Based on the current scroll position, determines the y-coordinate of the top of the element at the given index.
 * Note that this function can return a negative value (if the scroll position is past the given element).
 */
function yPositionOfScrollableListElement(scrollableList, index) {
	var i = scrollableList.scroll_position;
	if (i == index) {
		return 0;
	} else if (index > i) {
		var yPos = 0;
		for (; i < index; i++) {
			yPos += scrollableList.display_element_sizes[i];
		}
		return yPos;
	} else if (index < i) {
		var yPos = 0;
		for (; i >= index; i--) {
			yPos -= scrollableList.display_element_sizes[i];
		}
		return yPos;
	}
}

/* Helper function related to ScrollableList. Returns true if the element at the given index should be displayed on the screen, based on the current scroll position. */
function scrollableListElementDisplayable(scrollableList, index) {
	var yPos = yPositionOfScrollableListElement(scrollableList, index);
	return yPos >= 0 && yPos + scrollableList.display_element_sizes[index] <= scrollableList.height;
}

/* An internet browser in game. Each device can have its own object, to preserve common sense.
 * The usage of the browser object's screen field is such that it has one element in the extras list, a screen, @ (0, 70), the webpage*/
var Browser = function () {
	this.url = "";
	this.screen = new Screen(0, 0, 0, new Image("image/browser/blank", 0, 0, 0), [new Button("browser-minimize", 679, 24, 705, 48, 0), new Button("browser-x", 764, 24, 789, 48, 0)], [new Button("browser-bar", 32, 18, 668, 49, 1, "", "18px Arial", "rgba(0,0,0,1)")], [BLANK_BROWSER_SCREEN]);
};

/* A dialog box. The canvas object passed in (game.canvas) contains an x and y field to size the box.
 * The name of a dialog box is part of the button names
 * The title is the text appearing at the top of the dialog box.
 * The text is the text appearing within the dialog box.
 * The array of options is the replies available to the user. The click event received when an option is click is dialog_<title>_<option text>
 * The usage convention of this object is not to display its screen directly, because the main screen's buttons will still be present under it.
 * It should be displayed via the showDialog() function, which will handle clearing out the underlying buttons, and cleared with the closeDialog() function, which will restore them. */
var Dialog = function (name, title, text, options) {
	this.name = name;
	this.title = title;
	this.text = text;
	this.options = options;
};

/* A folder within a computer file system. */
var Folder = function (name, contents) {
	this.type = 'folder';
	this.name = name;
	this.contents = contents;

	// Add the contents to the screen.
	// Possible issue: path bar. Solution: setup the screen, as with the dialog.
};

/* A computer's file system. */
var FileSystem = function () {
	this.currentDirectory = "";
	// A file is a string. A folder is object with three elements, name: a string, the name of the folder, contents:, an array of files and folders, and screen, the screen for this folder.
	this.files = new Folder ("", []);
}

/* A message in the player's email inbox.
Subject, sender, and message are strings. attachments is an array of strings.

The last argument, command_on_read, is optional, and is a string. If provided, it specifies that when this email is read, some code will be executed when the email is read.
See the markAsRead function for examples of usage of this field.
*/
var EmailMessage = function (subject, sender, message, attachments, command_on_read) {
	this.subject = subject;
	this.sender = sender;
	this.message = message;
	this.attachments = attachments;
	this.unread = true;

	this.command_on_read = command_on_read;
}

/*  Name: the name of this app
	Icon: 32x32 display element @ position (0,0) in layer 0, for use as the icon of this app.
	Screen_name: The name of the main screen of this app (where the user goes when they start it).
	Purchase_screen_name: The name of the download screen for this app (note that this is required).
*/
var PhoneApp = function (name, icon, screen_name, purchase_screen_name) {
	this.name = name;
	this.icon = icon;
	this.screen_name = screen_name;
	this.purchase_screen_name = purchase_screen_name;
}

var TodoTask = function(name, locationOfTask, task) {
	this.name = name;
	this.task = task;
	this.locationOfTask = locationOfTask;
	this.text = null;
	this.completed = false;
}

// Constants
var PHONE_X = 200;
var PHONE_Y_RAISED = 400;
var PHONE_Y_LOWERED = 50;
var PHONE_LAYER = 100;

var PHONE_SCREEN_X = PHONE_X - 13;
var PHONE_SCREEN_Y = PHONE_Y_RAISED - 56;
var PHONE_SCREEN_LAYER = PHONE_LAYER + 1;

var PHONE_POWER_BUTTON_BOUNDS = /*[x1, y1, x2, y2], relative to bottom right corner.*/ [125, 46, 75, 10]

var BLANK_BROWSER_SCREEN = new Screen(0, 70, 1, new Rectangle("blankInternetBrowserRectangle", 0, 0, 800, 530, 0, 'rgba(0,255,0,1)'), [], [], []);

var DIALOG_LAYER = 250;
var DIALOG_BORDER_SIZE = 2;
var DIALOG_BUTTON_HEIGHT = 100;
var DIALOG_BUTTON_PADDING = 5;

var MAX_DISPLAYED_MAILBOX_ENTRIES = 17;
var MAX_TODO_LIST_TASKS = 5;


function drawDisplayObject (element, commands) {
	drawDisplayObjectHelper (element, commands, 0, 0, 0);
}

/* Pushes the commands needed to draw the display element into the commands argument. */
function drawDisplayObjectHelper (element, commands, dx, dy, dl) {
	if (element["on_screen"]) {
		writeToServerLog("Warning: display element may have been drawn twice: " + JSON.stringify(element));
	}
	
	element.on_screen = true;
	element.on_screen_x = element.x + dx;
	element.on_screen_y = element.y + dy;
	element.on_screen_layer = element.layer + dl;
	
	if (element.type == 'image') {
		if (typeof element.scale !== 'undefined') {
			commands.push(["drawImage", element.id, element.on_screen_x, element.on_screen_y, element.on_screen_layer, element.scale]);
		} else {
			commands.push(["drawImage", element.id, element.on_screen_x, element.on_screen_y, element.on_screen_layer]);
		}
	} else if (element.type == 'animation') {
		commands.push(["drawAnimation", element.id, element.on_screen_x, element.on_screen_y, element.on_screen_layer, element.callbackRequested]);
	} else if (element.type == 'text') {
		commands.push(["drawText", element.name, element.on_screen_x, element.on_screen_y, element.x2 + dx, element.y2 + dy, element.on_screen_layer, element.text, element.font, element.font_color]);
	} else if (element.type == 'rectangle') {
		commands.push(["drawRectangle", element.name, element.on_screen_x, element.on_screen_y, element.x2 + dx, element.y2 + dy, element.on_screen_layer, element.font_color]);
	} else if (element.type == 'screen') {
		drawDisplayObjectHelper(element.base, commands, element.on_screen_x, element.on_screen_y, element.on_screen_layer);

		for (var i = 0; i < element.buttons.length; i++) {
			if (element.buttons[i].text) {
				commands.push(["addButton", element.buttons[i].name, element.buttons[i].x1 + element.on_screen_x, element.buttons[i].y1 + element.on_screen_y, element.buttons[i].x2 + element.on_screen_x, element.buttons[i].y2 + element.on_screen_y, element.buttons[i].layer + element.on_screen_layer, element.buttons[i].text, element.buttons[i].font, element.buttons[i].font_color]);
			} else {
				commands.push(["addButton", element.buttons[i].name, element.buttons[i].x1 + element.on_screen_x, element.buttons[i].y1 + element.on_screen_y, element.buttons[i].x2 + element.on_screen_x, element.buttons[i].y2 + element.on_screen_y, element.buttons[i].layer + element.on_screen_layer]);
			}
		}

		for (var i = 0; i < element.textFields.length; i++) {
			commands.push(["addTextInputField", element.textFields[i].name, element.textFields[i].x1 + element.on_screen_x, element.textFields[i].y1 + element.on_screen_y, element.textFields[i].x2 + element.on_screen_x, element.textFields[i].y2 + element.on_screen_y, element.on_screen_layer + element.textFields[i].layer, element.textFields[i].text, element.textFields[i].font, element.textFields[i].font_color, element.textFields[i].help_text]);
		}

		for (var i = 0; i < element.extras.length; i++) {
			drawDisplayObjectHelper(element.extras[i], commands, element.on_screen_x, element.on_screen_y, element.on_screen_layer);
		}
	}
}

/* Pushes the commands needed to clear the specified display element into the commands argument. */
function clearDisplayObject (element, commands) {
	if (element.type == 'image') {
		commands.push(["clearImage", element.id, element.on_screen_x, element.on_screen_y, element.on_screen_layer]);
	} else if (element.type == 'animation') {
		commands.push(["clearAnimation", element.id]);
	} else if (element.type == 'text') {
		commands.push(["clearText", element.name]);
	} else if (element.type == 'rectangle') {
		commands.push(["clearRectangle", element.name]);
	} else if (element.type == 'screen') {
		clearDisplayObject(element.base, commands);

		for (var i = 0; i < element.buttons.length; i++) {
			commands.push(["deleteButton", element.buttons[i].name]);
		}

		for (var i = 0; i < element.textFields.length; i++) {
			commands.push(["deleteTextInputField", element.textFields[i].name]);
		}

		for (var i = 0; i < element.extras.length; i++) {
			clearDisplayObject(element.extras[i], commands);
		}

	}
	
	delete element.on_screen;
	delete element.on_screen_x;
	delete element.on_screen_y;
	delete element.on_screen_layer;
}

/* Helper function.
 * Returns a copy of the display element, translated by the specified amount
 */
function translate (element, dx, dy, dl) {
	var answer = JSON.parse(JSON.stringify(element)); // Creates a deep copy of element.
	answer.x += dx;
	answer.y += dy;
	answer.layer += dl;
	if (typeof answer.x2 !== 'undefined' && typeof answer.y2 !== 'undefined') {
		answer.x2 += dx;
		answer.y2 += dy;
	}
	return answer;
}

/* Helper function.
 * Translates the element by the specified amount. Modifies the given object.
 */
function translateInPlace (element, dx, dy, dl) {
	element.x += dx;
	element.y += dy;
	element.layer += dl;
	if (typeof element.x2 !== 'undefined' && typeof element.y2 !== 'undefined') {
		element.x2 += dx;
		element.y2 += dy;
	}
}

/* adds the commands required to add the specified button to commands */
function addButton (button, commands) {
	if (element.text) {
		commands.push(["addButton", button.name, button.x1, button.y1, button.x2, button.y2, button.layer, button.text, button.font, button.font_color]);
	} else {
		commands.push(["addButton", button.name, button.x1, button.y1, button.x2, button.y2, button.layer]);
	}
}

/* adds the commands required to remove the specified buttons to commands */
function deleteButton (button, commands) {
	commands.push(["deleteButton", button.name]);
}

/* A helper function to create the dialog screen object, so it is the correct size before it is displayed
 * The canvas argument passed in (game.canvas) carries the x and y coordinates of the screen, so it can be sized appropriately.
 * */
function setup_dialog_screen(dialog, canvas, previous_screen) {
	dialog.screen = new Screen(0, 0, DIALOG_LAYER, new Rectangle("dialogGrayBackground", 0, 0, canvas.x, canvas.y, 0, 'rgba(0,0,0,0.5)'),
		/* Buttons */ [], /* Text Fields */	[],
		/* Extras */ [new Rectangle("dialogBorder", canvas.x/4 - DIALOG_BORDER_SIZE, canvas.y/4 - DIALOG_BORDER_SIZE, canvas.x * 3/4 + DIALOG_BORDER_SIZE, canvas.y * 3/4 + DIALOG_BORDER_SIZE, 1, 'rgba(50,50,50,1)'),
			new Rectangle("dialogRectangle", canvas.x/4, canvas.y/4, canvas.x * 3/4, canvas.y * 3/4, 2, 'rgba(70,70,70,1)'),
			new Text("dialogTitle", canvas.x/4, canvas.y/4, canvas.x * 3/4, canvas.y/4 + 25, 3, dialog.title, '24px Verdana', 'rgba(255,255,255,1)'),
			new Text("dialogText", canvas.x/4, canvas.y/4 + 25, canvas.x * 3/4, canvas.y * 3/4 - DIALOG_BUTTON_HEIGHT, 4, dialog.text, '16px Verdana', 'rgba(200,200,200,1)')]
	);

	for (var i = 0; i < dialog.options.length; i++) {
		dialog.screen.buttons.push(new Button ("dialog_" + dialog.name + "_" + dialog.options[i], canvas.x/4 + i*(canvas.x/2)/dialog.options.length + DIALOG_BUTTON_PADDING, canvas.y * 3/4 - DIALOG_BUTTON_HEIGHT, canvas.x/4 + (i+1)*(canvas.x/2)/dialog.options.length - DIALOG_BUTTON_PADDING, canvas.y * 3/4, 4, dialog.options[i], '16px Verdana', 'rgba(200,200,200,1)'));
		dialog.screen.extras.push(new Rectangle ("dialogOptionRectangle" + i, canvas.x/4 + i*(canvas.x/2)/dialog.options.length + DIALOG_BUTTON_PADDING, canvas.y * 3/4 - DIALOG_BUTTON_HEIGHT, canvas.x/4 + (i+1)*(canvas.x/2)/dialog.options.length - DIALOG_BUTTON_PADDING, canvas.y * 3/4, 3, 'rgba(80,80,80,1)'));
	}

	// The display elements of the previous screen will be added to this screen, but the buttons and text fields won't.
	previous_screen = JSON.parse(JSON.stringify(previous_screen)); // I need to modify the object, so I must deep copy it first

	// Add whatever text was in the buttons/textFields into the display as standalone text objects instead of buttons/text fields.
	for (i = 0; i < previous_screen.buttons.length; i++) {
		if (typeof previous_screen.buttons[i].text !== 'undefined') {
			previous_screen.extras.push(new Text("screen_under_dialog_button_" + previous_screen.buttons[i].name, previous_screen.buttons[i].x1, previous_screen.buttons[i].y1, previous_screen.buttons[i].x2, previous_screen.buttons[i].y2, previous_screen.buttons[i].layer, previous_screen.buttons[i].text, previous_screen.buttons[i].font, previous_screen.buttons[i].font_color));
		}
	}
	for (i = 0; i < previous_screen.textFields.length; i++) {
		previous_screen.extras.push(new Text("screen_under_dialog_textField_" + previous_screen.textFields[i].name, previous_screen.textFields[i].x1, previous_screen.textFields[i].y1, previous_screen.textFields[i].x2, previous_screen.textFields[i].y2, previous_screen.textFields[i].layer, previous_screen.textFields[i].text, previous_screen.textFields[i].font, previous_screen.textFields[i].font_color));
	}
	previous_screen.buttons = [];
	previous_screen.textFields = [];

	delete previous_screen.on_screen; // This copy isn't actually on the screen. Causes false alarms for repeated draw calls.

	previous_screen.layer -= DIALOG_LAYER; // Need to draw the stuff under the dialog.
	dialog.screen.extras.push(previous_screen);
}

// Gets the folder object for the current directory of the specified file system
function get_folder (filesystem, path) {
	if (path == "") {
		return filesystem.files;
	} else {
		path = path.split('/');
		var current = filesystem.files;

		for (var i = 0; i < path.length; i++) {
			var found = false;
			for (var j = 0; !found && j < current.contents.length; j++) {
				if (current.contents[j].name == path[i]) {
					found = true;
					current = current.contents[j];
				}
			}
			if (!found)
				return null;
		}

		return current;
	}
}

// Returns the screen object that belongs to the currentDirectory of the file system. If the currentDirectory is invalid, will cause a crash.
// Possible future improvement: return some screen indicating an error occurred, rather than crashing the whole server!
function get_current_screen (filesystem) {
	return get_folder(filesystem, filesystem.currentDirectory).screen;
}

// mailbox_index is the index of the specified message within the mailbox.
function email_message_screen (message, mailbox_index, canvas) {
	var screen = new Screen(canvas.x - PHONE_SCREEN_X, canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0),
	[new Button("Email_back_button_" + mailbox_index, 0, 0, 173, 30, 1, "Back", "24px Times", "rgba(0,0,0,1)"),
		new Button("Email_delete_button_" + mailbox_index, 143, 31, 173, 60, 1, "X", "19px Times", "rgba(0,0,0,1)")
	], [],
	[new Text ("message_screen_sender", 0, 30, 173, 45, 1, "From: " + message.sender, "12px Arial", "rgba(0,0,0,1)"),
		new Text("message_screen_subject", 0, 45, 173, 60, 1, "Subject: " + message.subject, "12px Arial", "rgba(0,0,0,1)"),
		new Text ("message_screen_body", 0, 60, 173, 291, 1, message.message, "11px Times", "rgba(0,0,0,1)")
	]);

	return screen;
}

io.on('connection', function (socket) {
	/* Must figure out who the user is, and possibly deny the connection. */
	var session_cookie = parseSessionCookie(socket.handshake.headers.cookie);
	var username;

	if (typeof session_cookie !== 'undefined' && typeof active_sessions[session_cookie] !== 'undefined' && active_sessions[session_cookie].ip_address == socket.handshake.address && !active_sessions[session_cookie].connected && !hasExpired(active_sessions[session_cookie])) {
		username = active_sessions[session_cookie].username;
		active_sessions[session_cookie].connected = true;
	} else {
		// Construct some explanation as to why the user is being disconnected.
		var reasons;
		if (typeof session_cookie === 'undefined') {
			reasons = "Your browser didn't send any session information. (Perhaps you have cookies disabled?)";
		} else {
			if (typeof active_sessions[session_cookie] === 'undefined') {
				reasons = "Your session doesn't exist on the server. (Perhaps the server restarted?)";
			} else {
				reasons = "";
				if (active_sessions[session_cookie].ip_address != socket.handshake.address)
					reasons += "Your IP address does not match. ";
				if (active_sessions[session_cookie].connected)
					reasons += "You are already connected to the server or your save file is still being updated. ";
				if (hasExpired(active_sessions[session_cookie]))
					reasons += "Your session has expired. (Try refreshing the page.)";
			}
		}
		writeToServerLog("client: " + socket.handshake.address + " | Socket.io connection rejected due to: " + reasons);
		socket.emit('server-error', "Authentication failure: disconnected from server. \r\n\r\n Reason(s): " + reasons);
		socket.disconnect();
		return;
	}

	/* Mark the session as disconnected and set an expiration timer when a user disconnects. */
	socket.on('disconnect', function () {

		// The user has five minutes to return before their session expires and they will have to login again.
		function endSession () {
			active_sessions[session_cookie].connected = false;
			active_sessions[session_cookie].expires = Date.now() + 300000;
			writeToServerLog(username + " | Disconnected.");
		}

		// If the game object is defined, save it.
		if (typeof game !== 'undefined') {
			fs.writeFile(save_file, JSON.stringify(game, null, 2), function (err) {
				endSession();
				if (err) {
					writeToServerLog(username + " | An error occurred trying to write a save file: " + save_file + ". Game state was " + JSON.stringify(game));
					throw err;
				} else {
					writeToServerLog(username + " | Save file written.");
				}
			});
		} else {
			writeToServerLog(username + " | Game was undefined, no save written.");
			endSession();
		}
	});

	writeToServerLog(username + " | Connected.");

	/* Each user has a game state object, which is stored in a JSON file while they are not playing.
	 * This object must contain sufficient information to send the commands to present them with the
	 * game state from a blank state, since the user may quit at any time. (When the user quits, the
	 * disconnection event causes their state to be written to file). In general, this object should
	 * be interacted with through functions, which ensure that the numerous invariants are preserved.
	 *
	 * This object, called game, has the following fields:
	 *	canvas: An object storing the current dimensions of the canvas
	 *		x:
	 *		y:
	 *	screens: An object used as a map of <screen name> --> <screen object>
 	 *  browsers: An object used as a map of <browser name> --> <browser object>
	 *  dialogs: An object used as a map of <dialog name> --> <dialog object>
	 *  filesystems: An object used as a map of <filesystem name> --> <filesystem object>
	 *  webpages: An object used as a map of <URL> --> <screen object>
	 *  background_music: An object used as a map of <screen name> --> <audio id>; the screens in this map must be "Main" Screens (i.e. not browsers, phone screens, etc.)
	 * 	phone: An object representing the state of the user's phone, which has the following fields:
	 *		visible: A boolean, true if the phone is visible, false if it is not (not on the screen at all)
	 *		raised: A boolean, true if the phone is in the raised position, false if it is in the lowered position
	 *		screen_on: A boolean, true if the screen is on, false if it is off
	 *		screen: The name of the screen object to show (The size of the phone screen is 173 x 291 pixels).
	 *		active_alert_screen: The name of the currently displayed phone alert screen. Undefined if no phone alert is active.
	 *		pending_alerts: The queue of pending alerts. An alert is represented by a single string, the alert message.
	 *  phone_apps: An array of apps installed on the phone.
	 *  mailbox: An array of email messages; the contents of the player's mailbox.
	 *  todoList: An object used as a map of <location> --> {screen_name:<name of the screen for this location's todoList>, taskList:<array of TodoTasks>}
	 *  main_screen: The name of the currently active main screen.
	 *  active_browser: The name of the internet browser object that is currently active. Undefined if the browser is not active.
	 *  active_dialog: An object with the following information. Undefined if there is no active dialog box.
	 *		name: The name of the active dialog
	 *		replace_phone: A boolean, true if the phone should be shown when this dialog is closed
	 *  active_filesystem: The name of the active computer filesystem.
	 *  player_name: The name of the player.
	 *  partner_name: The name of the partner.
	 *	scenes_loaded: A boolean, true if the scenes have been loaded (which happens during the introduction scene).
	 *	locked_locations: A string array, representing the locations that the player has not yet unlocked.
	 */
	var game;

	var save_file = __dirname + "/saves/" + username + ".json";
	// Load the player's save game, if applicable.
	fs.readFile(save_file, function (err, buf) {
		if (err) {
			if (err.code == 'ENOENT') { // File not found, so this user doesn't have a save.
				makeNewGame();
				sendClientInitCommands();
			} else {
				// Some other error; not good.
				socket.emit('server-error', "Unexpected error attempting to load save file. You have been disconnected.");
				socket.disconnect();

				throw err;
			}
		} else {
			game = JSON.parse(buf.toString());
			writeToServerLog(username + " | Save file read.");
			sendClientInitCommands();
		}
	});

	/* Creates a fresh game object, for a player who has never played before. */
	function makeNewGame () {
		game = { canvas:{x:1224, y:688}, screens:{}, browsers:{}, dialogs:{}, filesystems:{}, webpages:{}, background_music:{}, phone:{visible:true, raised:true, screen_on:true, screen:"phoneHomeScreen", pending_alerts:[]}, phone_apps:[], mailbox:[], todoList:{}, main_screen:"introduction_dorm_room", active_dialog:{name:"introduction_dialog", replace_phone:false}, player_name:"Anonymous Player", partner_name:"Ashley", scenes_loaded:false, locked_locations:["Mall", "Police Station", "Coffee Shop", "Library", "Apartment", "Dorm Room"]};
		game.screens["phoneBlankScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [new Button("testButton", 50, 50, 100, 100, 0)], [], [new Rectangle("testRect", 50, 50, 100, 100, 1, "rgba(0,0,0,1)")]);
		game.screens["testMainScreen"] = new Screen(0, 0, 0, new Rectangle("bigRedRectangle", 0, 0, game.canvas.x, game.canvas.y, 0, 'rgba(255,0,0,1)'), [], [], []);
		game.screens["phoneHomeScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);

		// Note that this screen is defined before its application, because all the other installPhoneApp calls depend on it
		game.screens["phoneSettingsUninstallPage"] = new Screen (game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneSettingsUninstallPage"], new Button("phone-uninstall-back", 0, 0, 173, 20, 2, "Back", "16px Times", "rgba(0,0,0,1)"));

		game.screens["phoneAlertLogPage"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneAlertLogPage"], new Button ("phone-alert-log-back", 0, 0, 173, 20, 2, "Back", "16px Times", "rgba(0,0,0,1)"));
		// Invariant: this element is never moved or deleted from the 0th position in the phoneAlertLogPage's extras list
		addElementToScreen(game.screens["phoneAlertLogPage"], new ScrollableList("phone-alert-log-list", 0, 20, 173, 291, 2, new Rectangle ("phone_alert_log_backing_transparent_rectangle", 0, 0, 173, 271, 0, "rgba(0,0,0,0)")));

		game.dialogs["invalidUninstallDialog"] = new Dialog ("invalidUninstallDialog", "", "You can't uninstall that app!", ["Close."]);

		installPhoneApp(new PhoneApp("Settings", new Image("image/phone/icon/settings", 0, 0, 0, 56.0/57.0), "phoneSettingsAppScreen"));
		game.screens["phoneSettingsAppScreen"] = new Screen (game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);

		addButtonToScreen(game.screens["phoneSettingsAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Settings", "24px Times", "rgba(0,0,0,1)"));
		addButtonToScreen(game.screens["phoneSettingsAppScreen"], new Button("phone-settings-uninstall-page", 0, 30, 173, 50, 2, "Uninstall Apps", "16px Times", "rgba(0,0,0,1)"));
		addButtonToScreen(game.screens["phoneSettingsAppScreen"], new Button("phone-alert-log", 0, 50, 173, 70, 2, "Alert Log", "16px Times", "rgba(0,0,0,1)"));

		// Note that all phone applications should have an exit button; however, may be placed anywhere on the screen, not necessarily at (0,0).
		// installPhoneApp(new PhoneApp ("Email", new Image ("image/phone/icon/email", 0, 0, 0), "phoneEmailAppScreen"));
		game.screens["phoneEmailAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneEmailAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Email", "24px Times", "rgba(0,0,0,1)"));
		// Invariant: this element is never moved or deleted from the 0th position in the extras list
		addElementToScreen(game.screens["phoneEmailAppScreen"], new ScrollableList("phone-email-list", 0, 30, 173, 291, 2, new Rectangle("phone_email_list_backing_transparent_rectangle", 0, 0, 173, 261, 0, 'rgba(0,0,0,0)')));

		// Phone Map application -- To add a new location to the game, use the unlockLocation and add to the game.locked_locations list.
		// installPhoneApp(new PhoneApp ("Map", new Image ("image/phone/icon/map", 0, 0, 0), "phoneMapAppScreen"));
		game.screens["phoneMapAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/map", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneMapAppScreen"], new Button("phone-exit-app", 0, 0, 173, 21, 2, "        Exit Map", "17px Times", "rgba(0,0,0,1)")); // The spaces in the Exit Map string are to position the text further right.
		
		game.screens["phoneMapSpoofAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneMapSpoofAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Map", "24px Times", "rgba(0,0,0,1)"));

		// Phone TodoList application --
		game.screens["phoneTodoListAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		//installPhoneApp( new PhoneApp ("To-Do", new Image ("image/phone/icon/todo", 0, 0, 0, 56.0/57.0), "phoneTodoListAppScreen"));
		addButtonToScreen(game.screens["phoneTodoListAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit To-Do List", "24px Times", "rgba(0,0,0,1)"));
		// This element should also never be moved or deleted from the 0th position of the extras list.
		addElementToScreen(game.screens["phoneTodoListAppScreen"], new ScrollableList ("phone-todo-locations-list", 0, 30, 173, 291, 2, new Rectangle("phone_todo_locations_list_backing_transparent_rectangle", 0, 0, 173, 261, 0, 'rgba(0,0,0,0)')));

		// Stuff related to the MFA/email hacking incident
		game.dialogs["email_hack_mfa_enabled_dialog"] = new Dialog ("email_hack_mfa_enabled_dialog", "", "The email you just got indiciates somehow, some stranger managed to acquire your email password and tried to access your email account. However, because you had multi-factor authentication enabled, you thwarted the hacker's attempt to gain access because he or she did not have access to your cell phone, which received the special code needed to complete the login attempt.", ["Continue."]);
		game.dialogs["email_hack_mfa_disabled_dialog"] = new Dialog ("email_hack_mfa_disabled_dialog", "", "The email you just got indicates somehow, some stranger managed to acquire your email password and was successful in logging into your account. However, you could have prevented this attack if you had enabled multi-factor authentication, which would have required the hacker to input an access code sent to your cell phone in addition to your password, which the hacker would not be able to do unless he or she had also compromised your cell phone.", ["Continue."]);
		game.dialogs["email_hack_dialog_2"] = new Dialog ("email_hack_dialog_2", "", "In a real life scenario, you'd want to change your password immediately if this ever occurred, even if you had enabled multi-factor authentication.", ["Okay."]);
		game.mfa_video_played = false;
		
		game.browsers["testBrowser"] = new Browser();

		game.dialogs["testDialog"] = new Dialog ("Title", "Title", "Text", ["close", "browser"]);

		game.filesystems["testFilesystem"] = new FileSystem();
		addToFileSystem(game.filesystems["testFilesystem"], "", "test.txt");
		addToFileSystem(game.filesystems["testFilesystem"], "", new Folder ("test_dir", ["a.txt", "b.txt"]));

		// Load the introduction scene into the game state object.
		load_introduction (game, changeBrowserWebPage, PHONE_SCREEN_LAYER);
	}

	// Send commands to client, to initialize it to the current game state, which may be loaded or the default.
	// Throughout this function, screens that are being drawn will have their "on_screen" fields deleted - this is so false warnings will not be logged when a user loads their save file.
	function sendClientInitCommands () {
		var init_commands = [];
		init_commands.push(["resizeCanvas", game.canvas.x, game.canvas.y]);
		if (game.phone.visible) {
			if (game.phone.raised) {
				init_commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, PHONE_LAYER]);
				init_commands.push(["addButton", "lower-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, game.canvas.x, game.canvas.y - PHONE_Y_RAISED + PHONE_Y_LOWERED, PHONE_LAYER]);
				init_commands.push(["addButton", "phone-power-button", game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[0], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[1], game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[2], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[3], PHONE_LAYER]);
				if (game.phone.screen_on) {
					if (typeof game.phone.active_alert_screen !== 'undefined') {
						// Move the screen to the correct position before it is drawn.
						game.screens[game.phone.active_alert_screen].x = game.canvas.x - PHONE_SCREEN_X;
						game.screens[game.phone.active_alert_screen].y = game.canvas.y - PHONE_SCREEN_Y;

						delete game.screens[game.phone.active_alert_screen].on_screen;
						drawDisplayObject(game.screens[game.phone.screen], init_commands);
					} else {
						// Move the screen to the correct position before drawing it.
						game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
						game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;

						delete game.screens[game.phone.screen].on_screen;
						drawDisplayObject(game.screens[game.phone.screen], init_commands);
					}
				} else {
					init_commands.push(["drawImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
				}
			} else {
				init_commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
				init_commands.push(["addButton", "raise-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, game.canvas.x, game.canvas.y, PHONE_LAYER]);
			}
		}

		if (typeof game.active_browser !== 'undefined') {
			init_commands.push(["resizeCanvas", 800, 600]);

			delete game.browsers[game.active_browser].screen.on_screen;
			drawDisplayObject(game.browsers[game.active_browser].screen, init_commands);
		} else if (typeof game.active_filesystem !== 'undefined') {
			delete get_current_screen(game.filesystems[game.active_filesystem]).on_screen;
			drawDisplayObject(get_current_screen(game.filesystems[game.active_filesystem]), init_commands);
		} else {
			delete game.screens[game.main_screen].on_screen;
			drawDisplayObject(game.screens[game.main_screen], init_commands);
		}

		if (typeof game.active_dialog !== 'undefined') {
			if (typeof game.active_browser !== 'undefined') {
				setup_dialog_screen(game.dialogs[game.active_dialog.name], game.canvas, game.browsers[game.active_browser].screen);
			} else if (typeof game.active_filesystem !== 'undefined') {
				setup_dialog_screen(game.dialogs[game.active_dialog.name], game.canvas, get_current_screen(game.filesystems[game.active_filesystem]));
			} else {
				setup_dialog_screen(game.dialogs[game.active_dialog.name], game.canvas, game.screens[game.main_screen]);
			}

			clearDisplayObject(game.screens[game.main_screen], init_commands);

			delete game.dialogs[game.active_dialog.name].screen.on_screen;
			drawDisplayObject(game.dialogs[game.active_dialog.name].screen, init_commands);
		}

		if (typeof game.background_music[game.main_screen] !== 'undefined') {
			init_commands.push(["playSound", game.background_music[game.main_screen]]);
		}

		socket.emit('command', init_commands);
	}

	/* Loads all the additional scenes into the game object. */
	function loadScenes () {
		game.screens["gameCredits"] = new Screen (0, 0, 0, new Image ("image/credits", 0, 0, 0), [
			new Button ("game_credits_continue", 550, 610, 780, 720, 1, "Next >", "66px Arial", "rgba(0,0,0,1)")
		], [], []);
	
		game.screens["gameCompleteScreen"] = new Screen (0, 0, 0, new Image ("image/mission/complete", 0, 0, 0), [
			new Button ("game_complete_take_survey", 400, 425, 800, 475, 2, "Take Our Survey", "40px Arial", "rgba(255, 255, 255, 1)")
		], [], [
			new Text ("game_complete_introduction_score", 0, 0, 280, 50, 1, "Introduction: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Text ("game_complete_mall_score", 436, 0, 716, 50, 1, "Mall: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Text ("game_complete_coffee_shop_score", 872, 0, 1152, 50, 1, "Coffee Shop: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Text ("game_complete_library_score", 0, 50, 1000, 100, 1, "Library: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Text ("game_complete_apartment_score", 436, 50, 716, 100, 1, "Apartment: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Text ("game_complete_police_station_score", 872, 50, 1152, 100, 1, "Police Station: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Text ("game_complete_dorm_room_score", 0, 100, 280, 150, 1, "Dorm Room: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Text ("game_complete_total_score", 436, 150, 1200, 200, 1, "Total Score: ", "30px Arial", "rgba(255, 255, 255, 1)"),
			new Rectangle ("game_complete_take_survey_backing_rectangle", 400, 425, 800, 475, 1, "rgba(255, 255, 255, 0.5)"),
			new Text ("game_complete_screen_message", 100, 500, 1000, 700, 1, "That's all there is to play right now. Congratulations on making it to the end! We'd appreciate it if you take our survey to help make the game better. Sincerely, The CyberEDU Team", "18px Times", "rgba(255, 255, 255, 1)")
		]);

		load_coffee_shop (game, addElementToScreen, removeElementFromScreen);
		load_mall(game);
		load_library (game, addToFileSystem);
		load_apartment (game);
		load_introduction_part2(game);
		load_police_station(game, addToFileSystem);
		load_final_module(game);
		game.scenes_loaded = true;

		// Decide after which scene should the MFA sequence occur (when the player gets hacked)
		var random_num = 1 + Math.floor(3 * Math.random()); // Random number from 1 to 3, inclusive
		if (random_num == 1) {
			console.log(username + " | will be hacked after completing the library.");
			game.library_variables.on_completion_trigger_email_hack = true;
		} else if (random_num == 2) {
			console.log(username + " | will be hacked after completing the coffee shop.");
			game.coffee_shop_variables.on_completion_trigger_email_hack = true;
		} else {
			console.log(username + " | will be hacked after completing the apartment.");
			game.apartment_variables.on_completion_trigger_email_hack = true;
		}

		unlockLocation("Mall");

		sendMissionEmail("police_station");
	}

	/* This function makes the specified location click-able on the player's map.
	 * Valid locations are "mall", "police_station", "coffee_shop", "library", "apartment", and "dorm_room".
	 */
	function unlockLocation (location) {
		var location_to_unlock;

		for (var i = 0; i < game.locked_locations.length; i++) {
			if (game.locked_locations[i] == location) {
				location_to_unlock = game.locked_locations[i];
				game.locked_locations.splice(i, 1);
				if (isPhoneAppInstalled("Map")) {
					pushPhoneAlert("You may now visit the " + location_to_unlock + ".");
				}
			}
		}

		if (typeof location_to_unlock !== 'undefined') {
			// Note: must add a button to the actual map application AND to the spoof application.
			// TODO: Fix the actual application's buttons to use the image icons for the locations.

			if (location_to_unlock == "Mall") {
				addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_mall", 25,70, 45, 90, 2));
				addElementToScreen(game.screens["phoneMapAppScreen"], new Image ("image/phone/icon/map/mall", 19, 63, 2, 0.03125));
				addButtonToScreen(game.screens["phoneMapSpoofAppScreen"], new Button ("go_to_mall", 0,150, 173, 180, 2, "Go to Mall", "18px Times", "rgba(0,0,0,1)"));
			} else if (location_to_unlock == "Coffee Shop") {
				addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_coffee_shop", 134, 184, 152, 206, 2));
				addElementToScreen(game.screens["phoneMapAppScreen"], new Image ("image/phone/icon/map/coffee_shop", 134, 184, 2, 0.03656));
				addButtonToScreen(game.screens["phoneMapSpoofAppScreen"], new Button ("go_to_coffee_shop", 0, 60, 173, 90, 2, "Go to Coffee Shop", "18px Times", "rgba(0,0,0,1)"));
			} else if (location_to_unlock == "Library") {
				addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_library", 70, 166, 90, 186, 2));
				addElementToScreen(game.screens["phoneMapAppScreen"], new Image("image/phone/icon/map/library", 66, 162, 2, 0.02667));
				addButtonToScreen(game.screens["phoneMapSpoofAppScreen"], new Button ("go_to_library", 0, 90, 173, 120, 2, "Go to Library", "18px Times", "rgba(0,0,0,1)"));
			} else if (location_to_unlock == "Apartment") {
				addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_apartment", 85, 96, 105, 121, 2));
				addElementToScreen(game.screens["phoneMapAppScreen"], new Image ("image/phone/icon/map/apartment", 75, 89, 2, 0.037037));
				addButtonToScreen(game.screens["phoneMapSpoofAppScreen"], new Button ("go_to_apartment", 0, 120, 173, 150, 2, "Go to Apartment", "18px Times", "rgba(0,0,0,1)"));
			} else if (location_to_unlock == "Police Station") {
				addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_office_lobby", 121, 81, 151, 96, 2));
				addElementToScreen(game.screens["phoneMapAppScreen"], new Image ("image/phone/icon/map/police_station", 111, 64, 2, 0.045045));
				addButtonToScreen(game.screens["phoneMapSpoofAppScreen"], new Button ("go_to_office_lobby", 0, 30, 173, 60, 2, "Go to Police Station", "18px Times", "rgba(0,0,0,1)"));
			} else if (location_to_unlock == "Dorm Room") {
				addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_dorm_room", 50, 125, 70, 144, 2));
				addElementToScreen(game.screens["phoneMapAppScreen"], new Image ("image/phone/icon/map/dorm_room", 50, 125, 2, 0.0478));
				addButtonToScreen(game.screens["phoneMapSpoofAppScreen"], new Button ("go_to_dorm_room", 0, 180, 173, 210, 2, "Go to Dorm Room", "18px Times", "rgba(0,0,0,1)"));
			} else {
				writeToServerLog(username + " | Unlock not handled for " + location_to_unlock);
			}
		} else {
			writeToServerLog(username + " | An invalid call to unlockLocation(" + location +  ") occurred.");
		}
	}

	/* Sends the player an email which describes their mission in the specified location.
	 */
	function sendMissionEmail(location) {
		if (location == "coffee_shop") {
			addToMailbox(new EmailMessage ("Robberies at the Coffee Shop", "Coffee Shop Manager", "Hello, I am the manager of the local Starbuck’s, and recently, we have had a problem with a few of our customers getting robbed. We have never had this problem before, and some of our everyday customers have stopped coming. We won’t be able to stay open if this continues. Please figure out who the robber is!", [], "unlock_Coffee Shop"));
		} else if (location == "library") {
			addToMailbox(new EmailMessage ("Computer Problems in the Library", "Librarian", "Hello, I am the manager of the local Starbuck’s, and recently, we have had a problem with a few of our customers getting robbed. We have never had this problem before, and some of our everyday customers have stopped coming. We won’t be able to stay open if this continues. Please figure out who the robber is!", [], "unlock_Library"));
		} else if (location == "apartment") {
			addToMailbox(new EmailMessage ("I've been framed! Please help...", "Madeline", "Hey, yesterday I was contacted by the Music Protection Association, claiming that I had downloaded $1000 worth of songs illegally. I have watched Youtube videos of songs that I do not own, but I haven’t downloaded them. I swear somebody else is responsible. I don’t have the time or the money to go to court over this, can you please figure out who? I live in the apartments across the street from the shopping center.", [], "unlock_Apartment"));
		} else if (location == "police_station") {
			addToMailbox(new EmailMessage("P.I. Application", "Police Station Receptionist", "Congratulations new detective, your application was reviewed and you have become an official licensed private investigator. Now that you have the equipment you need, come to the police station to pick up your badge. In addition, we have your first case available here for you. Check your email for the forwarded details.", [], "unlock_Police Station"));
			addToMailbox(new EmailMessage("Computer Malware", "Michael Jones", "Hi, the receptionist at the police station gave me your email and said I should contact you about my computer problem. I am at the police station outside of your office now waiting.", [], "unlock_Police Station"));
		} else if (location == "dorm_room") {
			addToMailbox(new EmailMessage("Training Almost Complete", "VR SYSTEM", "You are almost finished with your training. There is one final task that will test everything you have learned thus far. Read the email from Elijah.", []));
			addToMailbox(new EmailMessage("Help Me!!!", "Elijah", "Hello, recently my life has just become a complete disaster; I've been hacked multiple times and everything is just going wrong. Please help me!", [], "unlock_Dorm Room"));
		} else {
		writeToServerLog(username + " | Invalid call to sendMissionEmail(" + location + ").");
		}
	}


	/* Changes the canvas size to the specified arguments */
	function resizeCanvas (newX, newY) {
		var commands = [];

		commands.push(["resizeCanvas", newX, newY]);
		if (game.phone.visible) {
			if (game.phone.raised) {
				commands.push(["clearImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, PHONE_LAYER]);
				commands.push(["drawImage", "image/phone", newX - PHONE_X, newY - PHONE_Y_RAISED, PHONE_LAYER]);
				commands.push(["deleteButton", "phone-power-button"]);
				commands.push(["addButton", "phone-power-button", newX - PHONE_POWER_BUTTON_BOUNDS[0], newY - PHONE_POWER_BUTTON_BOUNDS[1], newX - PHONE_POWER_BUTTON_BOUNDS[2], newY - PHONE_POWER_BUTTON_BOUNDS[3], PHONE_LAYER]);
				commands.push(["deleteButton", "lower-phone-button"]);
				commands.push(["addButton", "lower-phone-button", newX - PHONE_X, newY - PHONE_Y_RAISED, newX, newY - PHONE_Y_RAISED + PHONE_Y_LOWERED, PHONE_LAYER]);
				if (game.phone.screen_on) {
					if (typeof game.phone.active_alert_screen !== 'undefined') {
						clearDisplayObject(game.screens[game.phone.active_alert_screen], commands);
						game.screens[game.phone.active_alert_screen].x = newX - PHONE_SCREEN_X;
						game.screens[game.phone.active_alert_screen].y = newY - PHONE_SCREEN_Y;
						drawDisplayObject(game.screens[game.phone.active_alert_screen], commands);
					} else {
						clearDisplayObject(game.screens[game.phone.screen], commands);
						game.screens[game.phone.screen].x = newX - PHONE_SCREEN_X;
						game.screens[game.phone.screen].y = newY - PHONE_SCREEN_Y;
						drawDisplayObject(game.screens[game.phone.screen], commands);
					}
				} else {
					commands.push(["clearImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
					commands.push(["drawImage", "image/phone/screen/off", newX - PHONE_SCREEN_X, newY - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
				}
			} else {
				commands.push(["deleteButton", "raise-phone-button"]);
				commands.push(["addButton", "raise-phone-button", newX - PHONE_X, newY - PHONE_Y_LOWERED, newX, newY, PHONE_LAYER]);
				commands.push(["clearImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
				commands.push(["drawImage", "image/phone", newX - PHONE_X, newY - PHONE_Y_LOWERED, PHONE_LAYER]);
			}
		}

		game.canvas.x = newX;
		game.canvas.y = newY;
		socket.emit('command', commands);
	}

	/* Makes the phone invisible, if it is currently visible */
	function hidePhone () {
		var commands = [];

		if (game.phone.visible) {
			if (game.phone.raised) {
				commands.push(["clearImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, PHONE_LAYER]);
				commands.push(["deleteButton", "lower-phone-button"]);
				commands.push(["deleteButton", "phone-power-button"]);
				if (game.phone.screen_on) {
					if (typeof game.phone.active_alert_screen === 'undefined')
						clearDisplayObject(game.screens[game.phone.screen], commands);
					else
						clearDisplayObject(game.screens[game.phone.active_alert_screen], commands);
				} else {
					commands.push(["clearImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
				}
			} else {
				commands.push(["clearImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
				commands.push(["deleteButton", "raise-phone-button"]);
			}
		}

		game.phone.visible = false;
		socket.emit('command', commands);
	}

	/* Makes the phone visible, if it is currently invisible */
	function showPhone () {
		var commands = [];

		if (!game.phone.visible) {
			if (game.phone.raised) {
				commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, PHONE_LAYER]);
				commands.push(["addButton", "lower-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, game.canvas.x, game.canvas.y - PHONE_Y_RAISED + PHONE_Y_LOWERED, PHONE_LAYER]);
				commands.push(["addButton", "phone-power-button", game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[0], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[1], game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[2], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[3], PHONE_LAYER]);
				if (game.phone.screen_on) {
					if (typeof game.phone.active_alert_screen === 'undefined') {
						game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
						game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;
						drawDisplayObject(game.screens[game.phone.screen], commands);
					} else {
						game.screens[game.phone.active_alert_screen].x = game.canvas.x - PHONE_SCREEN_X;
						game.screens[game.phone.active_alert_screen].y = game.canvas.y - PHONE_SCREEN_Y;
						drawDisplayObject(game.screens[game.phone.active_alert_screen], commands);
					}
				} else {
					commands.push(["drawImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
				}
			} else {
				commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
				commands.push(["addButton", "raise-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, game.canvas.x, game.canvas.y, PHONE_LAYER]);
			}
		}

		game.phone.visible = true;
		socket.emit('command', commands);
	}

	/* Raises the phone, if it is lowered */
	function raisePhone () {
		var commands = [];

		if (game.phone.visible && !game.phone.raised) {
			commands.push(["clearImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
			commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, PHONE_LAYER]);
			commands.push(["deleteButton", "raise-phone-button"]);
			commands.push(["addButton", "lower-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, game.canvas.x, game.canvas.y - PHONE_Y_RAISED + PHONE_Y_LOWERED, PHONE_LAYER]);
			commands.push(["addButton", "phone-power-button", game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[0], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[1], game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[2], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[3], PHONE_LAYER]);
			if (game.phone.screen_on) {
				if (typeof game.phone.active_alert_screen === 'undefined') {
					game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
					game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;
					drawDisplayObject(game.screens[game.phone.screen], commands);
				} else {
					game.screens[game.phone.active_alert_screen].x = game.canvas.x - PHONE_SCREEN_X;
					game.screens[game.phone.active_alert_screen].y = game.canvas.y - PHONE_SCREEN_Y;
					drawDisplayObject(game.screens[game.phone.active_alert_screen], commands);
				}
			} else {
				commands.push(["drawImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
			}
		}

		game.phone.raised = true;
		socket.emit('command', commands);
	}

	/* Lowers the phone, if it is raised */
	function lowerPhone () {
		var commands = [];

		if (game.phone.visible && game.phone.raised) {
			commands.push(["clearImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, PHONE_LAYER]);
			commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
			commands.push(["deleteButton", "lower-phone-button"]);
			commands.push(["addButton", "raise-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, game.canvas.x, game.canvas.y, PHONE_LAYER]);
			commands.push(["deleteButton", "phone-power-button"]);
			if (game.phone.screen_on) {
				if (typeof game.phone.active_alert_screen === 'undefined')
					clearDisplayObject(game.screens[game.phone.screen], commands);
				else
					clearDisplayObject(game.screens[game.phone.active_alert_screen], commands);
			} else {
				commands.push(["clearImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
			}
		}

		game.phone.raised = false;
		socket.emit('command', commands);
	}

	/* Powers on the phone screen, if it is off */
	function phoneScreenOn () {
		var commands = [];

		if (game.phone.visible && game.phone.raised && !game.phone.screen_on) {
			commands.push(["clearImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);

			if (typeof game.phone.active_alert_screen === 'undefined') {
				game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
				game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;
				drawDisplayObject(game.screens[game.phone.screen], commands);
			} else {
				game.screens[game.phone.active_alert_screen].x = game.canvas.x - PHONE_SCREEN_X;
				game.screens[game.phone.active_alert_screen].y = game.canvas.y - PHONE_SCREEN_Y;
				drawDisplayObject(game.screens[game.phone.active_alert_screen], commands);
			}
		}

		game.phone.screen_on = true;
		socket.emit('command', commands);
	}

	/* Powers off the phone screen, if it is on */
	function phoneScreenOff () {
		var commands = [];

		if (game.phone.visible && game.phone.raised && game.phone.screen_on) {
			if (typeof game.phone.active_alert_screen === 'undefined')
				clearDisplayObject(game.screens[game.phone.screen], commands);
			else
				clearDisplayObject(game.screens[game.phone.active_alert_screen], commands);
			commands.push(["drawImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
		}

		game.phone.screen_on = false;
		socket.emit('command', commands);
	}

	/* Displays the indicated browser on the screen. */
	function displayBrowser (name) {
		var commands = [];
		if (typeof game.active_browser !== 'undefined') {
			clearDisplayObject(game.browsers[game.active_browser].screen, commands);
			writeToServerLog(username + " | Warning: displayBrowser( " + name + ") was called when there was already an active browser, which was " + game.active_browser);
		}

		if (typeof game.active_dialog !== 'undefined') {
			game.active_dialog.replace_phone = false;
		} else {
			hidePhone();
			clearDisplayObject(game.screens[game.main_screen], commands);
			drawDisplayObject(game.browsers[name].screen, commands);
		}
		commands.push(["resizeCanvas", 800, 600]);

		game.active_browser = name;
		socket.emit('command', commands);
	}

	/* Closes the browser and returns to the main screen.
	 * The save_url argument indicates whether upon
	 * return to the same browser object, the browser will
	 * remain on the web page it was at previously, or if it
	 * will reset to the default (blank) page. */
	function closeBrowser (save_url) {
		var commands = [];
		if (!save_url)
			changeBrowserWebPage(game.browsers[game.active_browser], "");

		if (typeof game.active_dialog !== 'undefined') {
			game.active_dialog.replace_phone = true;
		} else {
			clearDisplayObject(game.browsers[game.active_browser].screen, commands);
			showPhone();
			drawDisplayObject(game.screens[game.main_screen], commands);
		}
		commands.push(["resizeCanvas", game.canvas.x, game.canvas.y]);

		delete game.active_browser;
		socket.emit('command', commands);
	}

	/* Changes the specified browser's URL to the argument.
	 * Works regardless of whether or not the browser is active. */
	function changeBrowserWebPage(browser, new_url) {
		var commands = [];

		browser.url = new_url;

		// Update the browser bar's text field
		for (var i = 0; i < browser.screen.textFields.length; i++) {
			if (browser.screen.textFields[i].name == 'browser-bar') {
				var save_field = browser.screen.textFields[i];
				removeTextInputFieldFromScreen(browser.screen, save_field);
				save_field.text = new_url;
				addTextInputFieldToScreen(browser.screen, save_field);
				break; // Need to bailout, since the browser bar may be encountered again if this loop continues.
			}
		}

		if (browser.screen.extras.length != 1) writeToServerLog(username + " | Warning: browser object invariants violated: not exactly one extra screen!");

		// Clear past web page.
		removeElementFromScreen(browser.screen, browser.screen.extras[0]);

		// Lookup the new web page. If it isn't found, show the 404 page.
		// Always draw web pages at (0, 70).
		if (new_url == "") {
			new_screen = BLANK_BROWSER_SCREEN;
		} else if (typeof game.webpages[new_url] !== 'undefined') {
			new_screen = game.webpages[new_url];
		} else {
			new_screen = /* 404 Page */ new Screen (0, 70, 1, new Image ("image/404", 0, 0, 0), [], [], []);
		}
		addElementToScreen(browser.screen, new_screen);

		socket.emit('command', commands);
	}

	// Helper function to setup a folder screen before it is displayed. The filesystem argument, where the folder resides, contains the current directory.
	function setup_folder_screen (folder, filesystem) {
		folder.screen = new Screen(0, 0, 0, new Image("image/filesystem/blank", 0, 0, 0), [new Button("filesystem_exit", 1180, 0, 1280, 100, 1, "Exit", "24px Times", "rgba(0,0,0,1)"), new Button("filesystem_up", 1130, 0, 1170, 100, 1, "Up", "24px Times", "rgba(0,0,0,1)")], [], [new Text("filesystem_path_bar", 0, 0, 1120, 100, 1, "C:/" + filesystem.currentDirectory, "24px Times", "rgba(0,0,0,1)")]);

		// Add in the contents
		for (var i = 0; i < folder.contents.length; i++) {
			if (folder.contents[i].type == 'folder') {
				addElementToScreen(folder.screen, new Text("name_text_" + filesystem.currentDirectory + "/" + folder.contents[i].name, 290, 140 + i*40, 1280, 180+i*40, 1, folder.contents[i].name, "24px Times", "rgba(0,0,0,1)"));
				addButtonToScreen(folder.screen, new Button("delete_button_" + filesystem.currentDirectory + "/" + folder.contents[i].name, 1100, 140 + i*40, 1280, 180 + i*40, 2, "Delete?", "24px Times", "rgba(0,0,0,1)"));
				addButtonToScreen(folder.screen, new Button("change_directory_button_" + filesystem.currentDirectory + "/" + folder.contents[i].name, 290, 140 + i*40, 1000, 180 + i*40, 0));
			} else {
				addElementToScreen(folder.screen, new Text("name_text_" + filesystem.currentDirectory + "/" + folder.contents[i], 290, 140 + i*40, 1280, 180 + i*40, 1, folder.contents[i], "24px Times", "rgba(0,0,0,1)"));
				addButtonToScreen(folder.screen, new Button("delete_button_" + filesystem.currentDirectory + "/" + folder.contents[i], 1100, 140 + i*40, 1280, 180 + i*40, 2, "Delete?", "24px Times", "rgba(0,0,0,1)"));
			}
		}
	}

	function displayFileSystem (name) {
		var commands = [];
		if (typeof game.active_filesystem !== 'undefined') writeToServerLog(username + " | Warning: displayFileSystem(" + name + ") was called when there was an active filesystem, " + game.active_filesystem);

		if (typeof game.active_dialog !== 'undefined') {
			game.active_dialog.replace_phone = false;
		} else {
			hidePhone();
			clearDisplayObject(game.screens[game.main_screen], commands);
			setup_folder_screen(get_folder(game.filesystems[name], game.filesystems[name].currentDirectory), game.filesystems[name]);
			drawDisplayObject(get_current_screen(game.filesystems[name]), commands);
		}

		game.active_filesystem = name;
		game.filesystems[game.active_filesystem].previous_canvas = game.canvas;

		resizeCanvas(1280, 720);
		socket.emit('command', commands);
	}

	function closeFileSystem () {
		var commands = [];
		resizeCanvas (game.filesystems[game.active_filesystem].previous_canvas.x, game.filesystems[game.active_filesystem].previous_canvas.y);

		// Possible issue: dialog ends up off the screen if this resize gets called with a dialog open.
		if (typeof game.active_dialog !== 'undefined') {
			game.active_dialog.replace_phone = true;
		} else {
			clearDisplayObject(get_current_screen(game.filesystems[game.active_filesystem]), commands);
			drawDisplayObject(game.screens[game.main_screen], commands);
			showPhone();
		}

		delete game.active_filesystem;
		socket.emit('command', commands);
	}

	function changeDirectory (filesystem, newDirectory) {
		var commands = [];

		if (filesystem == game.filesystems[game.active_filesystem]) {
			clearDisplayObject(get_current_screen(filesystem), commands);
			filesystem.currentDirectory = newDirectory;
			setup_folder_screen(get_folder(filesystem, filesystem.currentDirectory), filesystem);
			drawDisplayObject(get_current_screen(filesystem), commands);
		} else {
			filesystem.currentDirectory = newDirectory;
		}

		socket.emit('command', commands);
	}

	// Item must be a file or folder.
	function addToFileSystem (filesystem, path, item) {
		var folder = get_folder(filesystem, path);
		folder.contents.push(item);

		var y2 = 140 + folder.contents.length*40;
		var y1 = y2 - 40;
		var item_name = (item.type == 'folder' ? item.name : item);

		// Need to create display elements for this item and add them. Only do this if the screen exists
		if (typeof folder.screen !== 'undefined') {
			addElementToScreen(folder.screen, new Text("name_text_" + filesystem.currentDirectory + "/" + item_name, 290, y1, 1280, y2, 1, item_name, "24px Times", "rgba(0,0,0,1)"));
			addButtonToScreen(folder.screen, new Button("delete_button_" + filesystem.currentDirectory + "/" + item_name, 1100, y1, 1280, y2, 2, "Delete?", "24px Times", "rgba(0,0,0,1)"));
			if (item.type == 'folder')
				addButtonToScreen(folder.screen, new Button("change_directory_button_" + filesystem.currentDirectory + "/" + item_name, 290, y1, 1000, y2, 0));
		}
	}

	// Item must be a file or folder.
	function deleteFromFileSystem (filesystem, path, item) {
		var folder = get_folder(filesystem, path);
		var contents = folder.contents;
		for (var i = 0; i < contents.length; i++) {
			if (contents[i] == item) {
				contents.splice(i, 1);
				i--;
			}
		}

		// Need to clear the screen elements related to this item, and move other elements around. Easier just to clear all the elements and re-create the screen.
		if (typeof folder.screen !== 'undefined') {
			var commands = [];
			if (folder.screen["on_screen"]) {
				clearDisplayObject(folder.screen, commands);
				setup_folder_screen(folder, filesystem);
				drawDisplayObject(folder.screen, commands);
			}

			socket.emit('command', commands);
		}
	}

	// Tests whether an item exists.
	function existsInFileSystem (filesystem_name, path, item) {
		var filesystem = game.filesystems[filesystem_name];
		var folder = get_folder(filesystem, path);
		if (folder == null)
			return false;
		else {
			var contents = folder.contents
			for (var i = 0; i < contents.length; i++) {
				if (contents[i] == item)
					return true;
			}
			return false;
		}
	}

	// Pushes an "Alert" message to the player's phone.
	// message should be a string; the message to display.
	function pushPhoneAlert (message) {
		var commands = [];

		var alert_log = game.screens["phoneAlertLogPage"].extras[0]; // This is the scrolling list element containing all the logs.
		var current_time = new Date();
		var current_time_string = (current_time.getMonth() + 1) + "/" + current_time.getDate() + " " + current_time.toLocaleTimeString();

		var notification_text_y_size = 90;
		var notification_text = new Text ("phone_notification_" + alert_log.display_elements.length, 0, 0, 173, notification_text_y_size, 0, current_time_string + ": " + message, "12px Times", "rgba(0,0,0,1)");

		addElementToScrollableList(alert_log, notification_text, notification_text_y_size, 0);

		if (typeof game.phone.active_alert_screen === 'undefined') {
			game.screens["phoneAlertScreenName"] = createPhoneAlertScreen(message);
			game.phone.active_alert_screen = "phoneAlertScreenName";

			if (game.phone.visible && game.phone.raised && game.phone.screen_on) {
				game.screens["phoneAlertScreenName"].x = game.canvas.x - PHONE_SCREEN_X;
				game.screens["phoneAlertScreenName"].y = game.canvas.y - PHONE_SCREEN_Y;

				clearDisplayObject(game.screens[game.phone.screen], commands);
				drawDisplayObject(game.screens[game.phone.active_alert_screen], commands);
			}
		} else {
			game.phone.pending_alerts.push(message);
		}

		socket.emit('command', commands);
	}

	function dismissPhoneAlertPopup () {
		var commands = [];

		// Dismiss the active phone alert; if there is another alert in the queue, show that alert, otherwise, show the regular phone screen.
		if (game.phone.pending_alerts.length > 0) {
			if (game.phone.visible && game.phone.raised && game.phone.screen_on) {
				clearDisplayObject(game.screens["phoneAlertScreenName"], commands);
			}

			game.screens["phoneAlertScreenName"] = createPhoneAlertScreen(game.phone.pending_alerts[0]);
			game.screens["phoneAlertScreenName"].x = game.canvas.x - PHONE_SCREEN_X;
			game.screens["phoneAlertScreenName"].y = game.canvas.y - PHONE_SCREEN_Y;

			game.phone.pending_alerts.splice(0, 1); // Remove the element that was just drawn from the queue.

			if (game.phone.visible && game.phone.raised && game.phone.screen_on) {
				drawDisplayObject(game.screens["phoneAlertScreenName"], commands);
			}
		} else {
			clearDisplayObject(game.screens["phoneAlertScreenName"], commands);

			game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
			game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;
			drawDisplayObject(game.screens[game.phone.screen], commands);

			delete game.phone.active_alert_screen;
		}

		socket.emit('command', commands);
	}

	function createPhoneAlertScreen(message) {
		return new Screen (0, 0, PHONE_SCREEN_LAYER, new Image('image/phone/screen/on', 0, 0, 0), [
			new Button ('phone-dismiss-active-alert', 20, 256, 153, 286, 1, "Dismiss", "24px Times", "rgba(0,0,0,1)")], [], [
			new Text ('phone-alert-screen-message', 0, 0, 173, 251, 1, message, '18px Arial', 'rgba(0,0,0,1)')
		]);
	}

	var TASK_VERTICAL_SIZE = 36;
	function addToTodoList (task) {
		// If this is the case, this location has not been seen before, so it must be added to the todo list main screen.
		if (typeof game.todoList[task.locationOfTask] === 'undefined') {
			game.todoList[task.locationOfTask] = {};

			game.todoList[task.locationOfTask].screen_name = "phoneTodoListAppScreenForLocation-" + task.locationOfTask;
			game.screens[game.todoList[task.locationOfTask].screen_name] = new Screen (0, 0, 0, new Image('image/phone/screen/on', 0, 0, 0), [
				new Button("phone-backto-locations", 0, 0, 173, 30, 1, "Back", "24px Times", "rgba(0,0,0,1)")
				], [], [
				new ScrollableList ("phone-todo-list-for-" + task.locationOfTask, 0, 30, 173, 291, 1, new Rectangle ("phone_todo_list_for_" + task.locationOfTask + "_backing_transparent_rectangle", 0, 0, 173, 261, 0, 'rgba(0,0,0,0)'))
			]);

			console.log(game.todoList[task.locationOfTask].screen_name);
			console.log(game.screens[game.todoList[task.locationOfTask].screen_name]);

			game.todoList[task.locationOfTask].taskList = [];

			var scrollableList = game.screens["phoneTodoListAppScreen"].extras[0]; // This is the scrollableList of all the locations.
			addElementToScrollableList(scrollableList, new Screen (0, 0, 0,
				new Rectangle(task.locationOfTask + "_todo_location_task_transparent_base_rectangle", 0, 0, 173, 291, 0, 'rgba(0,0,0,0)'), [
				new Button ("phone-todo-list-open-location-" + task.locationOfTask, 0, 0, 173, 21, 1, task.locationOfTask, "18px Times", "rgba(0,0,0,1)") ], [], [
			]), 21);
		}

		game.todoList[task.locationOfTask].taskList.push(task);
		addElementToScrollableList(game.screens[game.todoList[task.locationOfTask].screen_name].extras[0], createDisplayElementForTask(task), TASK_VERTICAL_SIZE);
	}

	function removeFromTodoList (taskName, location) {
		if (typeof game.todoList[location] === 'undefined') throw new Error ("Location was not defined in the Todo List: " + location);

		var removeCount = 0;
		for (var i = 0; i < game.todoList[location].taskList.length; i++) {
			if (game.todoList[location].taskList[i].name == taskName) {
				game.todoList[location].taskList.splice(i, 1);

				var scrollableList = game.screens[game.todoList[location].screen_name].extras[0];
				deleteElementFromScrollableList(scrollableList, scrollableList.display_elements[i]);

				removeCount++;
			}
		}

		if (removeCount != 1) console.log(username + " | Warning: removeFromTodoList(" + taskName + ", " + location + ") removed " + removeCount + " entries!");
	}

	function removeAllAtLocationFromTodoList (location) {
		if (typeof game.todoList[location] === 'undefined') throw new Error ("Location was not defined in the Todo List: " + location);

		for (var i = 0; i < game.todoList[location].taskList.length; i++) {
			removeFromTodoList(game.todoList[location].taskList[i].name, location);
			i--;
		}
	}

	function markAsComplete(taskName, location, complete_status) {
		if (typeof game.todoList[location] === 'undefined') throw new Error ("Location was not defined in the Todo List: " + location);

		var found = false;
		for (var i = 0; i < game.todoList[location].taskList.length; i++) {
			if (game.todoList[location].taskList[i].name == taskName) {
				var task = game.todoList[location].taskList[i];
				task.completed = complete_status;

				var scrollableList = game.screens[game.todoList[location].screen_name].extras[0];
				deleteElementFromScrollableList(scrollableList, scrollableList.display_elements[i]);
				addElementToScrollableList(scrollableList, createDisplayElementForTask(task), TASK_VERTICAL_SIZE, i);

				found = true;
			}
		}

		if (!found) console.log(username + " | Warning: no task found in " + location + " with name " + taskName);
	}

	function createDisplayElementForTask(task) {
		return new Text (task.name, 0, 0, 173, TASK_VERTICAL_SIZE, 1, task.task, "16px Times", task.completed ? "rgba(64,64,64,1)" : "rgba(0,0,0,1)");
	}

	var EMAIL_VERTICAL_SIZE = 15; // The vertical height of a single email message (in the phone-email-list)
	/* Adds the specified message to the player's inbox */
	function addToMailbox (message) {
		var email_no = game.mailbox.length;
		game.mailbox.push(message);
		addElementToScrollableList(game.screens["phoneEmailAppScreen"].extras[0], createMessageScreen(email_no), EMAIL_VERTICAL_SIZE);
		if (isPhoneAppInstalled("Email")) {
			pushPhoneAlert("New email from " + message.sender);
		}
	}

	/* Deletes the item in the player's mailbox at the specified index */
	function removeFromMailbox (email_no) {
		var scrollableList = game.screens["phoneEmailAppScreen"].extras[0];
		game.mailbox.splice(email_no, 1);
		deleteElementFromScrollableList(scrollableList, scrollableList.display_elements[email_no]);

		/* Note: because of the way that emails were originally stored, the name of the buttons on each message is dependent on its position.
		 * This means that all emails below the one being removed must be deleted and re-created
		 */
		for (var i = email_no; i < scrollableList.display_elements.length; i++) {
			deleteElementFromScrollableList(scrollableList, scrollableList.display_elements[i]);
			addElementToScrollableList(scrollableList, createMessageScreen(i), EMAIL_VERTICAL_SIZE, i);
		}
	}

	/* Marks the item in the player's mailbox at the specified index as read. */
	function markAsRead (email_no) {
		if (game.mailbox[email_no].unread) {
			game.mailbox[email_no].unread = false;

			// Perform the action that is supposed to occur after reading this message, if there is one.
			if (typeof game.mailbox[email_no].command_on_read !== 'undefined') {
				var command = game.mailbox[email_no].command_on_read;
				if (command.match(/unlock_.*/)) {
					location_to_unlock = command.substring(7);
					unlockLocation(location_to_unlock);
				} else if (command == "email_hacked_mfa_enabled") {
					showDialog("email_hack_mfa_enabled_dialog");
				} else if (command == "email_hacked_mfa_disabled") {
					showDialog("email_hack_mfa_disabled_dialog");
				}
				
			}

			// Remove the old element representing this email and replace it with a new one, which will display the email marked as read.
			var scrollableList = game.screens["phoneEmailAppScreen"].extras[0]; // This is a reference to the scrolling list of emails.
			deleteElementFromScrollableList(scrollableList, scrollableList.display_elements[email_no]);
			addElementToScrollableList(scrollableList, createMessageScreen(email_no), EMAIL_VERTICAL_SIZE, email_no);
		}
	}

	// Helper function which creates a message screen for a given message
	function createMessageScreen (email_no) {
		var message = game.mailbox[email_no];
		var message_screen = new Screen (0, 0, 1, new Rectangle("inbox_" + email_no + "_background", 0, 0, 143, 15, 0, "rgba(192,192,192," + (message.unread ? 1 : 0.2) + ")"),
			/*Buttons */[new Button("inbox_" + email_no + "_button", 0, 0, 143, 14, 0)], [],
			/*Elements */ [new Text ("inbox_" + email_no + "_sender", 0, 0, 40, 15, 1, message.sender, "11px Arial", "rgba(0,0,0,1)"), new Text("inbox_" + email_no + "_subject", 50, 0, 143, 15, 1, message.subject, "11px Arial", "rgba(0,0,0,1)")]
		);
		return message_screen;
	}

	/* Displays the specified dialog object, clearing out all underlying buttons as necessary */
	function showDialog(dialog_name) {
		var commands = [];

		game.active_dialog = {name:dialog_name, replace_phone:game.phone.visible}

		if (game.phone.visible) {
			hidePhone();
		}

		if (typeof game.active_browser !== 'undefined') {
			setup_dialog_screen(game.dialogs[dialog_name], {x:800, y:600 /* Canvas size when the browser is enabled */}, game.browsers[game.active_browser].screen);
			clearDisplayObject(game.browsers[game.active_browser].screen, commands);
		} else if (typeof game.active_filesystem !== 'undefined') {
			setup_dialog_screen(game.dialogs[dialog_name], game.canvas, get_current_screen(game.filesystems[game.active_filesystem]));
			clearDisplayObject(get_current_screen(game.filesystems[game.active_filesystem]), commands);
		} else {
			setup_dialog_screen(game.dialogs[dialog_name], game.canvas, game.screens[game.main_screen]);
			clearDisplayObject(game.screens[game.main_screen], commands);
		}

		drawDisplayObject(game.dialogs[dialog_name].screen, commands);

		socket.emit('command', commands);
	}

	/* Closes the currently active dialog */
	function closeDialog() {
		var commands = [];

		clearDisplayObject(game.dialogs[game.active_dialog.name].screen, commands);
		if (game.active_dialog.replace_phone) {
			showPhone();
		}

		if (typeof game.active_browser !== 'undefined') {
			drawDisplayObject(game.browsers[game.active_browser].screen, commands);
		} else if (typeof game.active_filesystem !== 'undefined') {
			drawDisplayObject(get_current_screen(game.filesystems[game.active_filesystem]), commands);
		} else {
			drawDisplayObject(game.screens[game.main_screen], commands);
		}

		delete game.active_dialog;
		socket.emit('command', commands);
	}

	/* Changes the phone screen, to the screen with the specified name */
	function changePhoneScreen (name) {
		var commands = [];

		game.screens[name].x = game.canvas.x - PHONE_SCREEN_X;
		game.screens[name].y = game.canvas.y - PHONE_SCREEN_Y;
		game.screens[name].layer = PHONE_SCREEN_LAYER;

		if (game.phone.visible && game.phone.raised && game.phone.screen_on && typeof game.phone.active_alert_screen === 'undefined') {
			clearDisplayObject(game.screens[game.phone.screen], commands);
			drawDisplayObject(game.screens[name], commands);
		}

		game.phone.screen = name;
		socket.emit('command', commands);
	}

	/* Helper function to compute the (x, y) location of an app given its number.
	 * A two element array is returned, of the form [x, y]. */
	function positionOfAppNo (app_no) {
		return [58*(app_no % 3), 58*Math.floor(app_no / 3)];
	}

	/* Installs the given app onto the phone. The purchase_screen_name argument is
	 * optional. If provided, this function will modify the purchase screen to
	 * indicate that the user has the app already installed. */
	function installPhoneApp (app) {
		var app_no = game.phone_apps.length;
		var app_position = positionOfAppNo(app_no);
		var x = app_position[0];
		var y = app_position[1];

		addElementToScreen(game.screens["phoneHomeScreen"], new Screen (x, y, 1, app.icon, [new Button (app.name + "_start_button", 0, 0, 56, 56, 0)], [], [])); // An event to handle this button clicked is handled already.
		addButtonToScreen(game.screens["phoneSettingsUninstallPage"], new Button (app.name + "_uninstall_button", 0, 20*(app_no + 1), 173, 20*(app_no + 2), 2, "Uninstall " + app.name, "16px Times", "rgba(0, 0, 0, 1)"));
		game.phone_apps.push(app);

		if (typeof app.purchase_screen_name !== 'undefined') {
			var screen = game.screens[app.purchase_screen_name];

			// Remove download button.
			for (var i = 0; i < screen.buttons.length; i++) {
				if (screen.buttons[i].name == "app_purchase_screen_" + app.name + "_download") {
					removeButtonFromScreen(screen, screen.buttons[i]);
					i--;
				}
			}

			// Replace download button with text indicating its already installed.
			addElementToScreen(screen, new Text ("app_purchase_screen_" + app.name + "_already_installed", 5, 80, 84, 96, 3, "Installed", "11px Times", "rgba(64, 64, 64, 1)"));

			// Change cancel button's text to back.
			for (var i = 0; i < screen.buttons.length; i++) {
				if (screen.buttons[i].name.match(/app_purchase_screen_.*_cancel/) != null) {
					var cancel_button = screen.buttons[i];
					// Note that the modification must be done in this manner to assure it is re-drawn if the screen happens to be up.
					removeButtonFromScreen(screen, cancel_button);
					cancel_button.text = "Back";
					addButtonToScreen(screen, cancel_button);
					break; // Must exit the loop to avoid encountering the button again
				}
			}
		}
	}

	/* Removes the specified app from the phone. */
	function uninstallPhoneApp(app) {
		var app_no;
		for (var i = 0; i < game.phone_apps.length; i++) {
			if (game.phone_apps[i] == app)
				app_no = i;
		}

		game.phone_apps.splice(app_no, 1); // Get rid of this app.

		for (var i = 0; i < game.screens["phoneHomeScreen"].extras.length; i++) {
			if (game.screens["phoneHomeScreen"].extras[i].type == 'screen' && game.screens["phoneHomeScreen"].extras[i].buttons[0].name == app.name + "_start_button") {
				removeElementFromScreen(game.screens["phoneHomeScreen"], game.screens["phoneHomeScreen"].extras[i]); // Get rid of its start button.
				i--;
			}
		}

		// Mark the app as downloadable once again.
		if (typeof app.purchase_screen_name !== 'undefined') {
			var screen = game.screens[app.purchase_screen_name];

			// Delete the text element that indicates the app is installed.
			for (var i = 0; i < screen.extras.length; i++) {
				if (screen.extras[i].name == "app_purchase_screen_" + app.name + "_already_installed") {
					removeElementFromScreen(screen, screen.extras[i]);
					i--;
				}
			}

			// Add the downloadable button back
			addButtonToScreen(screen, new Button ("app_purchase_screen_" + app.name + "_download", 5, 80, 84, 96, 3, "  Download", "11px Times", "rgba(0, 0, 0, 1)"));

			// Change cancel button's text back to cancel (from back)
			for (var i = 0; i < screen.buttons.length; i++) {
				if (screen.buttons[i].name == "app_purchase_screen_" + app.name + "_cancel") {
					var cancel_button = screen.buttons[i];
					// Note that the modification must be done in this manner to assure it is re-drawn if the screen happens to be up.
					removeButtonFromScreen(screen, cancel_button);
					cancel_button.text = "Cancel";
					addButtonToScreen(screen, cancel_button);
					break; // Must exit the loop to avoid encountering the button again
				}
			}
		}

		// Get rid of the app in the uninstall page.
		for (var i = 0; i < game.screens["phoneSettingsUninstallPage"].buttons.length; i++) {
			if (game.screens["phoneSettingsUninstallPage"].buttons[i].name == app.name + "_uninstall_button") {
				removeButtonFromScreen(game.screens["phoneSettingsUninstallPage"], game.screens["phoneSettingsUninstallPage"].buttons[i]);
			}
		}

		// Re-position apps that came after the uninstalled one in the list to their new locations on the HomeScreen.
		// Note that app_no is now the index of the first app that came after the app that was just uninstalled.
		for (var i = app_no; i < game.phone_apps.length; i++) {
			for (var j = 0; j < game.screens["phoneHomeScreen"].extras.length; j++) {
				if (game.screens["phoneHomeScreen"].extras[j].type == 'screen' && game.screens["phoneHomeScreen"].extras[j].buttons[0].name == game.phone_apps[i].name + "_start_button") {
					var app_start_button_screen = game.screens["phoneHomeScreen"].extras[j];
					removeElementFromScreen(game.screens["phoneHomeScreen"], app_start_button_screen);
					var new_position = positionOfAppNo(i);

					app_start_button_screen.x = new_position[0];
					app_start_button_screen.y = new_position[1];

					addElementToScreen(game.screens["phoneHomeScreen"], app_start_button_screen);
					break; // Need to bail out, or else we could encounter this screen again in the loop.
				}
			}

			// Repositions the uninstall button
			for (var j = 0; j < game.screens["phoneSettingsUninstallPage"].buttons.length; j++) {
				if (game.screens["phoneSettingsUninstallPage"].buttons[j].name == game.phone_apps[i].name + "_uninstall_button") {
					var button = game.screens["phoneSettingsUninstallPage"].buttons[j];
					removeButtonFromScreen(game.screens["phoneSettingsUninstallPage"], button);
					button.y1 -= 20;
					button.y2 -= 20;
					addButtonToScreen(game.screens["phoneSettingsUninstallPage"], button);
					break;
				}
			}
		}
	}
	
	/* Returns true if an app with the given name is installed on the phone, and false otherwise */
	function isPhoneAppInstalled (app_name) {
		for (var i = 0; i < game.phone_apps.length; i++) {
			if (game.phone_apps[i].name == app_name)
				return true;
		}
		return false;
	}

	/* Changes the main screen to the screen with the specified name */
	function changeMainScreen (name) {
		var commands = [];

		if (typeof game.background_music[game.main_screen] === 'undefined' && typeof game.background_music[name] !== 'undefined') {
			playAudio(game.background_music[name]);
		} else if (typeof game.background_music[game.main_screen] !== 'undefined' && typeof game.background_music[name] === 'undefined') {
			stopAudio(game.background_music[game.main_screen]);
		} else if (typeof game.background_music[game.main_screen] !== 'undefined' && typeof game.background_music[name] !== 'undefined') {
			if (game.background_music[game.main_screen] != game.background_music[name]) {
				stopAudio(game.background_music[game.main_screen]);
				playAudio(game.background_music[game.screen]);
			}
		}

		if (game.screens[game.main_screen]["on_screen"]) {
			clearDisplayObject(game.screens[game.main_screen], commands);
			drawDisplayObject(game.screens[name], commands);
		}

		game.main_screen = name;
		socket.emit('command', commands);
	}

	/* Adds an element to the extras array of a screen.
	 * If the screen is currently visible, it is redrawn appropriately */
	function addElementToScreen (screen, element) {
		var commands = [];

		if (screen["on_screen"]) {
			drawDisplayObjectHelper(element, commands, screen["on_screen_x"], screen["on_screen_y"], screen["on_screen_layer"]);
		}

		screen.extras.push(element);
		socket.emit('command', commands);
	}

	/* Removes an element from the extras array of a screen.
	 * If the screen is currently visible, it is redrawn */
	function removeElementFromScreen (screen, element) {
		var commands = [];
		if (screen["on_screen"]) {
			clearDisplayObject(element, commands);
		}

		var removeCount = 0;
		for (var i = 0; i < screen.extras.length; i++) {
			if (screen.extras[i] == element) {
				screen.extras.splice(i, 1);
				removeCount++;
			}
		}
		if (removeCount != 1) writeToServerLog(username + " | Warning, removeElementFromScreen removed " + removeCount + " elements. Arguments: screen = " + screen + " element = " + element);
		socket.emit('command', commands);
	}

	 /* Adds a button to a screen.
	  * If the screen is currently visible, the button will be made visible to the user immediately */
	function addButtonToScreen (screen, button) {
		var commands = [];
		if (screen["on_screen"]) {
			if (button.text) {
				commands.push(["addButton", button.name, screen.on_screen_x + button.x1, screen.on_screen_y + button.y1, screen.on_screen_x + button.x2, screen.on_screen_y + button.y2, screen.on_screen_layer + button.layer, button.text, button.font, button.font_color]);
			} else {
				commands.push(["addButton", button.name, screen.on_screen_x + button.x1, screen.on_screen_y + button.y1, screen.on_screen_x + button.x2, screen.on_screen_y + button.y2, screen.on_screen_layer + button.layer]);
			}
		}

		screen.buttons.push(button);
		socket.emit('command', commands);
	}

	/* Removes a button from a screen.
	 * If the screen is currently visible, it is removed immediately. */
	function removeButtonFromScreen (screen, button) {
		var commands = [];
		if (screen["on_screen"]) {
			commands.push(["deleteButton", button.name]);
		}

		var removeCount = 0;
		for (var i = 0; i < screen.buttons.length; i++) {
			if (screen.buttons[i] == button) {
				screen.buttons.splice(i, 1);
				removeCount++;
			}
		}

		if (removeCount != 1) writeToServerLog(username + " | Warning, call to removeButtonFromScreen removed " + removeCount + " buttons. Arguments were screen = " + screen + "button = " + button);
		socket.emit('command', commands);
	}

	/* Adds a text input field to the screen.
	 * If the screen is currently visible, the change is reflected immediately */
	function addTextInputFieldToScreen (screen, field) {
		var commands = [];
		if (screen["on_screen"]) {
			commands.push(["addTextInputField", field.name, screen.on_screen_x + field.x1, screen.on_screen_y + field.y1, screen.on_screen_x + field.x2, screen.on_screen_y + field.y2, screen.on_screen_layer + field.layer, field.text, field.font, field.font_color, field.help_text]);
		}

		screen.textFields.push(field);
		socket.emit('command', commands);
	}

	/* Removes a text input field from the screen.
	 * If the screen is currently visible, the change is reflected immediately */
	function removeTextInputFieldFromScreen (screen, field) {
		var commands = [];
		if (screen["on_screen"]) {
			commands.push(["deleteTextInputField", field.name]);
		}

		var removeCount = 0;
		for (var i = 0; i < screen.textFields.length; i++) {
			if (screen.textFields[i] == field) {
				screen.textFields.splice(i, 1);
				removeCount++;
			}
		}

		if (removeCount != 1) writeToServerLog(username + " | Warning, call to removeTextInputFieldFromScreen removed " + removeCount + " fields. Arguments were screen = " + screen + "field = " + field);
		socket.emit('command', commands);
	}

	/* Adds an element to a ScrollableList.
	 * Note that the (x, y) position of an element added to a ScrollableList will be changed
	 * based on the current scroll position of that list.
	 * This method will work even if the ScrollableList is on the screen.

	 * The final argument (new_element_index) is optional; if provided, it specifies which index in the scrollableList to insert
	 * the new element; if it is not provided, by default this function adds the element to the end of the scrollableList.
	 */
	function addElementToScrollableList (scrollableList, element, element_vertical_size, new_element_index) {
		if (typeof new_element_index === 'undefined') {
			var new_element_index = scrollableList.display_elements.length;
			scrollableList.display_elements[new_element_index] = element;
			scrollableList.display_element_sizes[new_element_index] = element_vertical_size;

			if (scrollableListElementDisplayable(scrollableList, new_element_index)) {
				// Moves the object to the appropriate position, and adds it to the screen.
				translateInPlace(element, -element.x, yPositionOfScrollableListElement(scrollableList, new_element_index) - element.y, 0);
				addElementToScreen(scrollableList, element);
			}
		} else if (new_element_index >= 0 && new_element_index <= scrollableList.display_elements.length) {
			scrollableList.display_elements.splice(new_element_index, 0, element);
			scrollableList.display_element_sizes.splice(new_element_index, 0, element_vertical_size);

			// Refreshes the scrollableList element.
			changeScrollPositionOfScrollableList(scrollableList, scrollableList.scroll_position);
		} else {
			throw new Error("addElementToScrollableList: ScrollableList index out of bounds: " + new_element_index + " size: " + scrollableList.display_elements.length);
		}
	}

	/* Changes the scroll position of a ScrollableList to a the specified new position.
	 * This method will work even when the ScrollableList is on the screen.
	 */
	function changeScrollPositionOfScrollableList (scrollableList, newScrollPosition) {
		// Remove all visible elements from the screen.
		for (var i = 0; i < scrollableList.extras.length; i++) {
			removeElementFromScreen(scrollableList, scrollableList.extras[i]);
			i--;
		}

		// Sets the new scroll position.
		scrollableList.scroll_position = newScrollPosition;

		// Adds the elements that are now visible back to the screen in the appropriate places.
		for (var i = 0; i < scrollableList.display_elements.length; i++) {
			if (scrollableListElementDisplayable(scrollableList, i)) {
				translateInPlace(scrollableList.display_elements[i], -scrollableList.display_elements[i].x, yPositionOfScrollableListElement(scrollableList, i) - scrollableList.display_elements[i].y, 0);
				addElementToScreen(scrollableList, scrollableList.display_elements[i]);
			}
		}
	}

	/* Removes the specified element from the ScrollableList.
	 * This method will work even when the ScrollableList is on the screen.
	 */
	function deleteElementFromScrollableList (scrollableList, element) {
		var removeCount = 0;
		// Find the given element in the scrollableList's display elements and delete it, as well as the
		// record of its size.
		for (var i = 0; i < scrollableList.display_elements.length; i++) {
			if (scrollableList.display_elements[i] == element) {
				scrollableList.display_elements.splice(i, 1);
				scrollableList.display_element_sizes.splice(i, 1);
				i--;
				removeCount++;
			}
		}

		// The scroll position may now need to be updated, if the removal of this element has caused the current scroll position to become invalid.
		// The scroll position must always be 0 if the list is empty, or between 0 and the list's length - 1 if the list is not empty.
		// Note that this direct modification of the scroll position is only safe because of the call below these conditional statements.
		if (scrollableList.display_elements.length == 0) {
			scrollableList.scroll_position = 0;
		} else if (scrollableList.scroll_position >= scrollableList.display_elements.length) {
			scrollableList.scroll_position = scrollableList.display_elements.length - 1;
		}

		// There is of course a more efficient way to do this [redraw the components that moved as a result of the deletion], but this is the easiest.
		changeScrollPositionOfScrollableList(scrollableList, scrollableList.scroll_position);

		if (removeCount != 1)
			writeToServerLog(username + " | Warning: call to deleteElementFromScrollableList removed " + removeCount + " elements. Arguments were scrollableList = " + scrollableList + ", element = " + element);
	}

	/* Starts playing an audio file. The audioID is a string, which matches the ID of the audio element in the HTML code. */
	function playAudio (audioID) {
		var commands = [];

		commands.push(["playSound", audioID]);

		socket.emit('command', commands);
	}

	/* This method stops playing an audio file. The audioID is a string as above. */
	function stopAudio (audioID) {
		var commands = [];

		commands.push(["stopSound", audioID]);

		socket.emit('command', commands);
	}

	/* Plays the specified video.
	 * Upon completion of playback, returns to the game automatically. */
	function playVideo (videoID) {
		var commands = [];

		commands.push(["playVideo", videoID]);

		socket.emit('command', commands);
	}

	/* This function triggers the email-hacking incident */
	function triggerEmailHack () {
		var message;
		if (game.introduction_variables.mfa_enabled) {
			var mfa_code = Math.random(10).toString().substring(2, 7);
			message = new EmailMessage("New Account Activity", "No-Reply", "A login attempt was detected from 222.186.161.215 [China - Nanjing].", [], "email_hacked_mfa_enabled");
			pushPhoneAlert("Login attempted from 222.186.161.215 [China - Nanjing]. Enter this code when prompted to proceed: " + mfa_code);
		} else {
			message = new EmailMessage("New Account Activity", "No-Reply", "A new login was detected from 222.186.161.215 [China - Nanjing].", [], "email_hacked_mfa_disabled");
		}
		addToMailbox(message);
	}

	/* This function returns the player to their office (this occurs after completion/failure of a mission). */
	function returnToPlayerOffice () {
		changeMainScreen("player_office");
		resizeCanvas(1099, 549);
	}

	/* Function checks to see if the user has completed the game. If so, will show the game complete screen. */
	function checkForGameCompletion () {
		score_mall (game.mall_scene_variables);
	
		var total_score = game.coffee_shop_variables.score + game.library_variables.score + game.apartment_variables.score + game.introduction_variables.score + game.mall_scene_variables.score + (game.police_station_variables.module_complete ? 1 : 0) + (game.final_module_variables.final_module_complete ? 1 : 0);
		// Update text entries on the game complete screen
		for (var i = 0; i < game.screens["gameCompleteScreen"].extras.length; i++) {
			var text_score_element = game.screens["gameCompleteScreen"].extras[i];
			// If this isn't a text element, skip over it
			if (text_score_element.type == 'text') {
				if (text_score_element.name == 'game_complete_coffee_shop_score') {
					text_score_element.text = "Coffee Shop: " + game.coffee_shop_variables.score + " / 30";
				} else if (text_score_element.name == 'game_complete_library_score') {
					text_score_element.text = "Library: " + game.library_variables.score + " / 30";
				} else if (text_score_element.name == 'game_complete_apartment_score') {
					text_score_element.text = "Apartment: " + game.apartment_variables.score + " / 30";
				} else if (text_score_element.name == 'game_complete_total_score') {
					text_score_element.text = "Total Score: " + total_score + " / 152";
				} else if (text_score_element.name == 'game_complete_introduction_score') {
					text_score_element.text = "Introduction: " + game.introduction_variables.score + " / 30";
				} else if (text_score_element.name == 'game_complete_mall_score') {
					text_score_element.text = "Mall: " + game.mall_scene_variables.score + " / 30";
				} else if (text_score_element.name == 'game_complete_police_station_score') {
					text_score_element.text = "Police Station: " + (game.police_station_variables.module_complete ? 1 : 0) + " / 1";
				} else if (text_score_element.name == 'game_complete_dorm_room_score') {
					text_score_element.text = "Dorm Room: " + (game.final_module_variables.final_module_complete ? 1 : 0) + " / 1";
				}
			}
		}

		if (game.final_module_variables.final_module_complete) {
			// Game is indeed complete.
			resizeCanvas(1280, 720);
			changeMainScreen("gameCredits");
			hidePhone();
		} else if (game.coffee_shop_variables.score > 0 && game.library_variables.score > 0 && game.apartment_variables.score > 0 && game.introduction_variables.score > 0 && game.mall_scene_variables.score > 0 && game.police_station_variables.module_complete) {
			// All modules except the final are complete.
			// Send message to unlock the final module's location.
			sendMissionEmail("dorm_room");
		}
	}

	// Helper function to verify that a button is on a screen. Takes the screen object and a button name
	// Returns true if the screen does indeed contain the button.
	function verifyScreen(screen, button_name) {
		for (var i = 0; i < screen.buttons.length; i++) {
			if (screen.buttons[i].name == button_name)
				return true;
		}

		for (var i = 0; i < screen.extras.length; i++) {
			if (screen.extras[i].type == 'screen' && verifyScreen(screen.extras[i], button_name))
				return true;
		}

		return false;
	}

	// Returns a reference to the screen object that contains a button with the given name.
	// Returns null if the requested button cannot be located.
	function findScreenWithButton (button_name) {
		var retVal = null;
		if (typeof game.active_dialog !== 'undefined') {
			retVal =  findScreenWithButtonHelper(game.dialogs[game.active_dialog.name].screen, button_name);
		} else if (typeof game.active_browser !== 'undefined') {
			retVal = findScreenWithButtonHelper(game.browsers[game.active_browser].screen, button_name);
		} else if (typeof game.active_filesystem !== 'undefined') {
			retVal = findScreenWithButtonHelper(get_current_screen(game.filesystems[game.active_filesystem]), button_name);
		} else {
			retVal = findScreenWithButtonHelper(game.screens[game.main_screen], button_name);
		}

		if (retVal != null) {
			return retVal;
		} else {
			if (game.phone.visible && game.phone.raised && game.phone.screen_on) {
				retVal = findScreenWithButtonHelper(game.screens[game.phone.screen], button_name);
			}

			return retVal;
		}
	}

	// Helper function. Returns screen if the given screen directly contains the button.
	// Otherwise, recursively searches for the button in the screens that are children of
	// this screen.
	function findScreenWithButtonHelper (screen, button_name) {
		for (var i = 0; i < screen.buttons.length; i++) {
			if (screen.buttons[i].name == button_name)
				return screen;
		}

		for (var i = 0; i < screen.extras.length; i++) {
			if (screen.extras[i].type == 'screen') {
				var returnValue = findScreenWithButtonHelper(screen.extras[i], button_name);
				if (returnValue != null)
					return returnValue;
			}
		}

		return null;
	}

	socket.on('click', function (button) {
		// Verify that the clicked button is actually on the screen.
		if (typeof button === 'undefined') {
			writeToServerLog(username + " | Received invalid click event -- no button argument");
			return;
		} else {
			writeToServerLog(username + " | clicked on " + button);
			var valid = false;
			if (typeof game.active_dialog !== 'undefined') {
				valid = verifyScreen(game.dialogs[game.active_dialog.name].screen, button);
			} else if (typeof game.active_browser !== 'undefined') {
				valid = verifyScreen(game.browsers[game.active_browser].screen, button);
			} else if (typeof game.active_filesystem !== 'undefined') {
				valid = verifyScreen(get_current_screen(game.filesystems[game.active_filesystem]), button);
			} else {
				valid = verifyScreen(game.screens[game.main_screen], button);
			}

			// If the event is already valid, don't mess with the valid status.
			if (!valid) {
				if (game.phone.visible) {
					if (game.phone.raised) {
						if (button == 'lower-phone-button' || button == 'phone-power-button')
							valid = true;
						if (game.phone.screen_on && typeof game.phone.active_alert_screen === 'undefined' && verifyScreen(game.screens[game.phone.screen], button))
							valid = true;
						if (game.phone.screen_on && typeof game.phone.active_alert_screen !== 'undefined' && verifyScreen(game.screens[game.phone.active_alert_screen], button))
							valid = true;
					} else {
						if (button == 'raise-phone-button')
							valid = true;
					}
				}
			}

			if (!valid) {
				writeToServerLog(username + " | Received invalid click event -- the button \"" + button + "\" could not be found.");
				return;
			}
		}

		// Handle events in the modules, but only if they are loaded
		if (game.scenes_loaded) {
			if (coffee_shop_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, removeElementFromScreen, playVideo, addToTodoList, removeFromTodoList, removeAllAtLocationFromTodoList, markAsComplete, checkForGameCompletion, triggerEmailHack, returnToPlayerOffice, game.coffee_shop_variables, game)) {
				return;
			} else if(mall_scene_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, installPhoneApp, addButtonToScreen, changePhoneScreen, addToTodoList, markAsComplete, removeElementFromScreen, showPhone, raisePhone, phoneScreenOn, game, game.mall_scene_variables)) {
				return;
			}

			if (library_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, displayFileSystem, closeFileSystem, existsInFileSystem, triggerEmailHack, checkForGameCompletion, returnToPlayerOffice, game.library_variables, game.screens["library_success"].extras[1])) {
				return;
			}

			if (apartment_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, game.apartment_variables, game.browsers["rout"], displayBrowser, closeBrowser, changeBrowserWebPage, triggerEmailHack, checkForGameCompletion, returnToPlayerOffice, game.screens["apartment_success"].extras[0])) {
				return;
			}

			if (police_station_onclick(button, changeMainScreen, resizeCanvas, sendMissionEmail, showDialog, closeDialog, displayFileSystem, closeFileSystem, existsInFileSystem, displayBrowser, changeBrowserWebPage, closeBrowser, playVideo, checkForGameCompletion, game.browsers["police_station_browser"], game.police_station_variables)) {
				return;
			}

			if (final_module_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, displayBrowser, changeBrowserWebPage, closeBrowser, addElementToScreen, removeElementFromScreen, removeButtonFromScreen, showPhone, hidePhone, playVideo, addToTodoList, removeFromTodoList, removeAllAtLocationFromTodoList, markAsComplete, checkForGameCompletion, triggerEmailHack, returnToPlayerOffice, game.final_module_variables, game.browsers["final_browser"], game)) {
				return;
			}

		}

		if (introduction_onclick(button, changeMainScreen, showDialog, closeDialog, displayBrowser, changeBrowserWebPage, closeBrowser, changePhoneScreen, resizeCanvas, loadScenes, hidePhone, showPhone, pushPhoneAlert, playVideo, game.browsers["introduction_computer_browser"], game.introduction_variables)) {
			return;
		}

		for (var i = 0; i < game.phone_apps.length; i++) {
			if (button == game.phone_apps[i].name + "_start_button") {
				changePhoneScreen(game.phone_apps[i].screen_name);
				return;
			} else if (button == game.phone_apps[i].name + "_uninstall_button") {
				// Make some apps impossible to uninstall
				// TODO spoof map needs to be impossible to uninstall unless the player has the good map installed.
				if (game.phone_apps[i].name == "Map" || game.phone_apps[i].name == "Email" || game.phone_apps[i].name == "Settings") {
					showDialog("invalidUninstallDialog");
				} else {
					uninstallPhoneApp(game.phone_apps[i]);
				} return;
			}
		}
		for (var i = 0; i < game.mailbox.length; i++) {
			if (button == "inbox_" + i + "_button") {
				// Setup phoneEmailMessageScreen
				game.screens["phoneEmailMessageScreen"] = email_message_screen(game.mailbox[i], i, game.canvas);
				changePhoneScreen("phoneEmailMessageScreen");
				// The email is not marked as read until the player backs out of or deletes the message.
				return;
			}
		}
		for (var i = 0; i < game.mailbox.length; i++) {
			if (button == "Email_delete_button_" + i) {
				markAsRead(i);
				removeFromMailbox(i);
				if (game.phone.screen == "phoneEmailMessageScreen")
					changePhoneScreen("phoneEmailAppScreen");
				return;
			} else if (button == "Email_back_button_" + i) {
				markAsRead(i);
				changePhoneScreen("phoneEmailAppScreen");
				return;
			}
		}

		if (button.match(/app_purchase_screen_.*_cancel/) != null) {
			changePhoneScreen("phoneHomeScreen");
			return;
		}

		if (button.match(/scrolling_list_.*_scroll_up/) != null) {
			var scrolling_list = findScreenWithButton(button);
			if (scrolling_list != null) {
				if (scrolling_list.scroll_position > 0)
					changeScrollPositionOfScrollableList(scrolling_list, scrolling_list.scroll_position - 1);
				return;
			} else {
				writeToServerLog(username + " | failed to find scrolling list with the button: " + button_name);
			}
		} else if (button.match(/scrolling_list_.*_scroll_down/) != null) {
			var scrolling_list = findScreenWithButton(button);
			if (scrolling_list != null) {
				if (scrolling_list.display_elements.length > 0 && scrolling_list.scroll_position < scrolling_list.display_elements.length - 1)
					changeScrollPositionOfScrollableList(scrolling_list, scrolling_list.scroll_position + 1);
				return;
			} else {
				writeToServerLog(username + " | failed to find scrolling list with the button: " + button_name);
			}
		}

		if (button.match(/phone-todo-list-open-location-.*/) != null) {
			// Extract the location name from the button string and change the phone screen to the todoList for that location.
			var location = button.substring(30);
			changePhoneScreen("phoneTodoListAppScreenForLocation-" + location);
			return;
		}

		if (typeof game.active_filesystem !== 'undefined') {
			var current_folder = get_folder(game.filesystems[game.active_filesystem], game.filesystems[game.active_filesystem].currentDirectory);
			for (var i = 0; i < current_folder.contents.length; i++) {
				if (current_folder.contents[i].type == 'folder') {
					if (button == "delete_button_" + game.filesystems[game.active_filesystem].currentDirectory + "/" + current_folder.contents[i].name) {
						deleteFromFileSystem(game.filesystems[game.active_filesystem], game.filesystems[game.active_filesystem].currentDirectory, current_folder.contents[i]);
						return;
					}

					if (button == "change_directory_button_" + game.filesystems[game.active_filesystem].currentDirectory + "/" + current_folder.contents[i].name) {
						// To change directory, must clear the screen, then draw a new screen.
						if (game.filesystems[game.active_filesystem].currentDirectory == "")
							changeDirectory(game.filesystems[game.active_filesystem], current_folder.contents[i].name);
						else
							changeDirectory(game.filesystems[game.active_filesystem], game.filesystems[game.active_filesystem].currentDirectory + "/" + current_folder.contents[i].name);
						return;
					}
				} else {
					if (button == "delete_button_" + game.filesystems[game.active_filesystem].currentDirectory + "/" + current_folder.contents[i]) {
						deleteFromFileSystem(game.filesystems[game.active_filesystem], game.filesystems[game.active_filesystem].currentDirectory, current_folder.contents[i]);
						return;
					}
				}
			}
		}
		if (button == 'raise-phone-button') {
			raisePhone();
		} else if (button == 'lower-phone-button') {
			lowerPhone();
		} else if (button == 'phone-power-button') {
			if (game.phone.screen_on) phoneScreenOff();	else phoneScreenOn();
		} else if (button == 'testButton') {
			resizeCanvas(1280, 720);
			displayFileSystem("testFilesystem");
		} else if (button == 'browser-minimize') {
			closeBrowser(true);
		} else if (button == 'browser-x') {
			closeBrowser(true); // For maximum realism, this should be closeBrowser(false), to clear the displayed webpage when the browser is exited, but for ease of gameplay, I set it to true.
		} else if (button == 'dialog_Title_close') {
			closeDialog();
		} else if (button == 'dialog_Title_browser') {
			closeDialog();
			displayBrowser("testBrowser");
			changeBrowserWebPage(game.browsers["testBrowser"], "http://www.gogogo.com/");
		} else if (button == 'filesystem_exit') {
			closeFileSystem();
		} else if (button == 'filesystem_up') {
			if (game.filesystems[game.active_filesystem].currentDirectory != "") {
				var path = game.filesystems[game.active_filesystem].currentDirectory.split("/");
				var newPath = "";
				for (var i = 0; i < path.length - 1; i++) {
					newPath += path[i];
					if (i != path.length - 2)
					newPath += "/";
				}
				changeDirectory(game.filesystems[game.active_filesystem], newPath);
			}
		} else if (button == 'go_to_red_screen') {
			changeMainScreen("testMainScreen");
		} else if (button == 'go_to_coffee_shop') {
			// Handled in coffee_shop.js file.
		} else if (button == 'go_to_library') {
			// Handled in library.js file.
		} else if (button == 'go_to_apartment') {
			// Handled in apartment.js file.
		} else if (button == 'go_to_office_lobby') {
			// Handled in police_station.js file.
		} else if (button == 'go_to_dorm_room') {
			// Handled in final_module.js file.
		} else if (button == 'phone-exit-app') {
			changePhoneScreen("phoneHomeScreen");
		} else if (button == 'go_to_mall') {
			resizeCanvas(1152, 648);
			changeMainScreen("mall_scene");
		} else if (button == 'phone-backto-locations') {
			changePhoneScreen("phoneTodoListAppScreen");
		} else if (button == 'phone-settings-uninstall-page') {
			changePhoneScreen("phoneSettingsUninstallPage");
		} else if (button == 'phone-uninstall-back') {
			changePhoneScreen("phoneSettingsAppScreen");
		} else if (button == 'phone-alert-log') {
			changePhoneScreen("phoneAlertLogPage");
		} else if (button == 'phone-alert-log-back') {
			changePhoneScreen("phoneSettingsAppScreen");
		} else if (button == 'phone-dismiss-active-alert') {
			dismissPhoneAlertPopup();
		} else if (button == 'dialog_invalidUninstallDialog_Close.') {
			closeDialog();
		} else if (button == 'game_complete_take_survey') {
			socket.emit('command', [["changeWebpage", SURVEY_URL]]);
		} else if (button == 'dialog_email_hack_mfa_disabled_dialog_Continue.') {
			closeDialog();
			showDialog('email_hack_dialog_2');
		} else if (button == 'dialog_email_hack_mfa_enabled_dialog_Continue.') {
			closeDialog();
			showDialog('email_hack_dialog_2');
		} else if (button == 'dialog_email_hack_dialog_2_Okay.') {
			if (!game.mfa_video_played) {
				playVideo("video/mfa");
			}
			closeDialog();
		} else if (button == 'game_credits_continue') {
			resizeCanvas(1152, 648);
			changeMainScreen("gameCompleteScreen");
		} else {
			writeToServerLog(username + " | Received unhandled click event: " + button);
		}
	});

	socket.on('text-field-edit', function(name, value) {
		writeToServerLog(username + " | edited a text field: " + name + ", " + value);
		if (introduction_text_field_edit (name, value, game)) {
			return;
		} else if (apartment_text_field_edit (name, value, game)) {
			return;
		} else if (final_module_text_field_edit (name, value, game)) {
			return;
		} else if (name == 'browser-bar' && typeof game.active_browser !== 'undefined') {
			for (var i = 0; i < game.browsers[game.active_browser].screen.textFields.length; i++) {
				if (game.browsers[game.active_browser].screen.textFields[i].name == name)
					game.browsers[game.active_browser].screen.textFields[i].text = value;
			}
		} else {
			writeToServerLog(username + " | Received unhandled text-field-edit event with name, value = " + name + ", " + value);
		}
	});

	socket.on('text-field-enter', function (name, value) {
		writeToServerLog(username + " | Pressed enter in a text field. name, value = " + name + ", " + value);
		if (name == 'browser-bar' && typeof game.active_browser !== 'undefined') {
			// got to change browser
			changeBrowserWebPage(game.browsers[game.active_browser], value);
		} else {
			writeToServerLog(username + " | Received unhandled text-field-enter event with name, value = " + name + ", " + value);
		}
	});

	socket.on('animation-ended', function (name) {
		writeToServerLog(username + " | Received animation ended event: " + name);
		if (introduction_on_gif_ended(name, showDialog, changeMainScreen)) {
			return;
		} else {
			writeToServerLog(username + " | Received unhandled animated-GIF-ended event with name = " + name);
		}
	});

	socket.on('hard-reset', function () {
		writeToServerLog(username + " | Performed a save file reset.");
		makeNewGame();
		sendClientInitCommands();
	});
});
