var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var SERVER_PORT = 8011;

// Include modules here.
eval(fs.readFileSync(__dirname + '/coffee_shop.js').toString());
eval(fs.readFileSync(__dirname + '/mall_scene.js').toString());
eval(fs.readFileSync(__dirname + '/library.js').toString());
eval(fs.readFileSync(__dirname + '/apartment.js').toString());
eval(fs.readFileSync(__dirname + '/introduction.js').toString());

app.listen(SERVER_PORT);
console.log("CyberEDU server firing up on port " + SERVER_PORT);

function handler (request, response) {
	console.log("HTTP request received for " + request.url);
	if (request.url == "/") {
		fs.readFile(__dirname + '/index.html', function (err, data) {
			if (err) {
				response.writeHead(500);
				response.end("Error loading index.html");
			} else {
				response.writeHead(200);
				response.end(data);
			}
		});
	} else {
		fs.readFile(__dirname + request.url, function (err, data) {
			if (err) {
				response.writeHead(500);
				response.end("Error loading " + request.url);
			} else {
				response.writeHead(200);
				response.end(data);
			}
		});
	}
}

/* Constructors */

/* Although it is possible in JavaScript to define classes (objects with methods), I
 * avoid doing so here because functions cannot be saved in JSON format.
 * Therefore, functions are defined separately from the objects, and take the objects as arguments.
 */

/* An invisible, rectangular button. Optionally may have associated text.
 * The first five arguments (name through y2) are required.
 * The last four (text through layer) are optional, but if text is provided, all must be provided.
 *
 * This constructor is also used to build text input fields. In that case, all input arguments are required.
 */
var Button = function (name, x1, y1, x2, y2, text, font, font_color, layer) {
	if (typeof text !== 'undefined' && (typeof font === 'undefined' || typeof font_color === 'undefined' || typeof layer === 'undefined'))
		console.log("Illegal call to Button constructor; text provided, but not all optional arguments were provided!");

	this.name = name;
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.text = text;
	this.font = font;
	this.font_color = font_color;
	this.layer = layer;

};

// The image with the specified ID in the client HTML code, drawn at the specified position
var Image = function(id, x, y, layer) {
	this.type = 'image';
	this.id = id;
	this.x = x;
	this.y = y;
	this.layer = layer;
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

/* An internet browser in game. Each device can have its own object, to preserve common sense.
 * The usage of the browser object's screen field is such that it has one element in the extras list, a screen, @ (0, 70), the webpage*/
var Browser = function () {
	this.url = "";
	this.screen = new Screen(0, 0, 0, new Image("image/browser/blank", 0, 0, 0), [new Button("browser-minimize", 679, 24, 705, 48), new Button("browser-x", 764, 24, 789, 48)], [new Button("browser-bar", 32, 18, 668, 49, "", "18px Arial", "rgba(0,0,0,1)", 1)], [BLANK_BROWSER_SCREEN]);
};

/* A dialog box. The canvas object passed in (game.canvas) contains an x and y field to size the box.
 * The name of a dialog box is part of the button names
 * The title is the text appearing at the top of the dialog box.
 * The text is the text appearing within the dialog box.
 * The array of options is the replies available to the user. The click event received when an option is click is dialog_<title>_<option text>
 * The voice argument has type String, and is optional. If specified, the text will be spoken using the Text-to-Speech engine and the specified voice.
 * The usage convention of this object is not to display its screen directly, because the main screen's buttons will still be present under it.
 * It should be displayed via the showDialog() function, which will handle clearing out the underlying buttons, and cleared with the closeDialog() function, which will restore them. */
var Dialog = function (name, title, text, options, voice) {
	this.name = name;
	this.title = title;
	this.text = text;
	this.options = options;
	this.voice = voice;
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
*/
var EmailMessage = function (subject, sender, message, attachments) {
	this.subject = subject;
	this.sender = sender;
	this.message = message;
	this.attachments = attachments;
	this.unread = true;
}

/*  Name: the name of this app
	Icon: 32x32 display element @ position (0,0) in layer 0, for use as the icon of this app.
	Screen_name: The name of the main screen of this app (where the user goes when they start it).
*/
var PhoneApp = function (name, icon, screen_name) {
	this.name = name;
	this.icon = icon;
	this.screen_name = screen_name;
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

/* Pushes the commands needed to draw the display element into the commands argument. */
function drawDisplayObject (element, commands) {
	if (element.type == 'image') {
		commands.push(["drawImage", element.id, element.x, element.y, element.layer]);
	} else if (element.type == 'animation') {
		commands.push(["drawAnimation", element.id, element.x, element.y, element.layer, element.callbackRequested]);
	} else if (element.type == 'text') {
		commands.push(["drawText", element.name, element.x, element.y, element.x2, element.y2, element.layer, element.text, element.font, element.font_color]);
	} else if (element.type == 'rectangle') {
		commands.push(["drawRectangle", element.name, element.x, element.y, element.x2, element.y2, element.layer, element.font_color]);
	} else if (element.type == 'screen') {
		if (element["on_screen"])
			console.log("Warning: display element may have been drawn twice: " + JSON.stringify(element));
		drawDisplayObject(translate(element.base, element.x, element.y, element.layer), commands);

		for (var i = 0; i < element.buttons.length; i++) {
			if (element.buttons[i].text) {
				commands.push(["addButton", element.buttons[i].name, element.buttons[i].x1 + element.x, element.buttons[i].y1 + element.y, element.buttons[i].x2 + element.x, element.buttons[i].y2 + element.y, element.buttons[i].text, element.buttons[i].font, element.buttons[i].font_color, element.layer + element.buttons[i].layer]);
			} else {
				commands.push(["addButton", element.buttons[i].name, element.buttons[i].x1 + element.x, element.buttons[i].y1 + element.y, element.buttons[i].x2 + element.x, element.buttons[i].y2 + element.y]);
			}
		}

		for (var i = 0; i < element.textFields.length; i++) {
			commands.push(["addTextInputField", element.textFields[i].name, element.textFields[i].x1 + element.x, element.textFields[i].y1 + element.y, element.textFields[i].x2 + element.x, element.textFields[i].y2 + element.y, element.textFields[i].text, element.textFields[i].font, element.textFields[i].font_color, element.layer + element.textFields[i].layer]);
		}

		for (var i = 0; i < element.extras.length; i++) {
			drawDisplayObject(translate(element.extras[i], element.x, element.y, element.layer), commands);
		}

		element["on_screen"] = true;
	}
}

/* Pushes the commands needed to clear the specified display element into the commands argument. */
function clearDisplayObject (element, commands) {
	if (element.type == 'image') {
		commands.push(["clearImage", element.id, element.x, element.y, element.layer]);
	} else if (element.type == 'animation') {
		commands.push(["clearAnimation", element.id]);
	} else if (element.type == 'text') {
		commands.push(["clearText", element.name]);
	} else if (element.type == 'rectangle') {
		commands.push(["clearRectangle", element.name]);
	} else if (element.type == 'screen') {
		clearDisplayObject(translate(element.base, element.x, element.y, element.layer), commands);

		for (var i = 0; i < element.buttons.length; i++) {
			commands.push(["deleteButton", element.buttons[i].name]);
		}

		for (var i = 0; i < element.textFields.length; i++) {
			commands.push(["deleteTextInputField", element.textFields[i].name]);
		}

		for (var i = 0; i < element.extras.length; i++) {
			clearDisplayObject(translate(element.extras[i], element.x, element.y, element.layer), commands);
		}

		delete element["on_screen"];
	}
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

/* adds the commands required to add the specified button to commands */
function addButton (button, commands) {
	if (element.text) {
		commands.push(["addButton", button.name, button.x1, button.y1, button.x2, button.y2, button.text, button.font, button.font_color, button.layer]);
	} else {
		commands.push(["addButton", button.name, button.x1, button.y1, button.x2, button.y2]);
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
		dialog.screen.buttons.push(new Button ("dialog_" + dialog.name + "_" + dialog.options[i], canvas.x/4 + i*(canvas.x/2)/dialog.options.length + DIALOG_BUTTON_PADDING, canvas.y * 3/4 - DIALOG_BUTTON_HEIGHT, canvas.x/4 + (i+1)*(canvas.x/2)/dialog.options.length - DIALOG_BUTTON_PADDING, canvas.y * 3/4, dialog.options[i], '16px Verdana', 'rgba(200,200,200,1)', 4));
		dialog.screen.extras.push(new Rectangle ("dialogOptionRectangle" + i, canvas.x/4 + i*(canvas.x/2)/dialog.options.length + DIALOG_BUTTON_PADDING, canvas.y * 3/4 - DIALOG_BUTTON_HEIGHT, canvas.x/4 + (i+1)*(canvas.x/2)/dialog.options.length - DIALOG_BUTTON_PADDING, canvas.y * 3/4, 3, 'rgba(80,80,80,1)'));
	}

	// The display elements of the previous screen will be added to this screen, but the buttons and text fields won't.
	previous_screen = JSON.parse(JSON.stringify(previous_screen)); // I need to modify the object, so I must deep copy it first
	previous_screen.buttons = [];
	previous_screen.textFields = [];
	
	delete previous_screen.on_screen; // This copy isn't actually on the screen. Causes false alarms for repeated draw calls.

	// A possible future upgrade: add whatever text was in the buttons/textFields into the display as standalone text objects.

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
	[new Button("Email_start_button", 0, 0, 173, 30, "Back", "24px Times", "rgba(255,255,255,1)", 1),
		new Button("Email_delete_button_" + mailbox_index, 143, 31, 173, 60, "X", "19px Times", "rgba(255,255,255,1)", 1)
	], [],
	[new Text ("message_screen_sender", 0, 30, 173, 45, 1, "From: " + message.sender, "12px Arial", "rgba(255,255,255,1)"),
		new Text("message_screen_subject", 0, 45, 173, 60, 1, "Subject: " + message.subject, "12px Arial", "rgba(255,255,255,1)"),
		new Text ("message_screen_body", 0, 60, 173, 291, 1, message.message, "11px Times", "rgba(255,255,255,1)")
	]);

	return screen;
}

io.on('connection', function (socket) {
	console.log('connection received');

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
	 *  phone_apps: An array of apps installed on the phone.
	 *  mailbox: An array of email messages; the contents of the player's mailbox.
	 *  mailbox_displayed_index: The index of the first email message actually being displayed on the mailbox page. (Only seventeen messages may appear at once).
	 *  main_screen: The name of the currently active main screen.
	 *  active_browser: The name of the internet browser object that is currently active. Undefined if the browser is not active.
	 *  active_dialog: An object with the following information. Undefined if there is no active dialog box.
	 *		name: The name of the active dialog
	 *		replace_phone: A boolean, true if the phone should be shown when this dialog is closed
	 *  active_filesystem: The name of the active computer filesystem.
	 *  player_name: The name of the player.
	 *  partner_name: The name of the partner.
	 */

	var game = { canvas:{x:1224, y:688}, screens:{}, browsers:{}, dialogs:{}, filesystems:{}, webpages:{}, background_music:{}, phone:{visible:true, raised:true, screen_on:true, screen:"phoneNotYetActivatedScreen"}, phone_apps:[], mailbox:[], mailbox_displayed_index:0, main_screen:"introduction_dorm_room", active_dialog:{name:"introduction_dialog", replace_phone:false}, player_name:"Bobby", partner_name:"Ashley", scenes_loaded:false};
	game.screens["phoneBlankScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [new Button("testButton", 50, 50, 100, 100)], [], [new Rectangle("testRect", 50, 50, 100, 100, 1, "rgba(0,0,0,1)")]);
	game.screens["testMainScreen"] = new Screen(0, 0, 0, new Rectangle("bigRedRectangle", 0, 0, game.canvas.x, game.canvas.y, 0, 'rgba(255,0,0,1)'), [], [], []);
	game.screens["phoneHomeScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);

	// Note that all phone applications should have an exit button; however, may be placed anywhere on the screen, not necessarily at (0,0).
	installPhoneApp(new PhoneApp ("Email", new Image ("image/phone/icon/email", 0, 0, 0), "phoneEmailAppScreen"));
	game.screens["phoneEmailAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
	addButtonToScreen(game.screens["phoneEmailAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, "Exit Email", "24px Times", "rgba(255,255,255,1)", 2));
	addButtonToScreen(game.screens["phoneEmailAppScreen"], new Button("phone-email-scroll-up", 145, 115, 170, 140, "/\\", "24px Times", "rgba(255,255,255,1)", 2));
	addButtonToScreen(game.screens["phoneEmailAppScreen"], new Button("phone-email-scroll-down", 145, 150, 170, 175, "\\/", "24px Times", "rgba(255,255,255,1)", 2));

	// Phone Map application -- add new locations to the game through this.
	installPhoneApp(new PhoneApp ("Map", new Image ("image/phone/icon/map", 0, 0, 0), "phoneMapAppScreen"));
	game.screens["phoneMapAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
	addButtonToScreen(game.screens["phoneMapAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, "Exit Map", "24px Times", "rgba(255,255,255,1)", 2));
	addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_red_screen", 0, 30, 173, 60, "Go to Red Screen", "24px Times", "rgba(255,255,255,1)", 2));
	addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_coffee_shop", 0, 60, 173, 90, "Go to Coffee Shop", "18px Times", "rgba(255,255,255,1)", 2));
	addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_mall", 0,150, 173,180, "Go to Mall", "18px Times", "rgba(255,255,255,1)", 2));
	addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_library", 0, 90, 173, 120, "Go to Library", "18px Times", "rgba(255,255,255,1)", 2));
	addButtonToScreen(game.screens["phoneMapAppScreen"], new Button ("go_to_apartment", 0, 120, 173, 150, "Go to Apartment", "18px Times", "rgba(255,255,255,1)", 2));

	game.browsers["testBrowser"] = new Browser();

	game.dialogs["testDialog"] = new Dialog ("Title", "Title", "Text", ["close", "browser"]);

	game.filesystems["testFilesystem"] = new FileSystem();
	addToFileSystem(game.filesystems["testFilesystem"], "", "test.txt");
	addToFileSystem(game.filesystems["testFilesystem"], "", new Folder ("test_dir", ["a.txt", "b.txt"]));

	addToMailbox(new EmailMessage ("Testing", "Jonathan", "Hello, this is a test of the email system", []));
	addToMailbox(new EmailMessage ("Testing 2", "Jonathan", "", []));
	addToMailbox(new EmailMessage ("Testing 3", "Jonathan", "", []));
	for (var i = 4; i <= 27; i++) {
		addToMailbox(new EmailMessage("Testing " + i, "Jonathan", "", []));
	}

	// Load the introduction scene into the game state object.
	load_introduction (game, PHONE_SCREEN_LAYER);

	// For Testing Purposes {
	// loadScenes();
	// changeMainScreen("testMainScreen");
	// changePhoneScreen("phoneHomeScreen");
	// }

	// Send commands to client, to initialize it to the current game state, which may be loaded or the default.
	var init_commands = [];
	init_commands.push(["resizeCanvas", game.canvas.x, game.canvas.y]);
	if (game.phone.visible) {
		if (game.phone.raised) {
			init_commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, PHONE_LAYER]);
			init_commands.push(["addButton", "lower-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, game.canvas.x, game.canvas.y - PHONE_Y_RAISED + PHONE_Y_LOWERED]);
			init_commands.push(["addButton", "phone-power-button", game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[0], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[1], game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[2], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[3]]);
			if (game.phone.screen_on) {
				// Move the screen to the correct position before drawing it.
				game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
				game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;

				drawDisplayObject(game.screens[game.phone.screen], init_commands);
			} else {
				init_commands.push(["drawImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
			}
		} else {
			init_commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
			init_commands.push(["addButton", "raise-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, game.canvas.x, game.canvas.y]);
		}
	}

	if (typeof game.active_browser !== 'undefined') {
		init_commands.push(["resizeCanvas", 800, 600]);
		drawDisplayObject(game.browsers[game.active_browser].screen, init_commands);
	} else if (typeof game.active_filesystem !== 'undefined') {
		drawDisplayObject(get_current_screen(game.filesystems[game.active_filesystem]), init_commands);
	} else {
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
		drawDisplayObject(game.dialogs[game.active_dialog.name].screen, init_commands);
	}

	if (typeof game.background_music[game.main_screen] !== 'undefined') {
		init_commands.push(["playSound", game.background_music[game.main_screen]]);
	}
	
	socket.emit('command', init_commands);

	/* Loads all the additional scenes into the game object. */
	function loadScenes () {
		load_coffee_shop (game);
		load_mall(game);
		load_library (game, addToFileSystem);
		load_apartment (game);
		load_introduction_part2(game);
		game.scenes_loaded = true;
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
				commands.push(["addButton", "phone-power-button", newX - PHONE_POWER_BUTTON_BOUNDS[0], newY - PHONE_POWER_BUTTON_BOUNDS[1], newX - PHONE_POWER_BUTTON_BOUNDS[2], newY - PHONE_POWER_BUTTON_BOUNDS[3]]);
				commands.push(["deleteButton", "lower-phone-button"]);
				commands.push(["addButton", "lower-phone-button", newX - PHONE_X, newY - PHONE_Y_RAISED, newX, newY - PHONE_Y_RAISED + PHONE_Y_LOWERED]);
				if (game.phone.screen_on) {
					clearDisplayObject(game.screens[game.phone.screen], commands);
					game.screens[game.phone.screen].x = newX - PHONE_SCREEN_X;
					game.screens[game.phone.screen].y = newY - PHONE_SCREEN_Y;
					drawDisplayObject(game.screens[game.phone.screen], commands);
				} else {
					commands.push(["clearImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
					commands.push(["drawImage", "image/phone/screen/off", newX - PHONE_SCREEN_X, newY - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
				}
			} else {
				commands.push(["deleteButton", "raise-phone-button"]);
				commands.push(["addButton", "raise-phone-button", newX - PHONE_X, newY - PHONE_Y_LOWERED, newX, newY]);
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
					clearDisplayObject(game.screens[game.phone.screen], commands);
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
				commands.push(["addButton", "lower-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, game.canvas.x, game.canvas.y - PHONE_Y_RAISED + PHONE_Y_LOWERED]);
				commands.push(["addButton", "phone-power-button", game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[0], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[1], game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[2], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[3]]);
				if (game.phone.screen_on) {
					game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
					game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;
					drawDisplayObject(game.screens[game.phone.screen], commands);
				} else {
					commands.push(["drawImage", "image/phone/screen/off", game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER]);
				}
			} else {
				commands.push(["drawImage", "image/phone", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, PHONE_LAYER]);
				commands.push(["addButton", "raise-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, game.canvas.x, game.canvas.y]);
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
			commands.push(["addButton", "lower-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_RAISED, game.canvas.x, game.canvas.y - PHONE_Y_RAISED + PHONE_Y_LOWERED]);
			commands.push(["addButton", "phone-power-button", game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[0], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[1], game.canvas.x - PHONE_POWER_BUTTON_BOUNDS[2], game.canvas.y - PHONE_POWER_BUTTON_BOUNDS[3]]);
			if (game.phone.screen_on) {
				game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
				game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;
				drawDisplayObject(game.screens[game.phone.screen], commands);
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
			commands.push(["addButton", "raise-phone-button", game.canvas.x - PHONE_X, game.canvas.y - PHONE_Y_LOWERED, game.canvas.x, game.canvas.y]);
			commands.push(["deleteButton", "phone-power-button"]);
			if (game.phone.screen_on) {
				clearDisplayObject(game.screens[game.phone.screen], commands);
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
			game.screens[game.phone.screen].x = game.canvas.x - PHONE_SCREEN_X;
			game.screens[game.phone.screen].y = game.canvas.y - PHONE_SCREEN_Y;
			drawDisplayObject(game.screens[game.phone.screen], commands);
		}

		game.phone.screen_on = true;
		socket.emit('command', commands);
	}

	/* Powers off the phone screen, if it is on */
	function phoneScreenOff () {
		var commands = [];

		if (game.phone.visible && game.phone.raised && game.phone.screen_on) {
			clearDisplayObject(game.screens[game.phone.screen], commands);
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
			console.log("Warning: displayBrowser( " + name + ") was called when there was already an active browser, which was " + game.active_browser);
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

		if (browser.screen.extras.length != 1) console.log("Warning: browser object invariants violated: not exactly one extra screen!");

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
		folder.screen = new Screen(0, 0, 0, new Image("image/filesystem/blank", 0, 0, 0), [new Button("filesystem_exit", 1180, 0, 1280, 100, "Exit", "24px Times", "rgba(0,0,0,1)", 1), new Button("filesystem_up", 1130, 0, 1170, 100, "Up", "24px Times", "rgba(0,0,0,1)", 1)], [], [new Text("filesystem_path_bar", 0, 0, 1120, 100, 1, "C:/" + filesystem.currentDirectory, "24px Times", "rgba(0,0,0,1)")]);

		// Add in the contents
		for (var i = 0; i < folder.contents.length; i++) {
			if (folder.contents[i].type == 'folder') {
				addElementToScreen(folder.screen, new Text("name_text_" + filesystem.currentDirectory + "/" + folder.contents[i].name, 290, 140 + i*40, 1280, 180+i*40, 1, folder.contents[i].name, "24px Times", "rgba(0,0,0,1)"));
				addButtonToScreen(folder.screen, new Button("delete_button_" + filesystem.currentDirectory + "/" + folder.contents[i].name, 1100, 140 + i*40, 1280, 180 + i*40, "Delete?", "24px Times", "rgba(0,0,0,1)", 2));
				addButtonToScreen(folder.screen, new Button("change_directory_button_" + filesystem.currentDirectory + "/" + folder.contents[i].name, 290, 140 + i*40, 1000, 180 + i*40));
			} else {
				addElementToScreen(folder.screen, new Text("name_text_" + filesystem.currentDirectory + "/" + folder.contents[i], 290, 140 + i*40, 1280, 180 + i*40, 1, folder.contents[i], "24px Times", "rgba(0,0,0,1)"));
				addButtonToScreen(folder.screen, new Button("delete_button_" + filesystem.currentDirectory + "/" + folder.contents[i], 1100, 140 + i*40, 1280, 180 + i*40, "Delete?", "24px Times", "rgba(0,0,0,1)", 2));
			}
		}
	}

	function displayFileSystem (name) {
		var commands = [];
		if (typeof game.active_filesystem !== 'undefined') console.log("Warning: displayFileSystem(" + name + ") was called when there was an active filesystem, " + game.active_filesystem);

		if (typeof game.active_dialog !== 'undefined') {
			game.active_dialog.replace_phone = false;
		} else {
			hidePhone();
			clearDisplayObject(game.screens[game.main_screen], commands);
			setup_folder_screen(get_folder(game.filesystems[name], game.filesystems[name].currentDirectory), game.filesystems[name]);
			console.log(JSON.stringify(game));
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
			addButtonToScreen(folder.screen, new Button("delete_button_" + filesystem.currentDirectory + "/" + item_name, 1100, y1, 1280, y2, "Delete?", "24px Times", "rgba(0,0,0,1)", 2));
			if (item.type == 'folder')
				addButtonToScreen(folder.screen, new Button("change_directory_button_" + filesystem.currentDirectory + "/" + item_name, 290, y1, 1000, y2));
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

	/* Adds the specified message to the player's inbox */
	function addToMailbox (message) {
		var email_no = game.mailbox.length;
		game.mailbox.push(message);
		if (0 <= email_no - game.mailbox_displayed_index && email_no - game.mailbox_displayed_index < MAX_DISPLAYED_MAILBOX_ENTRIES) {
			var x = 0;
			var y = yPositionOfEmailNo(email_no);
			var message_screen = createMessageScreen(email_no);
			addElementToScreen(game.screens["phoneEmailAppScreen"], message_screen);
		}

	}

	/* Deletes the item in the player's mailbox at the specified index */
	function removeFromMailbox (email_no) {
		var y = yPositionOfEmailNo(email_no);

		// Removal of the display elements is not necessary if the email being deleted is below the screen, but it is necessary if the item being deleted is above the screen.
		if (email_no - game.mailbox_displayed_index < MAX_DISPLAYED_MAILBOX_ENTRIES) {
			for (var i = 0; i < game.screens["phoneEmailAppScreen"].extras.length; i++) {
				if (game.screens["phoneEmailAppScreen"].extras[i].type == 'screen' && game.screens["phoneEmailAppScreen"].extras[i].base.type == 'rectangle' && game.screens["phoneEmailAppScreen"].extras[i].base.name.match(/inbox_\d+_background/) != null && game.screens["phoneEmailAppScreen"].extras[i].y >= y) {
					removeElementFromScreen(game.screens["phoneEmailAppScreen"], game.screens["phoneEmailAppScreen"].extras[i]);
					i--; // Must decrement i because something was removed!
				}
			}
		}

		game.mailbox.splice(email_no, 1);
		for (var i = email_no; i < game.mailbox.length; i++) {
			// Only add elements that shall fit on the screen.
			if (0 <= i - game.mailbox_displayed_index && i - game.mailbox_displayed_index < MAX_DISPLAYED_MAILBOX_ENTRIES) {
				var message_screen = createMessageScreen(i);
				addElementToScreen(game.screens["phoneEmailAppScreen"], message_screen);
			}
		}

		// Scroll up one if all the messages on the screen were deleted.
		if (game.mailbox_displayed_index >= game.mailbox.length && game.mailbox_displayed_index > 0)
			changeMailboxScrollPosition(game.mailbox_displayed_index - 1);
	}

	/* Marks the item in the player's mailbox at the specified index as read */
	function markAsRead (email_no) {
		if (game.mailbox[email_no].unread) {
			game.mailbox[email_no].unread = false;

			// Check if the message being marked is actually on the screen
			if (0 <= email_no - game.mailbox_displayed_index && email_no - game.mailbox_displayed_index < MAX_DISPLAYED_MAILBOX_ENTRIES) {
				for (var i = 0; i < game.screens["phoneEmailAppScreen"].extras.length; i++) {
					if (game.screens["phoneEmailAppScreen"].extras[i].type == 'screen' && game.screens["phoneEmailAppScreen"].extras[i].base.type == 'rectangle' && game.screens["phoneEmailAppScreen"].extras[i].base.name == "inbox_" + email_no + "_background") {
						// Remove and re-add the screen with the background changed.
						removeElementFromScreen(game.screens["phoneEmailAppScreen"], game.screens["phoneEmailAppScreen"].extras[i]);
						var message_screen = createMessageScreen(email_no);
						addElementToScreen(game.screens["phoneEmailAppScreen"], message_screen);
						break;
					}
				}
			}
		}
	}

	function changeMailboxScrollPosition (newPosition) {
		// Need to remove all email inbox items from the screen
		for (var i = 0; i < game.screens["phoneEmailAppScreen"].extras.length; i++) {
			if (game.screens["phoneEmailAppScreen"].extras[i].type == 'screen' && game.screens["phoneEmailAppScreen"].extras[i].base.type == 'rectangle' && game.screens["phoneEmailAppScreen"].extras[i].base.name.match(/inbox_\d+_background/) != null) {
				removeElementFromScreen(game.screens["phoneEmailAppScreen"], game.screens["phoneEmailAppScreen"].extras[i]);
				i--;
			}
		}

		game.mailbox_displayed_index = newPosition;
		// Now add back the email inbox items that are actually on the screen.
		for (var i = newPosition; i < newPosition + MAX_DISPLAYED_MAILBOX_ENTRIES && i < game.mailbox.length; i++) {
			var message_screen = createMessageScreen(i);
			addElementToScreen(game.screens["phoneEmailAppScreen"], message_screen);
		}
	}

	// Helper function which returns the y-position of an email_no
	function yPositionOfEmailNo (email_no) {
		return 30 + (email_no - game.mailbox_displayed_index) * 15;
	}

	// Helper function which creates a message screen for a given message
	function createMessageScreen (email_no) {
		var message = game.mailbox[email_no];
		var message_screen = new Screen (0, yPositionOfEmailNo(email_no), 1, new Rectangle("inbox_" + email_no + "_background", 0, 0, 143, 15, 0, "rgba(255,255,255," + (message.unread ? 1 : 0.2) + ")"),
			/*Buttons */[new Button("inbox_" + email_no + "_button", 0, 0, 143, 14)], [],
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
		} else if (typeof game.active_filesystem !== 'undefined') {
			setup_dialog_screen(game.dialogs[dialog_name], game.canvas, get_current_screen(game.filesystems[game.active_filesystem]));
		} else {
			setup_dialog_screen(game.dialogs[dialog_name], game.canvas, game.screens[game.main_screen]);
		}

		// Known issue: if an animated GIF is on the screen, it will be cleared, redrawn, and re-loaded, causing the dialog to disappear.
		clearDisplayObject(game.screens[game.main_screen], commands);
		drawDisplayObject(game.dialogs[dialog_name].screen, commands);

		if (typeof game.dialogs[dialog_name].voice !== 'undefined') {
			commands.push(['speakText', game.dialogs[dialog_name].text, game.dialogs[dialog_name].voice]);
		}
		socket.emit('command', commands);
	}

	/* Closes the currently active dialog */
	function closeDialog() {
		var commands = [];

		clearDisplayObject(game.dialogs[game.active_dialog.name].screen, commands);
		commands.push(["stopSpeakingText"]);
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

		if (game.phone.visible && game.phone.raised && game.phone.screen_on) {
			clearDisplayObject(game.screens[game.phone.screen], commands);
			drawDisplayObject(game.screens[name], commands);
		}

		game.phone.screen = name;
		socket.emit('command', commands);
	}

	function installPhoneApp (app) {
		var app_no = game.phone_apps.length;
		var x = 35*(app_no % 4);
		var y = 35*Math.floor(app_no / 4);

		addElementToScreen(game.screens["phoneHomeScreen"], new Screen (x, y, 1, app.icon, [new Button (app.name + "_start_button", 0, 0, 32, 32)], [], [])); // An event to handle this button clicked is handled already.
		game.phone_apps.push(app);
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
			drawDisplayObject(translate(element, screen.x, screen.y, screen.layer), commands);
		}

		screen.extras.push(element);
		socket.emit('command', commands);
	}

	/* Removes an element from the extras array of a screen.
	 * If the screen is currently visible, it is redrawn */
	function removeElementFromScreen (screen, element) {
		var commands = [];
		if (screen["on_screen"]) {
			clearDisplayObject(translate(element, screen.x, screen.y, screen.layer), commands);
		}

		var removeCount = 0;
		for (var i = 0; i < screen.extras.length; i++) {
			if (screen.extras[i] == element) {
				screen.extras.splice(i, 1);
				removeCount++;
			}
		}
		if (removeCount != 1) console.log("Warning, removeElementFromScreen removed " + removeCount + " elements. Arguments: screen = " + screen + " element = " + element);
		socket.emit('command', commands);
	}

	 /* Adds a button to a screen.
	  * If the screen is currently visible, the button will be made visible to the user immediately */
	function addButtonToScreen (screen, button) {
		var commands = [];
		if (screen["on_screen"]) {
			if (button.text) {
				commands.push(["addButton", button.name, screen.x + button.x1, screen.y + button.y1, screen.x + button.x2, screen.y + button.y2, button.text, button.font, button.font_color, button.layer]);
			} else {
				commands.push(["addButton", button.name, screen.x + button.x1, screen.y + button.y1, screen.x + button.x2, screen.y + button.y2]);
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

		if (removeCount != 1) console.log("Warning, call to removeButtonFromScreen removed " + removeCount + " buttons. Arguments were screen = " + screen + "button = " + button);
		socket.emit('command', commands);
	}

	/* Adds a text input field to the screen.
	 * If the screen is currently visible, the change is reflected immediately */
	function addTextInputFieldToScreen (screen, field) {
		var commands = [];
		if (screen["on_screen"]) {
			commands.push(["addTextInputField", field.name, screen.x + field.x1, screen.y + field.y1, screen.x + field.x2, screen.y + field.y2, field.text, field.font, field.font_color, field.layer]);
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

		if (removeCount != 1) console.log("Warning, call to removeTextInputFieldFromScreen removed " + removeCount + " fields. Arguments were screen = " + screen + "field = " + field);
		socket.emit('command', commands);
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

	socket.on('click', function (button) {
		// Verify that the clicked button is actually on the screen.
		if (typeof button === 'undefined') {
			console.log ("Received invalid click event -- no button argument");
			return;
		} else {
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
						if (game.phone.screen_on && verifyScreen(game.screens[game.phone.screen], button))
							valid = true;
					} else {
						if (button == 'raise-phone-button')
							valid = true;
					}
				}
			}

			if (!valid) {
				console.log("Received invalid click event -- the button \"" + button + "\" could not be found.");
				return;
			}
		}		
		
		// Handle events in the modules, but only if they are loaded
		if (game.scenes_loaded) {
			if (coffee_shop_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, game.coffee_shop_variables)) {
				return;
			} else if(mall_scene_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, game.mall_scene_variables)) {
				return;
			}
			if (library_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, displayFileSystem, closeFileSystem, existsInFileSystem, game.library_variables, game.screens["library_success"].extras[1])) {
				return;
			}

			if (apartment_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, game.apartment_variables, game.browsers["rout"], displayBrowser, closeBrowser, changeBrowserWebPage, game.screens["apartment_success"].extras[1])) {
				return;
			}

		}

		if (introduction_onclick(button, changeMainScreen, showDialog, closeDialog, displayBrowser, changeBrowserWebPage, closeBrowser, changePhoneScreen, resizeCanvas, loadScenes, game.browsers["introduction_computer_browser"], game.introduction_variables)) {
			return;
		}

		for (var i = 0; i < game.phone_apps.length; i++) {
			if (button == game.phone_apps[i].name + "_start_button") {
				changePhoneScreen(game.phone_apps[i].screen_name);
				return;
			}
		}
		for (var i = 0; i < game.mailbox.length; i++) {
			if (button == "inbox_" + i + "_button") {
				// Setup phoneEmailMessageScreen
				game.screens["phoneEmailMessageScreen"] = email_message_screen(game.mailbox[i], i, game.canvas);
				changePhoneScreen("phoneEmailMessageScreen");
				markAsRead(i);
				return;
			}
		}
		for (var i = 0; i < game.mailbox.length; i++) {
			if (button == "Email_delete_button_" + i) {
				removeFromMailbox(i);
				if (game.phone.screen == "phoneEmailMessageScreen")
					changePhoneScreen("phoneEmailAppScreen");
				return;
			}
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
			closeBrowser(false);
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
			//Handled in library.js file.
		} else if (button == 'go_to_apartment') {
			//Handled in apartment.js file.
		} else if (button == 'phone-exit-app') {
			changePhoneScreen("phoneHomeScreen");
		} else if (button == 'phone-email-scroll-up') {
			if (game.mailbox_displayed_index > 0)
				changeMailboxScrollPosition(game.mailbox_displayed_index - 1);
		} else if (button == 'phone-email-scroll-down') {
			if (game.mailbox_displayed_index < game.mailbox.length - 1)
				changeMailboxScrollPosition(game.mailbox_displayed_index + 1);
		} else if (button == 'go_to_mall') {
			changeMainScreen("mall_scene")
		} else {
			console.log('Received unhandled click event: ' + button);
		}
	});

	socket.on('text-field-edit', function(name, value) {
		if (introduction_text_field_edit (name, value, game)) {
			return;
		} else if (name == 'browser-bar' && typeof game.active_browser !== 'undefined') {
			for (var i = 0; i < game.browsers[game.active_browser].screen.textFields.length; i++) {
				if (game.browsers[game.active_browser].screen.textFields[i].name == name)
					game.browsers[game.active_browser].screen.textFields[i].text = value;
			}
		} else {
			console.log("Received unhandled text-field-edit event with name, value = " + name + ", " + value);
		}
	});

	socket.on('text-field-enter', function (name, value) {
		if (name == 'browser-bar' && typeof game.active_browser !== 'undefined') {
			// got to change browser
			changeBrowserWebPage(game.browsers[game.active_browser], value);
		} else {
			console.log("Received unhandled text-field-enter event with name, value = " + name + ", " + value);
		}
	});
	
	socket.on('animation-ended', function (name) {		
		if (introduction_on_gif_ended(name, showDialog, changeMainScreen)) {
			return;
		} else {
			console.log("Received unhandled animated-GIF-ended event with name = " + name);
		}
	});
});
