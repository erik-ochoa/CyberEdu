// Global Variables
var current_scene;
var previous_world_scene;
var worldButtonsEnabled = true;
var diagUp = false;
var MAX_X = 1280;
var MAX_Y = 630;
var dialogue_buttons = [];
var CANVAS_X = CANVAS_ELEMENT.getBoundingClientRect().left;
var CANVAS_Y = CANVAS_ELEMENT.getBoundingClientRect().top;

var inventory_image;
var click_sound;
var phone_state = 1; // -1: Not in player's possession, 0: Hidden, 1: Visible in the corner, 2: Fully extended. Change it with the changePhoneState(int) function, not directly.
var phone_screen = 11; // Image no for phone screen. 11 is blank. To change the phone screen while the phone is active, modify phone_screen directly, then call changePhoneState(2);

// character_name says text in the game, nextFunc is to chain dialogue together.
function say (character_name, text, next) {
	next = typeof next !== 'undefined' ? next : closeDialogue;
	dialogue(character_name, text, [["Okay.", next]]);
}

/* Creates dialogue overlay, delays next action until response has been made.
	Takes:
		character_name: Name of character, displayed at the top right of the diag box in bigger white text.
		text: The text that is displayed. This is the "Dialogue".
		responses: Possible responses to the dialogue Array of arrays. Format is:
					[
						[
							String:Response Description,
							Function: Reponse Action
						]
					]
					If no response is specified, the default response is "Okay."
					which will simply close the dialogue and re-enable world buttons.

*/
function closeDialogue() {
	// Remove all dialogue buttons:
	dialogue_buttons = [];
	// Re-enable world buttons
	worldButtonsEnabled = true;
	diagUp = false;
	// redraw scene.
	var g = CANVAS_ELEMENT.getContext("2d");
	current_scene.draw(g);
//	g.drawImage(inventory_image,0,0);
}

function dialogue(character_name, text, responses) {
	// Setting default responses.
	responses = typeof responses !== 'undefined' ? responses : [["Okay (default).", function () { closeDialogue(); }]];
	var g = CANVAS_ELEMENT.getContext("2d");
	worldButtonsEnabled = false;
	diagUp = true;
	//Redraw current scene.
	current_scene.draw(g); // TODO I'll be honest I do not know how the scoping on this works.
	// Dark gray overlay
	g.fillStyle = "rgba(0,0,0,0.5)";
	g.fillRect(0,0,MAX_X,MAX_Y);
	// fill out rect of diag box.
	g.fillStyle = "rgba(50,50,50,1)";
	var dimX = 600
	var dimY = 400
	// Currentl has a border of pixel size 2. Could make this bigger or smaller, probably a function to do this explicitly.
	g.fillRect(MAX_X/2 - (dimX/2 + 2), MAX_Y/2 - (dimY/2 + 2), dimX + 4, dimY + 4);
	// Fill inner rect of diag box
	g.fillStyle = "rgba(70,70,70,1)";
	g.fillRect(MAX_X/2 - dimX/2, MAX_Y/2 - dimY/2, dimX, dimY);
	
	g.fillStyle = "rgba(255,255,255,1)";
	g.font = "24px Verdana";
	g.fillText(character_name, MAX_X/2 - (dimX/2 - 8), MAX_Y/2 - (dimY/2 - 24));
	g.fillStyle = "rgba(200,200,200,1)";
	g.font = "16px Verdana";
	
	var textWidth = dimX - 16;
	var lineHeight = 20;
	var words = text.split(' ');
	var lines = [["   "]];
	var i = 0;
	
	while (i < words.length) {
		//print(g.measureText(lines[lines.length-1].join(' ') + ' ' + words[i]).width);
		while (g.measureText(lines[lines.length-1].join(' ') + ' ' + words[i]).width < textWidth && i < words.length) {
			lines[lines.length-1].push(words[i]);
			i++;
		}
		// Line has over filled, so add a new line in and continue from there
		lines.push([""]);
	}
	// Write what we have said in the conversation.
	for (var j = 0; j < lines.length; j ++) { 
		g.fillText(lines[j].join(' '), MAX_X/2 - (dimX/2 - 8), MAX_Y/2 - (dimY/2 - 44 - lineHeight*j));
	}
	dialogue_buttons = []; // MAKE SURE DIALOGUE BUTTONS ARE CLEAN.
	// Now load the responses:
	var dialog_buttons_left_edge = MAX_X/2 - dimX/2 + 5;
	var dialog_buttons_right_edge = MAX_X/2 + dimX/2 - 5;
	var dialog_buttons_width = (dialog_buttons_right_edge - dialog_buttons_left_edge)/responses.length;
	for (var j = 0; j < responses.length; j++) {
		dialogue_buttons[dialogue_buttons.length] = new Button(dialog_buttons_left_edge + dialog_buttons_width*j + 5, 
														   MAX_Y/2 + dimY/2 - 110,
														   dialog_buttons_left_edge + dialog_buttons_width*(j+1) - 5, 
														   MAX_Y/2 + dimY/2 - 10,
														   responses[j][1]);
		g.fillStyle = "rgba(80,80,80,1)";
		g.fillRect(dialog_buttons_left_edge + dialog_buttons_width*j + 5, MAX_Y/2+dimY/2 - 110, dialog_buttons_width - 10, 100);
		g.fillStyle = "rgba(200,200,200,1)";
		g.font = "16px Verdana";
		g.fillText(responses[j][0], dialog_buttons_left_edge + dialog_buttons_width*j + dialog_buttons_width/2 - (g.measureText(responses[j][0]).width/2), MAX_Y/2 + dimY/2 - 50);
	}		   
	
	//Draw GUI overlay.
//	g.drawImage(inventory_image,0,0) 
}

/*********************
Scene Class Definition
**********************/
// Class definition for a scene. A scene is a image and a list of buttons. 	
// Constructor
var Scene = function (img_no) {
	this.img_no = img_no;
	this.buttons = [];
	this.run_after_action = function () { };
};

Scene.prototype.image = function () {
	return img_list[this.img_no];
};

Scene.prototype.addButton = function (button) {
	this.buttons[this.buttons.length] = button;
};

Scene.prototype.setRunAfterAction = function (f) {
	this.run_after_action = f;
};

Scene.prototype.draw = function (g) {
	g.fillStyle = 'rgba(0,0,0,1)';
	g.font = "30px Arial";
	g.fillRect(0, 0, MAX_X, MAX_Y);
	g.drawImage(img_list[this.img_no],0,0);
	if (phone_state == 1) {
		g.drawImage(img_list[10], MAX_X - 200, MAX_Y - 50);
	}
	else if (phone_state == 2) {
		g.drawImage(img_list[10], MAX_X - 200, MAX_Y - 400);
		g.drawImage(img_list[phone_screen], MAX_X - (200-13), MAX_Y - (400-56));
		if (phone_screen == 18)
			drawEmailInbox(g);
	}
	g.font = "11px Arial"; // Switch font to draw phone buttons.
	for (var i = 0; i < persistent_buttons.length; i++) {
		if (persistent_buttons[i].protect_text) {
			astricks = "";
			for (var j = 0; j < persistent_buttons[i].text.length; j++)
				astricks += "*";
			if (activeTextField == persistent_buttons[i])
				astricks += "|";
			g.fillText(astricks,persistent_buttons[i].x1,persistent_buttons[i].y2);
		}
		else {
			text_to_draw = persistent_buttons[i].text;
			if (activeTextField == persistent_buttons[i])
				text_to_draw += "|";
			g.fillText(text_to_draw,persistent_buttons[i].x1,persistent_buttons[i].y2);
		}
	}
	g.font = "30px Arial";
	for (var i = 0; i < this.buttons.length; i++) {
		if (this.buttons[i].protect_text) {
			astricks = "";
			for (var j = 0; j < this.buttons[i].text.length; j++)
				astricks += "*";
			if (activeTextField == this.buttons[i])
				astricks += "|";
			g.fillText(astricks,this.buttons[i].x1,this.buttons[i].y2);
		}
		else {
			text_to_draw = this.buttons[i].text;
			if (activeTextField == this.buttons[i])
				text_to_draw += "|";
			g.fillText(text_to_draw,this.buttons[i].x1,this.buttons[i].y2);
		}
	}
};
// End Scene Class

/**********************
Button Class Definition
***********************/

// Class definition for rectangular button 
// A button must be added to a scene to do anything. 
// Buttons are enabled by default. Disabling a button makes it unclickable until it is enabled again.

// Constructor
var Button = function(topLeftX, topLeftY, bottomRightX, bottomRightY, fun) {
	this.x1 = topLeftX;
	this.y1 = topLeftY;
	this.x2 = bottomRightX;
	this.y2 = bottomRightY;
	this.action = fun;
	this.enabled = true;
	this.text = "";
	this.protect_text = false;
};

// returns true if a point is within the bounds of the button
Button.prototype.isWithinBounds = function(x, y) {
	return (this.enabled && this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
};

// calls the function given as the event for this button
Button.prototype.doAction = function() {
	this.action();
};

Button.prototype.reactToClickAt = function(x, y) {
	if (this.isWithinBounds(x, y)) {
		this.doAction();
		return true;
	}
	return false;
};

Button.prototype.setEnabled = function(b) {
	this.enabled = b;
};
// End Button class

function changePhoneState (new_state) {
	if (new_state == 0 || new_state == -1) {
		phone_down.setEnabled(false);
		phone_up.setEnabled(false);
		phone_home.setEnabled(false);
		phone_internet.setEnabled(false);
		phone_all_programs.setEnabled(false);
		phone_inbox.setEnabled(false);
		phone_back.setEnabled(false);
		phone_email_trash.setEnabled(false);
		phone_email_left_arrow.setEnabled(false);
		phone_email_right_arrow.setEnabled(false);
		for (var i = 0; i < phone_uninstall_buttons.length; i++) {
				phone_uninstall_buttons[i].setEnabled(false);
				phone_uninstall_buttons[i].text = "";
		}	
	}
	else if (new_state == 1) {
		phone_down.setEnabled(false);
		phone_up.setEnabled(true);
		phone_home.setEnabled(false);
		phone_internet.setEnabled(false);
		phone_all_programs.setEnabled(false);
		phone_inbox.setEnabled(false);
		phone_back.setEnabled(false);
		phone_email_trash.setEnabled(false);
		phone_email_left_arrow.setEnabled(false);
		phone_email_right_arrow.setEnabled(false);
		for (var i = 0; i < phone_uninstall_buttons.length; i++) {
				phone_uninstall_buttons[i].setEnabled(false);
				phone_uninstall_buttons[i].text = "";
			}	
		}
	else if (new_state == 2) {
		phone_down.setEnabled(true);
		phone_up.setEnabled(false);
		phone_home.setEnabled(true);		
		if (phone_screen == 12) {
			phone_internet.setEnabled(true);
			phone_all_programs.setEnabled(true);
			phone_inbox.setEnabled(true);
			phone_back.setEnabled(false);
			phone_email_trash.setEnabled(false);
			phone_email_left_arrow.setEnabled(false);
			phone_email_right_arrow.setEnabled(false);
			for (var i = 0; i < phone_uninstall_buttons.length; i++) {
				phone_uninstall_buttons[i].setEnabled(false);
				phone_uninstall_buttons[i].text = "";
			}
		}
		else if (phone_screen == 17) {
			phone_internet.setEnabled(false);
			phone_all_programs.setEnabled(false);
			phone_inbox.setEnabled(false);
			phone_back.setEnabled(true);
			phone_email_trash.setEnabled(false);
			phone_email_left_arrow.setEnabled(false);
			phone_email_right_arrow.setEnabled(false);
			for (var i = 0; i < phone_uninstall_buttons.length; i++) {
				if (i+1 <= phone_software_apps.length) {
					phone_uninstall_buttons[i].setEnabled(true);
					phone_uninstall_buttons[i].text = phone_software_apps[i] + "  Remove?";
				}
				else {
					phone_uninstall_buttons[i].setEnabled(false);
					phone_uninstall_buttons[i].text = "";
				}
			}
		}
		else if (phone_screen == 18) {
			phone_internet.setEnabled(false);
			phone_all_programs.setEnabled(false);
			phone_inbox.setEnabled(false);
			phone_back.setEnabled(true);
			if (email_inbox.length > 0)
				phone_email_trash.setEnabled(true);
			if (email_inbox_index != 0)
				phone_email_left_arrow.setEnabled(true);
			if (email_inbox_index < email_inbox.length - 1)
				phone_email_right_arrow.setEnabled(true);
			for (var i = 0; i < phone_uninstall_buttons.length; i++) {
				phone_uninstall_buttons[i].setEnabled(false);
				phone_uninstall_buttons[i].text = "";
			}		
		}
		else {
			phone_internet.setEnabled(false);
			phone_all_programs.setEnabled(false);
			phone_inbox.setEnabled(false);
			phone_back.setEnabled(false);
			phone_email_trash.setEnabled(false);
			phone_email_left_arrow.setEnabled(false);
			phone_email_right_arrow.setEnabled(false);
			for (var i = 0; i < phone_uninstall_buttons.length; i++) {
				phone_uninstall_buttons[i].setEnabled(false);
				phone_uninstall_buttons[i].text = "";
			}
		}
	}
	phone_state = new_state;
	var g = CANVAS_ELEMENT.getContext('2d');
	current_scene.draw(g);
}

var phone_software_installed = false;
var phone_software_apps = [];
var email_inbox = [];
var email_inbox_index = 0;

var phone_down = new Button (MAX_X - 200, MAX_Y - 400, MAX_X, MAX_Y - 350, function () {
	phone_screen = 11;
	changePhoneState(1);
});
if (phone_state != 2) {
	phone_down.setEnabled(false);
}

var phone_up = new Button (MAX_X - 200, MAX_Y - 50, MAX_X, MAX_Y, function () {
	changePhoneState(2);
	phone_up("phone_up");
});
if (phone_state != 1) {
	phone_up.setEnabled(false);
}

var phone_home = new Button (MAX_X - (200-80), MAX_Y - (400-355), MAX_X - (200-120), MAX_Y - (400-390), function () {
	if (phone_software_installed)
		phone_screen = 12;
	else
		phone_screen = 13;
	changePhoneState(2);
});
if (phone_state != 2) {
	phone_home.setEnabled(false);
}

var phone_internet = new Button (1205, 515, 1266, 577, function () {
	changePhoneState(0);
	changeScene(web_browser);
});
if (phone_state != 2 || phone_screen != 12) {
	phone_internet.setEnabled(false);
}
var phone_all_programs = new Button (1087, 535, 1130, 577, function () {
	phone_screen = 17;
	changePhoneState(2);
});
if (phone_state != 2 || phone_screen != 12) {
	phone_all_programs.setEnabled(false);
}

var phone_inbox = new Button (1151, 544, 1183, 577, function () {
	phone_screen = 18;
	changePhoneState(2);
});
if (phone_state != 2 || phone_screen != 12) {
	phone_inbox.setEnabled(false);
}

var phone_back = new Button (1093, 285, 1145, 330, function () {
	phone_screen = 12;
	changePhoneState(2);
});
if (phone_state != 2 || (phone_screen != 17 && phone_screen != 18)) {
	phone_back.setEnabled(false);
}

var NUM_PHONE_UNINSTALL_BUTTONS = 3;
var phone_uninstall_buttons = [];
for (var i = 0; i < NUM_PHONE_UNINSTALL_BUTTONS; i++) {
	phone_uninstall_buttons[i] = new Button(1093, 340+30*i, 1265, 360+30*i, function () {
		/* Scoping behavior: i within this block is equal to NUM_PHONE_UNINSTALL_BUTTONS, except within
			the for loop (var i = 0; ...) */
		var temp = [];
		var index_of_self;
		for (var i = 0; i < phone_uninstall_buttons.length; i++)
			if (phone_uninstall_buttons[i] == this)
				index_of_self = i;
		for (var j = 0; j < phone_software_apps.length; j++)
			if (j != index_of_self)
				temp[temp.length] = phone_software_apps[j];
		phone_software_apps = temp;
		changePhoneState(2);
	});
	phone_uninstall_buttons[i].setEnabled(false);
}

var phone_email_trash = new Button(1153, 528, 1204, 577, function () {
	var temp = []
	for (var i = 0; i < email_inbox.length; i++)
		if (i != email_inbox_index)
			temp[temp.length] = email_inbox[i];
	email_inbox = temp;
	if (email_inbox.length == 0) {
		email_inbox_index = 0;
		phone_email_trash.setEnabled(false);
	}
	else if (email_inbox_index >= email_inbox.length)
		email_inbox_index = email_inbox_index - 1;
	if (email_inbox_index == 0)
		phone_email_left_arrow.setEnabled(false);
	if (email_inbox_index  == email_inbox.length - 1)
		phone_email_right_arrow.setEnabled(false);
	var g = CANVAS_ELEMENT.getContext("2d");
	current_scene.draw(g);
});

var phone_email_left_arrow = new Button(1093, 541, 1148, 577, function () {
	email_inbox_index = email_inbox_index - 1;
	if (email_inbox_index == 0)
		phone_email_left_arrow.setEnabled(false);
	if (email_inbox_index < email_inbox.length - 1)
		phone_email_right_arrow.setEnabled(true);
	var g = CANVAS_ELEMENT.getContext("2d");
	current_scene.draw(g);

});

var phone_email_right_arrow = new Button(1208, 541, 1269, 577, function () {
	email_inbox_index = email_inbox_index + 1;
	phone_email_left_arrow.setEnabled(true);
	if (email_inbox_index == email_inbox.length -1)
		phone_email_right_arrow.setEnabled(false);
	var g = CANVAS_ELEMENT.getContext("2d");
	current_scene.draw(g);
});
if (phone_state != 2 || phone_screen != 18) {
	phone_email_trash.setEnabled(false);
	phone_email_left_arrow.setEnabled(false);
	phone_email_right_arrow.setEnabled(false);
}

function addToInbox(subject, body, sender, attachments) {
	email_inbox[email_inbox.length] = { subject:subject, body:body, sender:sender, attachments:attachments };
	if (email_inbox_index < email_inbox.length - 1 && phone_state == 2 && phone_screen == 18)
		email_inbox_right_arrow.setEnabled(true);
	var g = CANVAS_ELEMENT.getContext("2d");
	if (phone_state == 2 && phone_screen == 18)
		current_scene.draw(g);
}

function drawEmailInbox (g) {
	var hold_font = g.font;
	g.font = "11px Arial"
	if (email_inbox.length > 0) {
		g.fillText("Viewing message " + (email_inbox_index + 1) + " of " + email_inbox.length, 1125, 330);
		var lineHeight = 13;
		g.fillText(email_inbox[email_inbox_index].sender, 1140, 345);
		g.fillText(email_inbox[email_inbox_index].subject, 1154, 364);
		var y = 384;
		for (var i = 0; i < email_inbox[email_inbox_index].attachments.length; i++) {
			g.fillText(email_inbox[email_inbox_index].attachments[i], 1184, y)
			y += lineHeight
		}
		if (y < 400) 
			y = 400;
		var textWidth = 1261 - 1099
		var words = email_inbox[email_inbox_index].body.split(' ');
		var lines = [["   "]];
		var i = 0;
		
		while (i < words.length) {
			//print(g.measureText(lines[lines.length-1].join(' ') + ' ' + words[i]).width);
			while (g.measureText(lines[lines.length-1].join(' ') + ' ' + words[i]).width < textWidth && i < words.length) {
				lines[lines.length-1].push(words[i]);
				i++;
			}
			// Line has over filled, so add a new line in and continue from there
			lines.push([""]);
		}
		for (var j = 0; j < lines.length; j ++) { 
			g.fillText(lines[j].join(' '), 1099, y + lineHeight*j);
		}
			
	} else 
		g.fillText("No messages.", 1125, 330);
	g.font = hold_font;
}

addToInbox("TEST", "TEST TEST a very long line here, trying to test the capability to draw multiple lines with Thomas's code.", "TEST", ["Attach", "Attach2"]);

var activeTextField = null;
var holding_shift = false;

document.onkeydown = function (e) {
	// key code for shift is 16.
	// a-z are 65-90
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 16)
		holding_shift = true;
	//print(key);
	if (activeTextField != null && worldButtonsEnabled) {
		var g = CANVAS_ELEMENT.getContext("2d");
		g.font = "30px Arial";
		if (key >= 65 && key <= 90) {
			if (holding_shift)
				activeTextField.text += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(key-65);
			else
				activeTextField.text += 'abcdefghijklmnopqrstuvwxyz'.charAt(key-65);
			current_scene.draw(g);
		}
		else if (key >= 48 && key <= 57) {
			if (holding_shift)
				activeTextField.text += ')!@#$%^&*('.charAt(key-48);
			else
				activeTextField.text += '0123456789'.charAt(key-48);
			current_scene.draw(g);
		}
		else if (key == 8) {
			// Backspace. Prevent default because default is a shortcut to pressing the back button on the browser.
			e.preventDefault();
			activeTextField.text = activeTextField.text.substring(0, activeTextField.text.length - 1);
			current_scene.draw(g);
		}
		else if (key >= 186 && key <= 191) {
			if (holding_shift)
				activeTextField.text += ':+<_>?'.charAt(key-186);
			else
				activeTextField.text += ';=,-./'.charAt(key-186);
			current_scene.draw(g);
		}
		else if (key == 13) {
			if (activeTextField == browser_bar) {
				if (browser_bar.text == "https://register.cyber.edu/") {
					changeScene(registration_page);
				}
				else if (browser_bar.text == "freephonesoftware.com") {
					changeScene(free_phone_software_web_page);
				}
				else if (browser_bar.text == "hookmyphoneup.net") {
					changeScene(hook_my_phone_up_web_page);
				}
				else if (browser_bar.text == "opensourcephones.org") {
					changeScene(open_source_phones_web_page);
				}
				else {
					changeScene(four_oh_four);
				}
			}
		}
		else if (key == 32) {
			activeTextField.text += " ";
			current_scene.draw(g);
		}
	}
};

document.onkeyup = function (e) {
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 16)
		holding_shift = false;
};

function click_position(event) {
	// Compatibility Code taken from http://www.quirksmode.org/js/events_properties.html
	var e = event || window.event;
	var posx = 0;
	var posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	posx -= CANVAS_X;
	posy -= CANVAS_Y;
	// End compatibility code, posx & posy contain the clicked position
	
	// Clear out the activeTextField, so it resets if you click outside it
	setActiveTextField(null);
	// Cause event(s) to occur based on the location of the mouse click.
	var found = false;
	for (var i = 0; i < persistent_buttons.length; i++) {
		if (!found && persistent_buttons[i].reactToClickAt(posx, posy)) {
			// play click sound for audio
			click_sound.play();
			found = true;	// Must leave the method here because otherwise the changes in the scene will happen immediately, which means that the list of active buttons changes.
							// When that occurs, another button may be clicked before the user saw it, and whether or not that happens is also dependent on the order of buttons in the list.
							// However, cannot just return, because of current_scene.run_after_action() call.
		}
	}
	
	if (!found && worldButtonsEnabled) {
		for (var i = 0; i < current_scene.buttons.length; i++) {
			if (!found && current_scene.buttons[i].reactToClickAt(posx, posy)) {
				click_sound.play();
				found = true;
			}
		}
	}
	
	if (!found) {
		for (var i = 0; i < dialogue_buttons.length; i++) {
			if (!found && dialogue_buttons[i].reactToClickAt(posx, posy)){
				// play click sound for audio
				click_sound.play();
				found = true;
			}

		}
	}
	if (worldButtonsEnabled)
		current_scene.run_after_action();
}

function rollover_position(event) {
	// Compatibility Code taken from http://www.quirksmode.org/js/events_properties.html
	var e = event || window.event;
	var posx = 0;
	var posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	posx -= CANVAS_X;
	posy -= CANVAS_Y;
	// End compatibility code, posx & posy contain the clicked position
	
	document.getElementById("text").innerHTML = "(" + posx + ", " + posy + ")";
	
	var found = false;
	// Display rollover for the world interactions, if flag for worldButtons are enabled.
	if (worldButtonsEnabled) {
		for (var i = 0; i < current_scene.buttons.length; i++) {
			if (current_scene.buttons[i].isWithinBounds(posx, posy)) {
				found = true;
			}
		}
	}
	
	// Handle rollover for GUI elements
	for (var i = 0; i < persistent_buttons.length; i++) {
		if (persistent_buttons[i].isWithinBounds(posx, posy)) {
			found = true;
		}
	}
	
	// Handle rollover for any dialogue buttons displayed on the screen.
	for (var i = 0; i < dialogue_buttons.length; i++) {
		if (dialogue_buttons[i].isWithinBounds(posx, posy)) {
			found = true;
		}
	}
	
	
	if (found)
		CANVAS_ELEMENT.style.cursor = "pointer";
	else
		CANVAS_ELEMENT.style.cursor = "auto";
}

function changeScene(new_scene) {
	if (current_scene && (current_scene.img_no <= 6 || current_scene.img_no >= 19)) {
		previous_world_scene = current_scene;
	}
	current_scene = new_scene;
	var g = CANVAS_ELEMENT.getContext("2d");
	current_scene.draw(g);
//	g.drawImage(inventory_image,0,0); 
	current_scene.run_after_action();
}

function setActiveTextField(aButton) {
	var g = CANVAS_ELEMENT.getContext("2d");
	activeTextField = aButton;
	current_scene.draw(g);
}

// A list of buttons that exist in multiple scenes, such as the inventory buttons.
var persistent_buttons = [];

persistent_buttons[persistent_buttons.length] = phone_down;
persistent_buttons[persistent_buttons.length] = phone_up;
persistent_buttons[persistent_buttons.length] = phone_home;
persistent_buttons[persistent_buttons.length] = phone_internet;
persistent_buttons[persistent_buttons.length] = phone_all_programs;
persistent_buttons[persistent_buttons.length] = phone_inbox;
persistent_buttons[persistent_buttons.length] = phone_back;

for (var i = 0; i < phone_uninstall_buttons.length; i++) {
	persistent_buttons[persistent_buttons.length] = phone_uninstall_buttons[i];
}

persistent_buttons[persistent_buttons.length] = phone_email_trash;
persistent_buttons[persistent_buttons.length] = phone_email_left_arrow;
persistent_buttons[persistent_buttons.length] = phone_email_right_arrow;

/*persistent_buttons[persistent_buttons.length] = 
	new Button(77,557, 122, 602, function() { print("Inventory slot one pressed."); }) 
persistent_buttons[persistent_buttons.length] = 
	new Button(137,557, 182, 602, function() { print("Inventory slot two pressed."); })
persistent_buttons[persistent_buttons.length] = 
	new Button(197,557, 242, 602, function() { print("Inventory slot three pressed."); })
persistent_buttons[persistent_buttons.length] = 
	new Button(257,557, 302, 602, function() { print("Inventory slot four pressed."); })
*/
var player_name = "Bobby";
var partner_name = "Ashley";

addToInbox("Testing", "Hey, does this work?", player_name, []);
addToInbox("Hello", "Hey, its your partner", partner_name, []);

// Declaring the various scenes in the game
var coffee_shop = new Scene (0);
var spoken_to_witness1 = false;
var spoken_to_witness2 = false;
var spoken_to_witness3 = false;
var spoken_to_tophat = false;
var spoken_to_suspect1 = false;
var spoken_to_suspect2 = false;
var spoken_to_culprit = false;
var spoken_to_all_witnesses = false;
var spoken_to_all_suspects = false;
var entry_message_shown = false;
var incorrect_guesses = 0;
var manager = new Button (207, 127, 282, 281, function () { 
	if (spoken_to_all_witnesses && spoken_to_all_suspects) {
		say("Manager", "Do you know who did it?", function () { 
			say("", "Click on the person responsible for these crimes!", closeDialogue());
		});
		suspect1.setEnabled(true);
		suspect2.setEnabled(true);
		culprit.setEnabled(true);
	}
	else {
		say(player_name, "Hello, ma'am. We are the detectives you called for. Do you have any leads?", function() { 
			say("Manager", "The guy in the suit with a top hat, the guy in the light blue shirt in the back corner, and the girl in a red shirt sitting at the counter all reported to me that they had been robbed after leaving " +
				"here.", function () {
				say(partner_name, "Let's go talk to the victims, " + player_name + ".", closeDialogue());
			});
		});
		manager.setEnabled(false);
	}
});
var witness1 = new Button (763, 174, 792, 224, function () { 
	say(player_name, "Good morning. I'm a detective investigating the robberies that have been occurring here. What can you tell me?", function () {
		say("Shorts", "I ordered Halloween decorations for my house online through amazon.com, using a credit card, last week while sitting in this cafe. The tracking on the package said that the decorations had indeed shipped, " +
		"and are in a warehouse in Clarksville, Maryland, and probably will be delivered in one or two days. I used my card once in the grocery store since then, but on my credit card bill I noticed that there was also a charge " +
		"for a laptop battery on it as well. I just found out today and I'll contact the credit card company once the customer service line opens up.", closeDialogue()); 
	});
	spoken_to_witness1 = true; 
	witness1.setEnabled(false); 
});
var witness2 = new Button (884, 207, 919, 230, function () {
	say(player_name, "Hello. I'm a detective investigating the robberies that happened here. Do you have any information that could help me?", function () { 
		say("White Pants", "I was in a hurry coming into work yesterday and did not have time to pay my credit card bill at my house. Since I cannot live without my morning coffee, I came here and paid my bill online. The " +
			"payment was successfully received, but that afternoon, when I went to the ATM to withdraw some cash, I found that my bank account balance, which should have been $342, was 0. I then went to the bank for a statement " +
			"to see if there had been a mistake. The statement showed someone electronically withdrew the $342 I had, and transferred the money to a Capital One bank account.", closeDialogue());
	});
	spoken_to_witness2 = true; 
	witness2.setEnabled(false); 
});
var witness3 = new Button (411, 158, 473, 363, function () {
	say(player_name, "Hello, I'm a detective investigating the robberies here. Do you know anything " +
		"about them?", function () {
		say("Black Shirt", "I have not been robbed. I've never used a computer in here before, so I " +
			"think that the robberies have something to do with people's computers.", closeDialogue());
	});
	spoken_to_witness3 = true;
	witness3.setEnabled(false);
});
var tophat = new Button (622, 238, 694, 310, function () { 
	say(player_name, "Hello, sir. I'm a detective investigating the robberies that happened here. Can you tell me anything about what happened to you?", function () { 
		say("Top Hat", "Two days ago, I was here, browsing the internet on my laptop looking for top hats, because I need one for my role as Abraham Lincoln in the theatre production I am a part of. I purchased one online from" +
			" amazon.com, using a credit card. The purchase itself was not a scam, for the top hat did arrive as promised. I'm wearing it now. I haven't made any other purchases with the card since, so I am pretty sure my card" +
			" information was stolen here. Whoever has my card number used it to purchase a USB mouse. I cancelled that card but I couldn't remove my liability from the mouse purchase.", closeDialogue());
	});
	spoken_to_tophat = true; 
	tophat.setEnabled(false); 
});
var suspect1 = new Button (771, 341, 884, 456, function () { 
	if (spoken_to_all_witnesses && spoken_to_all_suspects) {
		incorrect_guesses++;
		say(player_name, "The man in the red shirt is responsible.", function () {
			say("Manager", "Okay, I'll call the police.", function () {
				say("Police", "Sir, we have reasonable suspicion to believe that you are the one responsible for the recent robberies at this cafe.", function () {
					say("Red Shirt", "Huh? I haven't robbed anyone.", function () {
						say("Police", "This guy's innocent, " + player_name + ". You got the wrong guy.", function () {
							if (incorrect_guesses == 1)
								closeDialogue();
							else
								say("Police", "Man, this " + player_name + " is the worst detective ever!");
						});
					});
				});
			});
		});
		suspect1.setEnabled(false);
	}
	else {
		say(player_name, "Hello, I'm investigating robberies that have been occurring here recently. Have  you heard anything about them?", function () { 
			say("Red shirt", "No, I've never been robbed here. I'm not using the internet. I've come here for inspiration to attempt to start writing a book.", closeDialogue());
		});
		spoken_to_suspect1 = true; 
		suspect1.setEnabled(false); 
	}
});
var suspect2 = new Button (1199, 213, 1269, 267, function () { 
	if (spoken_to_all_witnesses && spoken_to_all_suspects) {
		incorrect_guesses++;
		say(player_name, "The man in the gray suit is responsible.", function () {
			say("Manager", "Okay, I'll call the police.", function () {
				say("Police", "Sir, we have reasonable suspicion to believe that you are the one responsible for the recent robberies at this cafe.", function () {
					say("Gray Suit", "What! I didn't do it! I swear!", function () {
						say("Police", "Mmm. I don't see anything malicious. I think you got the wrong guy.", function () {
							if (incorrect_guesses == 1)
								closeDialogue();
							else
								say("Police", "Man, this " + player_name + " is the worst detective ever!");
						});
					});
				});
			});
		});
		suspect2.setEnabled(false);
	}
	else {
		say(player_name, "I'm investigating the robberies here. Do you have any information about them?", function () { 
			say("Gray Suit", "I've never been robbed here. I don't come here often. I'm just looking at cat pictures on the internet. Isn't this the cutest cat you ever saw.", function () { 
				say(partner_name, "No. That's an ugly looking cat.", function () { 
					dialogue("Gray Suit", "How dare you! That's the second cutest cat in the world, second to mine! What about you. What do you think?", [
						["It's cute", function () {
							say(player_name, "Yes, it is a pretty cute cat", function () {
								say("Gray Suit", "You've got a good sense for cat cuteness. I'm glad you agree with me.", closeDialogue());
							});
						}],
						["It's ugly", function () {
							say(player_name, "I agree with " + partner_name + ". That cat is ugly", function () {
								say("Gray Suit", "You guys don't know what your talking about when it comes to cats.", closeDialogue());
							});
						}],
						["Unsure", function () { 
							say(player_name, "I don't know. Ask me on another day.", closeDialogue());
						}]
					]);
				});
			});
		});
		spoken_to_suspect2 = true;
		suspect2.setEnabled(false); 
	}
});
var culprit = new Button (972, 293, 1036, 363, function () { 
	if (spoken_to_all_witnesses && spoken_to_all_suspects) {
		say(player_name, "The man in the blue shoes is responsible.", function () { 
			say("Manager", "Okay, I'll call the police.", function () {
				say("Police", "Sir, we have reasonable suspicion to believe that you are the one responsible for the recent robberies at this cafe.", function () {
					say("Blue Shoes", "I swear I'm innocent!", function () {
						say("Police", "Well, the processes running on your PC show otherwise. You're downloading all the traffic from the Wi-Fi onto your computer! You're under arrest for fraud and robbery. You have the " +
							"right to remain silent. Anything you say in court can and will be used against you. You have the right to an attorney. If you cannot afford one, one will be provided for you.", function () {
							say("Manager", "Why'd you do it?", function () {
								say("Blue Shoes", "I was fired two years ago by a Starbucks in Ohio. Since then, I've been wandering the country, and I'm running out of money. It was the only thing I could do.", function () {
									say("Manager", "Thank you for your help, " + player_name + " and " + partner_name + ". With the robber in custody, I'll be able to resume business as usual again. I'll post a notice " +
									"regarding the risk of using my public network for financial transactions. ", function () {
										say("Shorts", "Yeah, thanks guys! I had no idea that wireless network connections could be easily intercepted, even if the website itself is secure. I won't by anything on a public " +
										"network again.", function () {
											say("Manager", "For your help, I am pleased to offer you both a $" + (30-10*incorrect_guesses) + " gift certificate. Please accept it as a token of my thanks.", function () {
												say(partner_name, "Thank you very much, ma'am.", function () {
													say(player_name, "Thanks a lot.", function () {
														closeDialogue();
														socket.emit('scene_complete', { scene: "coffee_shop", score: 30-10*incorrect_guesses });
														changeScene(start);
														goToCoffeeShopButton.setEnabled(false);
														play_video("mfa");
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
		culprit.setEnabled(false);
	}
	else {
		say(player_name, "Hello, sir. I'm working on a case involving robberies at this cafe. Do you know anything pertinent to that matter?", function () { 
			say("Blue Shoes", "No, I don't. I've never been robbed here. I just lost my job in Cincinnati, and I came here. I'm playing Words with Friends while I wait for job application responses.", closeDialogue());
		});
		spoken_to_culprit = true;
		culprit.setEnabled(false); 
	}
});
coffee_shop.setRunAfterAction(function () { 
	if (!entry_message_shown) {
		say(partner_name, "Let's speak to the manager and let her know we are here. She's behind the counter.", function () { 
			entry_message_shown = true; 
			closeDialogue(); 
			// Delaying adding the buttons until after the entry message is shown. This prevents people from skipping it by double clicking 
			// on the "Go to the Coffee Shop button", which triggers the top hat's dialogue, because they are in the same position on the screen.
			coffee_shop.addButton(manager);
			coffee_shop.addButton(witness1);
			coffee_shop.addButton(witness2);
			coffee_shop.addButton(witness3);
			coffee_shop.addButton(tophat);
			coffee_shop.addButton(suspect1);
			coffee_shop.addButton(suspect2);
			coffee_shop.addButton(culprit);
		});
		
	}
	else if (entry_message_shown && !spoken_to_all_witnesses && spoken_to_witness1 && spoken_to_witness2 && spoken_to_tophat && (!spoken_to_suspect1 || !spoken_to_suspect2 || !spoken_to_culprit)) {
		say(partner_name, "Let's interview everyone else in here we haven't yet, they might have information or be the one responsible for these robberies.", closeDialogue());
		spoken_to_all_witnesses = true;
	}
	else if (spoken_to_witness1 && spoken_to_witness2 && spoken_to_tophat && spoken_to_witness3 && spoken_to_suspect1 && spoken_to_suspect2 && spoken_to_culprit && !spoken_to_all_suspects) {
		say(partner_name, "Let's talk to the manager and tell him who did it.", closeDialogue());
		spoken_to_all_witnesses = true;
		spoken_to_all_suspects = true;
		manager.setEnabled(true);
	}
});

var start = new Scene (1);
var goToCoffeeShopButton = new Button (300, 100, 940, 400, function () { changeScene(coffee_shop); });
var goToTheMallButton = new Button (300, 470, 532, 530, function () { changeScene(mall); });
var goToWebBrowser = new Button (600, 470, 832, 530, function () { changeScene(web_browser); });
var goToTheLibrary = new Button (64, 470, 256, 530, function () { changeScene(library); });
goToTheMallButton.text = "Go to the mall";
goToWebBrowser.text = "Go to web browser";
goToTheLibrary.text = "Go to the library";
start.addButton(goToCoffeeShopButton);
start.addButton(goToTheMallButton);
start.addButton(goToWebBrowser);
start.addButton(goToTheLibrary);

var mall = new Scene (3);
var mall_entry_message_shown = false;
var goToFreePhoneSoftware = new Button(696, 320, 793, 414, function () { changeScene(free_phone_software); });
var goToHookMyPhoneUp = new Button (1, 208, 185, 610, function () { changeScene(hook_my_phone_up); });
var goToOpenSourcePhones = new Button (1201, 310, 1269, 500, function () { changeScene (open_source_phones); });
var mall_woman_walking = new Button (600, 341, 632, 452, function () { say("Dark Blue Dress", "Hey, what's up?", closeDialogue()); });
mall.addButton(goToFreePhoneSoftware);
mall.addButton(goToHookMyPhoneUp);
mall.addButton(goToOpenSourcePhones);
mall.addButton(mall_woman_walking);
mall.setRunAfterAction(function () {
	if (!mall_entry_message_shown) {
		mall_entry_message_shown = true;
		say (player_name, "(I just found this phone, but its not working. Maybe I can find what I need in here.)", function () {
			say("Saleman", "COME TO FREEPHONESOFTWARE.COM! A PHONE APPLICATION PROVIDING THE BASIC FUNCTUNALITY YOU NEED, 100% FREE, NO QUESTIONS ASKED!", function () {
				say(player_name, "(That might be what I need)", closeDialogue());
			});
		});
	}
});

var free_phone_software = new Scene (4); 
var install_free_phone_software = new Button (484, 414, 696, 440, function () { browser_bar.text = "freephonesoftware.com"; changeScene(free_phone_software_web_page); changePhoneState(0); });
var exit_free_phone_software = new Button (977, 274, 1051, 518, function () { changeScene(mall); });
var free_phone_software_yellow_backpack = new Button (380, 308, 417, 465, function () { say("Yellow Backpack", "Hi", closeDialogue()); });
var free_phone_software_white_shirt = new Button (742, 282, 801, 450, function () { say("White Shirt", "Hello, how can I help you?", closeDialogue()); });
var free_phone_software_purple_shirt = new Button (893, 300, 950, 484, function () { say("Purple Shirt", "This man's product is a bit too good to be true", closeDialogue()); });
exit_free_phone_software.text = "Back to Mall";
free_phone_software.addButton(install_free_phone_software);
free_phone_software.addButton(exit_free_phone_software);
free_phone_software.addButton(free_phone_software_yellow_backpack);
free_phone_software.addButton(free_phone_software_white_shirt);
free_phone_software.addButton(free_phone_software_purple_shirt); 

var hook_my_phone_up = new Scene (5); 
var exit_hook_my_phone_up = new Button (725, 189, 823, 290, function () { changeScene(mall); });
var install_hook_my_phone_up = new Button (930, 329, 1099, 442, function () { browser_bar.text = "hookmyphoneup.net"; changeScene(hook_my_phone_up_web_page); changePhoneState(0); });
var hook_my_phone_up_green_shirt = new Button (595, 218, 656, 461, function () { say("Green Shirt", "Hello", closeDialogue()); });
var hook_my_phone_up_red_heels = new Button (843, 243, 911, 485, function () { say("Red Heels", "Hello", closeDialogue()); });
var hook_my_phone_up_pink_shirt = new Button (330, 266, 400, 385, function () { say("Magenta Shirt", "Hello", closeDialogue()); });
var hook_my_phone_up_man = new Button (436, 191, 502, 426, function () { say("Bowtie", "Hello", closeDialogue()); });
exit_hook_my_phone_up.text = "Back to Mall";
hook_my_phone_up.addButton(install_hook_my_phone_up);
hook_my_phone_up.addButton(exit_hook_my_phone_up);
hook_my_phone_up.addButton(hook_my_phone_up_green_shirt);
hook_my_phone_up.addButton(hook_my_phone_up_red_heels);
hook_my_phone_up.addButton(hook_my_phone_up_pink_shirt);
hook_my_phone_up.addButton(hook_my_phone_up_man); 

var open_source_phones = new Scene (6); 
var exit_open_source_phones = new Button (500, 600, 600, 630, function () { changeScene(mall); });
var install_open_source_phones = new Button (410, 132, 643, 297, function () { browser_bar.text = "opensourcephones.org"; changeScene(open_source_phones_web_page); changePhoneState(0); });
var open_source_phones_employee = new Button (242, 208, 342, 341, function () { say("Red Tie", "Hello, how can I help you today?", closeDialogue()); });
var open_source_phones_woman = new Button (731, 282, 807, 445, function () { say("Yellow Shirt", "Hello", closeDialogue()); });
var open_source_phones_backpack = new Button (1045, 267, 1138, 486, function () { say("Blue Backpack", "Hi", closeDialogue()); }); 
exit_open_source_phones.text = "Back to Mall";
open_source_phones.addButton(exit_open_source_phones);
open_source_phones.addButton(install_open_source_phones);
open_source_phones.addButton(open_source_phones_employee);
open_source_phones.addButton(open_source_phones_backpack);
open_source_phones.addButton(open_source_phones_woman); 

var web_browser = new Scene(7);
var browser_bar = new Button (189, 20, 931, 61, function () { setActiveTextField(browser_bar); });
var browser_x_button = new Button (1042, 28, 1067, 54, function () { changeScene(previous_world_scene); if (phone_state == 0) changePhoneState(1) });
web_browser.addButton(browser_bar);
web_browser.addButton(browser_x_button);

var registration_page = new Scene(8);
var username_field = new Button (390, 160, 850, 200, function () { setActiveTextField(username_field); });
var password_field = new Button (390, 240, 850, 280, function () { setActiveTextField(password_field); });
password_field.protect_text = true;
// MFA setting choice is for later in the game. The module in the lecture hall where passwords are stolen will result in the player's password being stolen unless they check this box
var mfa_check_box = new Button (667, 305, 703, 338, function () { mfa_check_box.text = (mfa_check_box.text == "x") ? "" : "x"; current_scene.draw(CANVAS_ELEMENT.getContext("2d")); });
var registration_submit = new Button (728, 469, 850, 515, function () {
	if (username_field.text == "" || password_field.text == "") {
		alert("Both a username and a password are required.");
	}
	else {
		// Valid registration, notify server
		socket.emit ('register', { username: username_field.text, password: password_field.text, email: "", mfa: false });
		//socket.emit('register', { username: username_field.text, password: password_field.text, email: email_field.text, mfa: (mfa_check_box.text == "x") });
	}
});
socket.on('register_success', function (info) {
	if (info.success) {
		player_name = username_field.text;
		changeScene(previous_world_scene);
	}
	else
		alert("Unfortunately, the username you entered is already taken.");
});
registration_page.addButton(browser_bar);
registration_page.addButton(browser_x_button);
registration_page.addButton(username_field);
registration_page.addButton(password_field);
registration_page.addButton(mfa_check_box);
registration_page.addButton(registration_submit);

var four_oh_four = new Scene (9);
four_oh_four.addButton(browser_bar);
four_oh_four.addButton(browser_x_button);

var free_phone_software_web_page = new Scene (14);
var phone_virus_downloaded = 0;
var free_phone_software_download_button = new Button (330, 506, 977, 631, function () { 
	changeScene(previous_world_scene); 
	phone_screen = 11; 
	phone_software_installed = false; 
	changePhoneState(2); 
	phone_virus_downloaded = 1;
	say(player_name, "(I don't think that worked... that probably isn't good.)", closeDialogue());
	phone_software_apps[phone_software_apps.length] = "trojan.horse";
});
free_phone_software_web_page.addButton(browser_bar);
free_phone_software_web_page.addButton(browser_x_button);
free_phone_software_web_page.addButton(free_phone_software_download_button);

var hook_my_phone_up_web_page = new Scene (15);
var hook_my_phone_up_download_button = new Button (329, 281, 905, 439, function () { 
	changeScene(previous_world_scene); 
	phone_screen = 12; 
	phone_software_installed = true; 
	changePhoneState(2); 
	say(player_name, "(That looks like it worked... my phone's working now)", function () { closeDialogue(); changeScene(start); });
	socket.emit('scene_complete', { scene: "mall", score: 20 - 10*phone_virus_downloaded });
	if (phone_virus_downloaded < 0.5)
		phone_virus_downloaded = 0.5;
	phone_software_apps[phone_software_apps.length] = "Conduit Search Helper";
	phone_software_apps[phone_software_apps.length] = "24x7x52 Tech Support";
});
hook_my_phone_up_web_page.addButton(browser_bar);
hook_my_phone_up_web_page.addButton(browser_x_button);
hook_my_phone_up_web_page.addButton(hook_my_phone_up_download_button);

var open_source_phones_web_page = new Scene (16);
var open_source_phones_download_button = new Button (329, 281, 905, 439, function () { 
	changeScene(previous_world_scene); 
	phone_screen = 12; 
	phone_software_installed = true; 
	changePhoneState(2); 
	say(player_name, "(That looks like it worked... my phone's working now)", function () { closeDialogue(); changeScene(start); });
	socket.emit('scene_complete', { scene: "mall", score: 30 - 15*phone_virus_downloaded });
});
open_source_phones_web_page.addButton(browser_bar);
open_source_phones_web_page.addButton(browser_x_button);
open_source_phones_web_page.addButton(open_source_phones_download_button);

var library = new Scene (19);
var library_entry_message_shown = false;
var librarian_spoken_to_once = false;
var library_have_flash_drive1 = false;

var librarian_button = new Button (1058, 246, 1224, 415, function () { 
	changeScene(library_librarian);
});
var abandoned_computer_button = new Button (576, 342, 693, 469, function () {
	changeScene(library_abandoned_computer);
});
var student1_button = new Button (722, 342, 845, 461, function () {
	changeScene(library_student1);
}); 
var student2_button = new Button (854, 312, 893, 347, function () {
	changeScene(library_student2);
});
var student3_button = new Button (451, 299, 495, 384, function () {
	changeScene(library_student3);
});
var guy_at_whiteboard = new Button (2, 229, 104, 338, function () {
	say("Striped Shirt", "What's the integral of sin^2 (x)?", closeDialogue());
});
library.addButton(librarian_button);
library.addButton(abandoned_computer_button);
library.addButton(student1_button);
library.addButton(student2_button);
library.addButton(student3_button);
library.addButton(guy_at_whiteboard);
library.setRunAfterAction(function () {
	if (!library_entry_message_shown) {
		say(partner_name, "Why don't we go talk to the librarian? She's sitting at the desk over on the right.", closeDialogue());
		library_entry_message_shown = true;
	}
});

var library_librarian = new Scene (20);
var librarian_dialogue_options = [
	["I don't know yet.", function () {
		say(player_name, "I'm not sure yet.", function () {
			say("Librarian", "Ok, come talk to me if you figure something out.", function () {
				closeDialogue();
				changeScene(library);
			});
		});
	}]
];
var talk_to_librarian = new Button (123, 77, 602, 611, function () {
	if (librarian_spoken_to_once) {
		dialogue("Librarian", "Do you know what's causing the problem?", librarian_dialogue_options);
	}
	else {
		say(partner_name, "Hello ma'am. We're the detectives that you asked to come help. What can you tell us about what is happening?", function () {
			say("Librarian", "Thanks for coming. About a day ago, one of the computers in the computer lab stopped working normally, and instead, " +
							 "It got stuck on some strange website. Since then, it seems like every few hours, another computer is lost to this virus, " +
							 "and I don't know what is causing it or how to remove it. I need you to find the cause, and if you can, show me how to fix " +
							 "one of the computers, if you can find a solution.", function () {
				say(partner_name, "We'll do our best, ma'am.", function () {
					closeDialogue();
					librarian_spoken_to_once = true;
					changeScene(library);
				});
			});
		});
	}
});
library_librarian.addButton(talk_to_librarian);

var library_abandoned_computer = new Scene (21);
var abandoned_computer_temp_browser_bar = "";
var abandoned_computer_temp_browser_bar_enabled = false;
var abandoned_computer_infected = false;
var abandoned_usb =  new Button (248 , 517, 320, 573, function () {
	dialogue("", "It's a red flash drive.", [["Do nothing", function () {
		closeDialogue();
	}], ["Take it.", function () {
		say("", "You take the red flash drive", function () {
			abandoned_usb.setEnabled(false);
			closeDialogue();
			changeScene(library);
		});
	}],
	["Put it in the computer", function () {
		abandoned_computer_infected = true;
		say(partner_name, "I don't think that was good. Take a look at the web browser. It's on some sketchy looking website.", closeDialogue());
	}]]);
});
var abandoned_computer_web_browsers = new Button (540, 61, 658, 167, function () {
	if (abandoned_computer_infected) {
		abandoned_computer_temp_browser_bar = browser_bar.text;
		abandoned_computer_temp_browser_bar_enabled = true;
		browser_bar.text = "freephonesoftware.com"
		changeScene(free_phone_software_web_page);
	}
	else {
		changeScene(web_browser);
	}
});
var abandoned_computer_back_button = new Button(0, 0, 100, 100, function () {
	changeScene(library);
});
abandoned_computer_back_button.text = "Back"
library_abandoned_computer.setRunAfterAction(function () {
	if (abandoned_computer_temp_browser_bar_enabled) {
		browser_bar.text = abandoned_computer_temp_browser_bar; 
		abandoned_computer_temp_browser_bar_enabled = false;
	}
});
library_abandoned_computer.addButton(abandoned_usb);
library_abandoned_computer.addButton(abandoned_computer_web_browsers);
library_abandoned_computer.addButton(abandoned_computer_back_button);

var library_student1 = new Scene (22);
library_student1.setRunAfterAction(function () {
	say(player_name, "Do you have any papers due today?", function () {
		say("Glasses", "No. I'm just here to work on a programming project.", function () {
			say("Glasses", "What?! What the heck?! <Furious Banging on Keyboard>", function () {
				var temp = browser_bar.text;
				browser_bar.text = "freephonesoftware.com";
				changeScene(free_phone_software_web_page);
				say("Glasses", "ARGH! It's totally locked up! I don't have time for this!", function () {
					say(player_name, "What did you do to it?", function () {
						say("Glasses", "All I've done is login in a plugin in a USB drive, someone else must have messed with it", function () {
							say(player_name, "Where did you find it?", function () {
								say("Glasses", "It was right here on the table, in front of the computer.", function () {
									say(partner_name, "Can I have that? It might have caused the virus that just infected your computer. " +
													  "The autorun could be setup to automatically execute malware files.", function () {
										say("Glasses", "Sure, take it. I don't need it.", function () {
											closeDialogue();
											changeScene(library);
											browser_bar.text = temp;
											student1_button.setEnabled(false);
											librarian_dialogue_options[librarian_dialogue_options.length] = ["The USB drive from Glasses.", function () {
												say(player_name, "It's this USB drive. The kid with the glasses plugged it in to his computer and he was redirected to a suspicious website.", function () {
													dialogue("Librarian", "Great! Do you think you can fix or should I call the IT guys?", [
														["Let me fix it!", function () {
															say(player_name, "Sure, I think I can fix it.", function () {
																say("PROGRAMMER", "Under Construction", function () {
																	closeDialogue();
																	changeScene(library);
																});
															});
														}],
														["Call in the IT Professionals", function () {
															say(player_name, "I don't think I can fix it. Get the IT guys to do it.", function () {
																say("Librarian", "Ok, that's fine. Thanks for your help! You've done enough.", function () {
																	closeDialogue();
																	changeScene(start);
																});
															});
														}]
													]);
												});
											}];
											library_have_flash_drive1 = true;
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

var library_student2 = new Scene (23);
library_student2.setRunAfterAction(function () {
	say(player_name, "Do you know if there is anything wrong with this computer?", function () {
		say("Pale Yellow Shirt", "I’m pretty sure it’s working fine. I haven’t had any problems with it yet. I just got here though. I have a paper due tonight and I haven’t started it yet. But if something strange happens while you are here, I’ll let you know.", function () {
			closeDialogue();
			changeScene(library);
			student2_button.setEnabled(false);
		});
	});
});

var library_student3 = new Scene (23);
library_student3.setRunAfterAction(function () {
	say(player_name, "Have you been experiencing any difficulty with these computers?", function () {
		say("Red Shirt", "I don't think so. And I don't have time to check. I've been working all night on this paper! It's due at the start of class, in one hour.", function () {
			say(player_name, "Well hurry up and finish then, so I can check this computer.", function () {
				say("Red Shirt", "Believe me, I am working as fast as I can.", function () {
					closeDialogue();
					changeScene(library);
					student3_button.setEnabled(false);
				});
			});
		});
	});
});

function go () {
	inventory_image = img_list[2];
	click_sound = audio_list[0];
	previous_world_scene = start;
	browser_bar.text = "https://register.cyber.edu/";
	changeScene(registration_page);
}

/* Returns to the game after playing a video (or any action that deleted the canvas) */
function return_to_game () {
	document.getElementById('viewport').innerHTML = HTML_FOR_CANVAS;
	CANVAS_ELEMENT = document.getElementById("view")
	var g = CANVAS_ELEMENT.getContext("2d");
	current_scene.draw(g);
//	g.drawImage(inventory_image,0,0);
	current_scene.run_after_action();
}
