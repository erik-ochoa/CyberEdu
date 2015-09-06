/*********************
Scene Class Definition
**********************/
// Class definition for a scene. A scene is a image and a list of buttons. 	
// Constructor
var Scene = function (img_no) {
	this.img_no = img_no;
	this.buttons = [];
	this.run_after_action = function () { };
	this.object_id = "Scene " + globals.next_object_id;
	globals.next_object_id += 1;
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
	g.fillRect(0, 0, globals.MAX_X, globals.MAX_Y);
	g.drawImage(img_list[this.img_no],0,0);
	if (globals.phone_state == 1) {
		g.drawImage(img_list[10], globals.MAX_X - 200, globals.MAX_Y - 50);
	}
	else if (globals.phone_state == 2) {
		g.drawImage(img_list[10], globals.MAX_X - 200, globals.MAX_Y - 400);
		g.drawImage(img_list[globals.phone_screen], globals.MAX_X - (200-13), globals.MAX_Y - (400-56));
		if (globals.phone_screen == 18)
			drawEmailInbox(g);
	}
	g.font = "11px Arial"; // Switch font to draw phone buttons.
	for (var i = 0; i < globals.persistent_buttons.length; i++) {
		if (globals.persistent_buttons[i].protect_text) {
			astricks = "";
			for (var j = 0; j < globals.persistent_buttons[i].text.length; j++)
				astricks += "*";
			if (globals.activeTextField == globals.persistent_buttons[i])
				astricks += "|";
			g.fillText(astricks,globals.persistent_buttons[i].x1,globals.persistent_buttons[i].y2);
		}
		else {
			text_to_draw = globals.persistent_buttons[i].text;
			if (globals.activeTextField == globals.persistent_buttons[i])
				text_to_draw += "|";
			g.fillText(text_to_draw,globals.persistent_buttons[i].x1,globals.persistent_buttons[i].y2);
		}
	}
	g.font = "30px Arial";
	for (var i = 0; i < this.buttons.length; i++) {
		if (this.buttons[i].protect_text) {
			astricks = "";
			for (var j = 0; j < this.buttons[i].text.length; j++)
				astricks += "*";
			if (globals.activeTextField == this.buttons[i])
				astricks += "|";
			g.fillText(astricks,this.buttons[i].x1,this.buttons[i].y2);
		}
		else {
			text_to_draw = this.buttons[i].text;
			if (globals.activeTextField == this.buttons[i])
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
	this.object_id = "Button " + globals.next_object_id;
	globals.next_object_id += 1;
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
/************
File System Class Defintion
************/
// Class for a computer's file system
// Constructor creates an empty file system.
// Current known issue: Switching to the phone internet browser within the file system screen has a problem switching back to the correct scene.
var FileSystem = function() {
	this.current_directory = "";
	// A file is just an element. A folder is an array, whose first element is the folder name and subsequent are the files.
	this.files = ["Root"];
	this.object_id = "FileSystem " + globals.next_object_id;
	globals.next_object_id += 1;
};

FileSystem.prototype.cd = function (directory) {
	if (directory == "~")
		this.current_directory = "";
	else if (directory == "..") {
		folders = this.current_directory.split('/');
		var newFolders = []
		for (var i = 0; i < folders.length - 1; i++)
			newFolders[i] = folders[i];
		this.current_directory = newFolders.join('/');
	} else {
		var folders = directory.split('/');
		if (folders[0] == "~") {
			search_directory = "";
			new_folders = []
			for (var i = 1; i < folders.length; i++)
				new_folders[new_folders.length] = folders[i];
			folders = new_folders;
		} else {
			search_directory = this.current_directory;
		}
		for (var i = 0; i < folders.length - 1; i++)
			search_directory = (search_directory == "" ? folders[i] : search_directory + '/' + folders[i]);
		if (this.folderExists(search_directory, folders[folders.length - 1])) {
			this.current_directory = (search_directory == "" ? folders[folders.length - 1] : search_directory + '/' + folders[folders.length - 1]);
		}
		else
			print("cd(" + directory + ") failed!");
	}
};

FileSystem.prototype.listCurrentDirectory = function () {
	if (this.current_directory == "") {
		result = [];
		for (var i = 1; i < this.files.length; i++) {
			if (this.isFolder(this.files[i]))
				result[i - 1] = this.files[i][0];
			else
				result[i - 1] = this.files[i];
		}
		return result;
	} else {
		folders = this.current_directory.split('/');
		current = this.files;
		var i = 0;
		var next = 0;
		while (i < folders.length && next != -1) {
			next = -1;
			for (var j = 1; j < current.length; j++) {
				if (this.isFolder(current[j]) && current[j][0] == folders[i])
					next = j;	
			}
			if (next != -1) {
				i++;
				current = current[next];
			}
		}
		if (i == folders.length) {
			result = [];
			for (var j = 1; j < current.length; j++) {
				if (this.isFolder(current[j]))
					result[j - 1] = current[j][0];
				else
					result[j - 1] = current[j];
			}
			return result;
		} else {
			print("ListCurrentDirectory Failed!");
			return ["FATAL ERROR", "Current Directory was invalid", this.current_directory];
		}
	}
};


FileSystem.prototype.folderExists = function (path, name) {
	if (path == "") {
		for (var i = 1; i < this.files.length; i++) {
			if (this.isFolder(this.files[i]) && this.files[i][0] == name)
				return true;
		}
		return false;
	} else {
		var folders = path.split('/');
		var current = this.files;
		var i = 0;
		var next = 0;
		while (i < folders.length && next != -1) {
			next = -1;
			for (var j = 1; j < current.length; j++) {
				if (this.isFolder(current[j]) && current[j][0] == folders[i])
					next = j;	
			}
			if (next != -1) {
				i++;
				current = current[next];
			}
		}
		if (i == folders.length) {
			for (var j = 1; j < current.length; j++)
				if (this.isFolder(current[j]) && current[j][0] == name)
					return true;
			return false;
		} else
			return false;
	}
};

FileSystem.prototype.addFile = function(path, name) {
	if (path == "") {
		this.files[this.files.length] = name;
	} else {
		var folders = path.split('/');
		var current = this.files;
		var i = 0;
		var next = 0;
		while (i < folders.length && next != -1) {
			next = -1;
			for (var j = 1; j < current.length; j++) 
				if (this.isFolder(current[j]) && folders[i] == current[j][0]) 
					next = j;
			if (next != -1) {
				i++;
				current = current[next];
			}
		}
		// If i == folders.length, then the path was traversed successfully
		if (i == folders.length)
			current[current.length] = name;
		else
			print("WARNING: addFile(" + path + ", " + name + ") failed!");
	}
};

FileSystem.prototype.addFolder = function(path, name) {
	if (path == "") {
		this.files[this.files.length] = [name];
	} else {
		folders = path.split('/');
		current = this.files;
		var i = 0;
		var next = 0;
		while (i < folders.length && next != -1) {
			next = -1;
			for (var j = 1; j < current.length; j++) 
				if (this.isFolder(current[j]) && folders[i] == current[j][0]) 
					next = j;
			if (next != -1) {
				i++;
				current = current[next];
			}
		}
		// If i == folders.length, then the path was traversed successfully
		if (i == folders.length)
			current[current.length] = [name];
		else
			print("WARNING: addFolder(" + path + ", " + name + ") failed!");
	}
}

FileSystem.prototype.remove = function(path, name) {
	if (path == "") {
		var temp = [this.files[0]]
		for (var i = 1; i < this.files.length; i++)
			if (this.files[i][0] != name)
				temp[temp.length] = this.files[i];
		this.files = temp;
	} else {
		var folders = path.split('/');
		var current = this.files;
		var i = 0;
		var next = 0;
		while (i < folders.length && next != -1) {
			next = -1;
			for (var j = 1; j < current.length; j++) 
				if (this.isFolder(current[j]) && folders[i] == current[j][0]) 
					next = j;
			if (next != -1) {
				i++;
				current = current[next];
			}
		}
		if (i == folders.length) {
			for (var j = 1; j < current.length; j++) {
				if ((this.isFolder(current[j]) && current[j][0] == name) || (current[j] == name)) {
					current.splice(j, 1);
					j--;
				}
			}
		} else {
			print("WARNING: removeFile(" + path + ", " + name + ") failed");
		}
	}
};

FileSystem.prototype.isFolder = function(someObject) {
	if (Array.isArray) {
		return Array.isArray(someObject) && someObject.length >= 1;
	} else {
		return Object.prototype.toString.call(someObject) == Object.prototype.toString.call([]) && someObject.length >= 1;
	}
};

FileSystem.prototype.getButtonList = function () {
	var buttons = [];
	
	var path_bar = new Button(10, 90, 10, 90, function () {} );
	path_bar.text = this.current_directory;
	path_bar.setEnabled(false);
	buttons[buttons.length] = path_bar;
	
	var current_filesystem = this;
	
	if (this.current_directory == "") {
		globals.file_system_up_button.action = function () {};
	} else {
		globals.file_system_up_button.action = function () {
			current_filesystem.cd("..");
			globals.computer_file_system.buttons = current_filesystem.getButtonList();
			globals.current_scene.draw(CANVAS_ELEMENT.getContext('2d'));
		};
	}
	buttons[buttons.length] = globals.file_system_up_button;
	
	buttons[buttons.length] = globals.file_system_x_button;
	
	
	var ls = this.listCurrentDirectory();
	var g = CANVAS_ELEMENT.getContext('2d');
	g.font = "30px Arial";
	for (var i = 0; i < ls.length; i++) {
		var item_button = new Button (290, 140 + i*40, 290 + g.measureText(ls[i]).width, 175 + i*40, function () {
			// Scoping problem: i == ls.length here, not what it was when the button was created. Therefore, the buttons
			// text must be depended on to change directories
			if (current_filesystem.folderExists(current_filesystem.current_directory, this.text))
				current_filesystem.cd(this.text);
			globals.computer_file_system.buttons = current_filesystem.getButtonList();
			globals.current_scene.draw(CANVAS_ELEMENT.getContext('2d'));
		});
		item_button.text = ls[i];
		
		var remove_item_button = new Button(1100, 140 + i*40, 1100 + g.measureText("Delete?").width, 175 + i*40, function () {
			// Same scoping problem as before, must find own index and subtract 1 to get text.
			// Also can add one to get whether its a File or Folder
			var index_of_self = -1;
			for (var i = 0; i < globals.current_scene.buttons.length; i++)
				if (globals.current_scene.buttons[i] == this)
					index_of_self = i;
			if (index_of_self < 0) {
				print("ERROR: remove_item_button could not find index of self");
			}
			else {
				var is_folder = globals.current_scene.buttons[index_of_self + 1].text == "Folder";
				var message = "Are you sure you want to remove the " + (is_folder ? "folder" : "file") + " " + globals.current_scene.buttons[index_of_self - 1].text + (is_folder ? " and all of its contents?" : "?");
				dialogue("Remove File?", message, [
					["Yes", function () {
						current_filesystem.remove(current_filesystem.current_directory, globals.current_scene.buttons[index_of_self - 1].text);
						var file_removed = globals.current_scene.buttons[index_of_self -1].text;
						globals.computer_file_system.buttons = current_filesystem.getButtonList();
						// Fixed the virus in the Library scene!
						if (current_filesystem == globals.infected_library_computer_file_system && file_removed == "trojan.horse") {
							say("Librarian", "You did it! You fixed the computer! I can get the rest.", function () {
								globals.library_score += 10;
								closeDialogue();
								globals.goToTheLibrary.setEnabled(false);
								changeScene(globals.start);
								socket.emit('scene_complete', { scene:"library", score:globals.library_score });
								play_video('virusremoval');
							});
						} else {
							closeDialogue(); // closeDialogue() will redraw automatically.
						}
					}],
					["No", function () { 
						closeDialogue(); 
					}]
				]);
			}
		});
		remove_item_button.text = "Delete?";
		
		var item_type = new Button(1000, 140 + i*40, 1000, 175 + i*40, function () {});
		item_type.setEnabled(false);
		item_type.text = this.folderExists(this.current_directory, ls[i]) ? "Folder" : "File";
		
		if (!current_filesystem.folderExists(this.current_directory, ls[i]))
			item_button.setEnabled(false);
		
		buttons[buttons.length] = item_button;
		buttons[buttons.length] = remove_item_button;
		buttons[buttons.length] = item_type;
		
	}
	
	var home_button = new Button (10, 140, 10 + g.measureText("Home").width, 175, function () {
		current_filesystem.cd("~");
		globals.computer_file_system.buttons = current_filesystem.getButtonList();
		globals.current_scene.draw(CANVAS_ELEMENT.getContext('2d'));
	});
	home_button.text = "Home";
	
	buttons[buttons.length] = home_button;
	
	for (var i = 1; i < this.files.length; i++) {
		if (this.isFolder(this.files[i])) {
			var item_button = new Button (10, 140 + i*40, 10 + g.measureText(this.files[i][0]).width, 175 + i*40, function () {
				if (current_filesystem.folderExists("", this.text))
					current_filesystem.cd("~/" + this.text);
				else
					print("ya goofed: Error in FileSystem.getButtonList()");
				globals.computer_file_system.buttons = current_filesystem.getButtonList();
				globals.current_scene.draw(CANVAS_ELEMENT.getContext('2d'));
			});
			
			item_button.text = this.files[i][0];
			
			buttons[buttons.length] = item_button;
		}
	}

	return buttons;
};

// End file system class

// Definitions necessary to define globals successfully.
globals = {MAX_X: 1280, MAX_Y: 630, next_object_id : 1 }

globals = { current_scene: null,
previous_world_scene: null,
worldButtonsEnabled: true,
diagUp: false,
MAX_X: 1280,
MAX_Y: 630,
dialogue_buttons: [],
CANVAS_X: CANVAS_ELEMENT.getBoundingClientRect().left,
CANVAS_Y: CANVAS_ELEMENT.getBoundingClientRect().top,
inventory_image: null,
click_sound: null,
phone_state: 1, // -1: Not in player's possession, 0: Hidden, 1: Visible in the corner, 2: Fully extended. Change it with the changePhoneState(int) function, not directly.,
phone_screen: 11, // Image no for phone screen. 11 is blank. To change the phone screen while the phone is active, modify globals.phone_screen directly, then call changePhoneState(2),
phone_software_installed: false,
phone_software_apps: [],
email_inbox: [],
email_inbox_index: 0,
phone_down: new Button (globals.MAX_X - 200, globals.MAX_Y - 400, globals.MAX_X, globals.MAX_Y - 350, function () {
	globals.phone_screen = 11;
	changePhoneState(1);
}),
phone_up: new Button (globals.MAX_X - 200, globals.MAX_Y - 50, globals.MAX_X, globals.MAX_Y, function () {
	changePhoneState(2);
	//globals.phone_up("globals.phone_up"); Why was this here?
}),
phone_home: new Button (globals.MAX_X - (200-80), globals.MAX_Y - (400-355), globals.MAX_X - (200-120), globals.MAX_Y - (400-390), function () {
	if (globals.phone_software_installed)
		globals.phone_screen = 12;
	else
		globals.phone_screen = 13;
	changePhoneState(2);
}), 
phone_internet: new Button (1205, 515, 1266, 577, function () {
	changePhoneState(0);
	changeScene(globals.web_browser);
}),
phone_all_programs: new Button (1087, 535, 1130, 577, function () {
	globals.phone_screen = 17;
	changePhoneState(2);
}),
phone_inbox: new Button (1151, 544, 1183, 577, function () {
	globals.phone_screen = 18;
	changePhoneState(2);
}),
phone_back: new Button (1093, 285, 1145, 330, function () {
	globals.phone_screen = 12;
	changePhoneState(2);
}),
NUM_PHONE_UNINSTALL_BUTTONS: 3,
phone_uninstall_buttons: [],
phone_email_trash: new Button(1153, 528, 1204, 577, function () {
	var temp = []
	for (var i = 0; i < globals.email_inbox.length; i++)
		if (i != globals.email_inbox_index)
			temp[temp.length] = globals.email_inbox[i];
	globals.email_inbox = temp;
	if (globals.email_inbox.length == 0) {
		globals.email_inbox_index = 0;
		globals.phone_email_trash.setEnabled(false);
	}
	else if (globals.email_inbox_index >= globals.email_inbox.length)
		globals.email_inbox_index = globals.email_inbox_index - 1;
	if (globals.email_inbox_index == 0)
		globals.phone_email_left_arrow.setEnabled(false);
	if (globals.email_inbox_index  == globals.email_inbox.length - 1)
		globals.phone_email_right_arrow.setEnabled(false);
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.current_scene.draw(g);
}),
phone_email_left_arrow: new Button(1093, 541, 1148, 577, function () {
	globals.email_inbox_index = globals.email_inbox_index - 1;
	if (globals.email_inbox_index == 0)
		globals.phone_email_left_arrow.setEnabled(false);
	if (globals.email_inbox_index < globals.email_inbox.length - 1)
		globals.phone_email_right_arrow.setEnabled(true);
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.current_scene.draw(g);

}),
phone_email_right_arrow: new Button(1208, 541, 1269, 577, function () {
	globals.email_inbox_index = globals.email_inbox_index + 1;
	globals.phone_email_left_arrow.setEnabled(true);
	if (globals.email_inbox_index == globals.email_inbox.length -1)
		globals.phone_email_right_arrow.setEnabled(false);
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.current_scene.draw(g);
}),
activeTextField: null,
holding_shift: false,
persistent_buttons: [],
player_name: "Bobby",
partner_name: "Ashley",
coffee_shop: new Scene (0),
spoken_to_witness1: false,
spoken_to_witness2: false,
spoken_to_witness3: false,
spoken_to_tophat: false,
spoken_to_suspect1: false,
spoken_to_suspect2: false,
spoken_to_culprit: false,
spoken_to_all_witnesses: false,
spoken_to_all_suspects: false,
entry_message_shown: false,
incorrect_guesses: 0,
manager: new Button (207, 127, 282, 281, function () { 
	if (globals.spoken_to_all_witnesses && globals.spoken_to_all_suspects) {
		say("Manager", "Do you know who did it?", function () { 
			say("", "Click on the person responsible for these crimes!", closeDialogue());
		});
		globals.suspect1.setEnabled(true);
		globals.suspect2.setEnabled(true);
		globals.culprit.setEnabled(true);
	}
	else {
		say(globals.player_name, "Hello, ma'am. We are the detectives you called for. Do you have any leads?", function() { 
			say("Manager", "The guy in the suit with a top hat, the guy in the light blue shirt in the back corner, and the girl in a red shirt sitting at the counter all reported to me that they had been robbed after leaving " +
				"here.", function () {
				say(globals.partner_name, "Let's go talk to the victims, " + globals.player_name + ".", closeDialogue());
			});
		});
		globals.manager.setEnabled(false);
	}
}),
witness1: new Button (763, 174, 792, 224, function () { 
	say(globals.player_name, "Good morning. I'm a detective investigating the robberies that have been occurring here. What can you tell me?", function () {
		say("Shorts", "I ordered Halloween decorations for my house online through amazon.com, using a credit card, last week while sitting in this cafe. The tracking on the package said that the decorations had indeed shipped, " +
		"and are in a warehouse in Clarksville, Maryland, and probably will be delivered in one or two days. I used my card once in the grocery store since then, but on my credit card bill I noticed that there was also a charge " +
		"for a laptop battery on it as well. I just found out today and I'll contact the credit card company once the customer service line opens up.", closeDialogue()); 
	});
	globals.spoken_to_witness1 = true; 
	globals.witness1.setEnabled(false); 
}),
witness2: new Button (884, 207, 919, 230, function () {
	say(globals.player_name, "Hello. I'm a detective investigating the robberies that happened here. Do you have any information that could help me?", function () { 
		say("White Pants", "I was in a hurry coming into work yesterday and did not have time to pay my credit card bill at my house. Since I cannot live without my morning coffee, I came here and paid my bill online. The " +
			"payment was successfully received, but that afternoon, when I went to the ATM to withdraw some cash, I found that my bank account balance, which should have been $342, was 0. I then went to the bank for a statement " +
			"to see if there had been a mistake. The statement showed someone electronically withdrew the $342 I had, and transferred the money to a Capital One bank account.", closeDialogue());
	});
	globals.spoken_to_witness2 = true; 
	globals.witness2.setEnabled(false); 
}),
witness3: new Button (411, 158, 473, 363, function () {
	say(globals.player_name, "Hello, I'm a detective investigating the robberies here. Do you know anything " +
		"about them?", function () {
		say("Black Shirt", "I have not been robbed. I've never used a computer in here before, so I " +
			"think that the robberies have something to do with people's computers.", closeDialogue());
	});
	globals.spoken_to_witness3 = true;
	globals.witness3.setEnabled(false);
}),
tophat: new Button (622, 238, 694, 310, function () { 
	say(globals.player_name, "Hello, sir. I'm a detective investigating the robberies that happened here. Can you tell me anything about what happened to you?", function () { 
		say("Top Hat", "Two days ago, I was here, browsing the internet on my laptop looking for top hats, because I need one for my role as Abraham Lincoln in the theatre production I am a part of. I purchased one online from" +
			" amazon.com, using a credit card. The purchase itself was not a scam, for the top hat did arrive as promised. I'm wearing it now. I haven't made any other purchases with the card since, so I am pretty sure my card" +
			" information was stolen here. Whoever has my card number used it to purchase a USB mouse. I cancelled that card but I couldn't remove my liability from the mouse purchase.", closeDialogue());
	});
	globals.spoken_to_tophat = true; 
	globals.tophat.setEnabled(false); 
}),
suspect1: new Button (771, 341, 884, 456, function () { 
	if (globals.spoken_to_all_witnesses && globals.spoken_to_all_suspects) {
		globals.incorrect_guesses++;
		say(globals.player_name, "The man in the red shirt is responsible.", function () {
			say("Manager", "Okay, I'll call the police.", function () {
				say("Police", "Sir, we have reasonable suspicion to believe that you are the one responsible for the recent robberies at this cafe.", function () {
					say("Red Shirt", "Huh? I haven't robbed anyone.", function () {
						say("Police", "This guy's innocent, " + globals.player_name + ". You got the wrong guy.", function () {
							if (globals.incorrect_guesses == 1)
								closeDialogue();
							else
								say("Police", "Man, this " + globals.player_name + " is the worst detective ever!");
						});
					});
				});
			});
		});
		globals.suspect1.setEnabled(false);
	}
	else {
		say(globals.player_name, "Hello, I'm investigating robberies that have been occurring here recently. Have  you heard anything about them?", function () { 
			say("Red shirt", "No, I've never been robbed here. I'm not using the internet. I've come here for inspiration to attempt to start writing a book.", closeDialogue());
		});
		globals.spoken_to_suspect1 = true; 
		globals.suspect1.setEnabled(false); 
	}
}),
suspect2: new Button (1199, 213, 1269, 267, function () { 
	if (globals.spoken_to_all_witnesses && globals.spoken_to_all_suspects) {
		globals.incorrect_guesses++;
		say(globals.player_name, "The man in the gray suit is responsible.", function () {
			say("Manager", "Okay, I'll call the police.", function () {
				say("Police", "Sir, we have reasonable suspicion to believe that you are the one responsible for the recent robberies at this cafe.", function () {
					say("Gray Suit", "What! I didn't do it! I swear!", function () {
						say("Police", "Mmm. I don't see anything malicious. I think you got the wrong guy.", function () {
							if (globals.incorrect_guesses == 1)
								closeDialogue();
							else
								say("Police", "Man, this " + globals.player_name + " is the worst detective ever!");
						});
					});
				});
			});
		});
		globals.suspect2.setEnabled(false);
	}
	else {
		say(globals.player_name, "I'm investigating the robberies here. Do you have any information about them?", function () { 
			say("Gray Suit", "I've never been robbed here. I don't come here often. I'm just looking at cat pictures on the internet. Isn't this the cutest cat you ever saw.", function () { 
				say(globals.partner_name, "No. That's an ugly looking cat.", function () { 
					dialogue("Gray Suit", "How dare you! That's the second cutest cat in the world, second to mine! What about you. What do you think?", [
						["It's cute", function () {
							say(globals.player_name, "Yes, it is a pretty cute cat", function () {
								say("Gray Suit", "You've got a good sense for cat cuteness. I'm glad you agree with me.", closeDialogue());
							});
						}],
						["It's ugly", function () {
							say(globals.player_name, "I agree with " + globals.partner_name + ". That cat is ugly", function () {
								say("Gray Suit", "You guys don't know what your talking about when it comes to cats.", closeDialogue());
							});
						}],
						["Unsure", function () { 
							say(globals.player_name, "I don't know. Ask me on another day.", closeDialogue());
						}]
					]);
				});
			});
		});
		globals.spoken_to_suspect2 = true;
		globals.suspect2.setEnabled(false); 
	}
}),
culprit: new Button (972, 293, 1036, 363, function () { 
	if (globals.spoken_to_all_witnesses && globals.spoken_to_all_suspects) {
		say(globals.player_name, "The man in the blue shoes is responsible.", function () { 
			say("Manager", "Okay, I'll call the police.", function () {
				say("Police", "Sir, we have reasonable suspicion to believe that you are the one responsible for the recent robberies at this cafe.", function () {
					say("Blue Shoes", "I swear I'm innocent!", function () {
						say("Police", "Well, the processes running on your PC show otherwise. You're downloading all the traffic from the Wi-Fi onto your computer! You're under arrest for fraud and robbery. You have the " +
							"right to remain silent. Anything you say in court can and will be used against you. You have the right to an attorney. If you cannot afford one, one will be provided for you.", function () {
							say("Manager", "Why'd you do it?", function () {
								say("Blue Shoes", "I was fired two years ago by a Starbucks in Ohio. Since then, I've been wandering the country, and I'm running out of money. It was the only thing I could do.", function () {
									say("Manager", "Thank you for your help, " + globals.player_name + " and " + globals.partner_name + ". With the robber in custody, I'll be able to resume business as usual again. I'll post a notice " +
									"regarding the risk of using my public network for financial transactions. ", function () {
										say("Shorts", "Yeah, thanks guys! I had no idea that wireless network connections could be easily intercepted, even if the website itself is secure. I won't by anything on a public " +
										"network again.", function () {
											say("Manager", "For your help, I am pleased to offer you both a $" + (30-10*globals.incorrect_guesses) + " gift certificate. Please accept it as a token of my thanks.", function () {
												say(globals.partner_name, "Thank you very much, ma'am.", function () {
													say(globals.player_name, "Thanks a lot.", function () {
														closeDialogue();
														socket.emit('scene_complete', { scene: "coffee_shop", score: 30-10*globals.incorrect_guesses });
														changeScene(globals.start);
														globals.goToCoffeeShopButton.setEnabled(false);
														play_video("wifisniff");
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
		globals.culprit.setEnabled(false);
	}
	else {
		say(globals.player_name, "Hello, sir. I'm working on a case involving robberies at this cafe. Do you know anything pertinent to that matter?", function () { 
			say("Blue Shoes", "No, I don't. I've never been robbed here. I just lost my job in Cincinnati, and I came here. I'm playing Words with Friends while I wait for job application responses.", closeDialogue());
		});
		globals.spoken_to_culprit = true;
		globals.culprit.setEnabled(false); 
	}
}),
start: new Scene (1),
goToCoffeeShopButton: new Button (300, 100, 940, 400, function () { changeScene(globals.coffee_shop); }),
goToTheMallButton: new Button (300, 470, 532, 530, function () { changeScene(globals.mall); }),
goToWebBrowser: new Button (600, 470, 832, 530, function () { changeScene(globals.web_browser); }),
goToTheLibrary: new Button (64, 470, 256, 530, function () { changeScene(globals.library); }),
mall: new Scene (3),
mall_entry_message_shown: false,
goToFreePhoneSoftware: new Button(696, 320, 793, 414, function () { changeScene(globals.free_phone_software); }),
goToHookMyPhoneUp: new Button (1, 208, 185, 610, function () { changeScene(globals.hook_my_phone_up); }),
goToOpenSourcePhones: new Button (1201, 310, 1269, 500, function () { changeScene (globals.open_source_phones); }),
mall_woman_walking: new Button (600, 341, 632, 452, function () { say("Dark Blue Dress", "Hey, what's up?", closeDialogue()); }),
free_phone_software: new Scene (4),
install_free_phone_software: new Button (484, 414, 696, 440, function () { globals.browser_bar.text = "freephonesoftware.com"; changeScene(globals.free_phone_software_web_page); changePhoneState(0); }),
exit_free_phone_software: new Button (977, 274, 1051, 518, function () { changeScene(globals.mall); }),
free_phone_software_yellow_backpack: new Button (380, 308, 417, 465, function () { say("Yellow Backpack", "Hi", closeDialogue()); }),
free_phone_software_white_shirt: new Button (742, 282, 801, 450, function () { say("White Shirt", "Hello, how can I help you?", closeDialogue()); }),
free_phone_software_purple_shirt: new Button (893, 300, 950, 484, function () { say("Purple Shirt", "This man's product is a bit too good to be true", closeDialogue()); }),
hook_my_phone_up: new Scene (5),
exit_hook_my_phone_up: new Button (725, 189, 823, 290, function () { changeScene(globals.mall); }),
install_hook_my_phone_up: new Button (930, 329, 1099, 442, function () { globals.browser_bar.text = "hookmyphoneup.net"; changeScene(globals.hook_my_phone_up_web_page); changePhoneState(0); }),
hook_my_phone_up_green_shirt: new Button (595, 218, 656, 461, function () { say("Green Shirt", "Hello", closeDialogue()); }),
hook_my_phone_up_red_heels: new Button (843, 243, 911, 485, function () { say("Red Heels", "Hello", closeDialogue()); }),
hook_my_phone_up_pink_shirt: new Button (330, 266, 400, 385, function () { say("Magenta Shirt", "Hello", closeDialogue()); }),
hook_my_phone_up_man: new Button (436, 191, 502, 426, function () { say("Bowtie", "Hello", closeDialogue()); }),
open_source_phones: new Scene (6),
exit_open_source_phones: new Button (500, 600, 600, 630, function () { changeScene(globals.mall); }),
install_open_source_phones: new Button (410, 132, 643, 297, function () { globals.browser_bar.text = "opensourcephones.org"; changeScene(globals.open_source_phones_web_page); changePhoneState(0); }),
open_source_phones_employee: new Button (242, 208, 342, 341, function () { say("Red Tie", "Hello, how can I help you today?", closeDialogue()); }),
open_source_phones_woman: new Button (731, 282, 807, 445, function () { say("Yellow Shirt", "Hello", closeDialogue()); }),
open_source_phones_backpack: new Button (1045, 267, 1138, 486, function () { say("Blue Backpack", "Hi", closeDialogue()); }),
web_browser: new Scene(7),
browser_bar: new Button (189, 20, 931, 61, function () { setActiveTextField(globals.browser_bar); }),
browser_x_button: new Button (1042, 28, 1067, 54, function () { changeScene(globals.previous_world_scene); if (globals.phone_state == 0) changePhoneState(1) }),
registration_page: new Scene(8),
username_field: new Button (390, 160, 850, 200, function () { setActiveTextField(globals.username_field); }),
password_field: new Button (390, 240, 850, 280, function () { setActiveTextField(globals.password_field); }),
mfa_check_box: new Button (667, 305, 703, 338, function () { globals.mfa_check_box.text = (globals.mfa_check_box.text == "x") ? "" : "x"; globals.current_scene.draw(CANVAS_ELEMENT.getContext("2d")); }),
registration_submit: new Button (728, 469, 850, 515, function () {
	if (globals.username_field.text == "" || globals.password_field.text == "") {
		alert("Both a username and a password are required.");
	}
	else {
		// Valid registration, notify server
		socket.emit ('register', { username: globals.username_field.text, password: globals.password_field.text, email: "", mfa: false });
		//socket.emit('register', { username: globals.username_field.text, password: globals.password_field.text, email: email_field.text, mfa: (globals.mfa_check_box.text == "x") });
	}
}),
four_oh_four: new Scene (9),
free_phone_software_web_page: new Scene (14),
phone_virus_downloaded: 0,
free_phone_software_download_button: new Button (330, 506, 977, 631, function () { 
	changeScene(globals.previous_world_scene); 
	globals.phone_screen = 11; 
	globals.phone_software_installed = false; 
	changePhoneState(2); 
	globals.phone_virus_downloaded = 1;
	say(globals.player_name, "(I don't think that worked... that probably isn't good.)", closeDialogue());
	globals.phone_software_apps[globals.phone_software_apps.length] = "trojan.horse";
}),
hook_my_phone_up_web_page: new Scene (15),
hook_my_phone_up_download_button: new Button (329, 281, 905, 439, function () { 
	changeScene(globals.previous_world_scene); 
	globals.phone_screen = 12; 
	globals.phone_software_installed = true; 
	changePhoneState(2); 
	say(globals.player_name, "(That looks like it worked... my phone's working now)", function () { closeDialogue(); changeScene(globals.start); });
	socket.emit('scene_complete', { scene: "mall", score: 20 - 10*globals.phone_virus_downloaded });
	if (globals.phone_virus_downloaded < 0.5)
		globals.phone_virus_downloaded = 0.5;
	globals.phone_software_apps[globals.phone_software_apps.length] = "Conduit Search Helper";
	globals.phone_software_apps[globals.phone_software_apps.length] = "24x7x52 Tech Support";
}),
open_source_phones_web_page: new Scene (16),
open_source_phones_download_button: new Button (329, 281, 905, 439, function () { 
	changeScene(globals.previous_world_scene); 
	globals.phone_screen = 12; 
	globals.phone_software_installed = true; 
	changePhoneState(2); 
	say(globals.player_name, "(That looks like it worked... my phone's working now)", function () { closeDialogue(); changeScene(globals.start); });
	socket.emit('scene_complete', { scene: "mall", score: 30 - 15*globals.phone_virus_downloaded });
}),
library: new Scene (19),
library_entry_message_shown: false,
librarian_spoken_to_once: false,
library_have_flash_drive1: false,
library_fixing_the_computer: false,
library_score: 0,
librarian_button: new Button (1058, 246, 1224, 415, function () { 
	changeScene(globals.library_librarian);
}),
abandoned_computer_button: new Button (576, 342, 693, 469, function () {
	changeScene(globals.library_abandoned_computer);
}),
student1_button: new Button (722, 342, 845, 461, function () {
	changeScene(globals.library_student1);
}),
student2_button: new Button (854, 312, 893, 347, function () {
	changeScene(globals.library_student2);
}),
student3_button: new Button (451, 299, 495, 384, function () {
	changeScene(globals.library_student3);
}),
guy_at_whiteboard: new Button (2, 229, 104, 338, function () {
	say("Striped Shirt", "What's the integral of sin^2 (x)?", closeDialogue());
}),
library_exit_door: new Button (402, 243, 422, 258, function () {
	changeScene(globals.start);
}),
library_librarian: new Scene (20),
librarian_dialogue_options: [
	["I don't know yet.", function () {
		say(globals.player_name, "I'm not sure yet.", function () {
			say("Librarian", "Ok, come talk to me if you figure something out.", function () {
				closeDialogue();
				changeScene(globals.library);
			});
		});
	}]
],
librarian_fixing_the_computer_dialog_options: [
	["Not yet. I'm still working on it", function () {
		say(globals.player_name, "Not yet. I'm still working on it", function () {
			say("Librarian", "Okay. If you can't get it, that's okay.", function () {
				closeDialogue();
				changeScene(globals.computer_file_system); 
			});
		});
	}],
	["Sorry. I can't find the problem. Get the IT guys", function () {
		say(globals.player_name, "Sorry. I couldn't figure it out. You'll have to call in the IT professionals.", function () {
			say("Librarian", "That's fine. You've already done enough. Thanks for all the help!", function () {
				closeDialogue();
				changeScene(globals.start);
			});
		});
	}]
],
talk_to_librarian: new Button (123, 77, 602, 611, function () {
	if (globals.library_fixing_the_computer) {
		dialogue("Librarian", "Did you get it fixed?", globals.librarian_fixing_the_computer_dialog_options);
	}
	else if (globals.librarian_spoken_to_once) {
		dialogue("Librarian", "Do you know what's causing the problem?", globals.librarian_dialogue_options);
	}
	else {
		say(globals.partner_name, "Hello ma'am. We're the detectives that you asked to come help. What can you tell us about what is happening?", function () {
			say("Librarian", "Thanks for coming. About a day ago, one of the computers in the computer lab stopped working normally, and instead, " +
							 "It got stuck on some strange website. Since then, it seems like every few hours, another computer is lost to this virus, " +
							 "and I don't know what is causing it or how to remove it. I need you to find the cause, and if you can, show me how to fix " +
							 "one of the computers, if you can find a solution.", function () {
				say(globals.partner_name, "We'll do our best, ma'am.", function () {
					closeDialogue();
					globals.librarian_spoken_to_once = true;
					changeScene(globals.library);
				});
			});
		});
	}
}),
abandoned_computer_back_button: new Button(0, 0, 100, 100, function () {
	changeScene(globals.library);
}),
library_abandoned_computer: new Scene (21),
abandoned_computer_temp_browser_bar: "",
abandoned_computer_temp_browser_bar_enabled: false,
abandoned_computer_infected: false,
library_have_flash_drive2: false,
librarian_dialogue_option_both_usbs: ["Both flash drives.", function () {
	say(globals.player_name, "It's these two USB drives. I found this one abandoned in front of a computer, and this one the kid with the " +
 					 "glasses plugged into his computer and it redirected him to a suspicious website.", function () {
		globals.library_score += 20;
		dialogue("Librarian", "Great! Do you think you can fix or should I call the IT guys?", [
			["Let me fix it!", function () {
				say(globals.player_name, "Sure, I think I can fix it.", function () {
					say("Librarian", "Ok, then check out this computer. If you can't figure it out, that's okay.", function () {
						closeDialogue();
						globals.library_fixing_the_computer = true;						
						globals.computer_file_system.buttons = globals.infected_library_computer_file_system.getButtonList();
						changeScene(globals.computer_file_system);
					});
				});
			}],
			["Call in the IT Professionals.", function () {
				say(globals.player_name, "I don't think I can fix it. Get the IT guys to do it.", function () {
					say("Librarian", "Ok, that's fine. Thanks for your help! You've done enough.", function () {
						closeDialogue();
						globals.goToTheLibrary.setEnabled(false);
						changeScene(globals.start);
						socket.emit('scene_complete', { scene:"library", score:globals.library_score });
						play_video('virusremoval');
					});
				});
			}]
		]);
	});
}],
abandoned_usb_dialog_options: [
	["Do nothing", function () {
		closeDialogue();
	}], ["Take it.", function () {
		say("", "You take the red flash drive.", function () {
			globals.abandoned_usb.setEnabled(false);
			globals.librarian_dialogue_options[globals.librarian_dialogue_options.length] = ["The abandoned red flash drive.", function () {
				say(globals.player_name, "It's this USB drive. I found it abandoned in front of a computer.", function () {
					globals.library_score += 10;
					dialogue("Librarian", "Great! Do you think you can fix or should I call the IT guys?", [
						["Let me fix it!", function () {
							say(globals.player_name, "Sure, I think I can fix it.", function () {
								say("Librarian", "Ok, then check out this computer. If you can't figure it out, that's okay.", function () {
									closeDialogue();
									globals.computer_file_system.buttons = globals.infected_library_computer_file_system.getButtonList();
									globals.library_fixing_the_computer = true;
									changeScene(globals.computer_file_system);
								});
							});
						}],
						["Call in the IT Professionals", function () {
							say(globals.player_name, "I don't think I can fix it. Get the IT guys to do it.", function () {
								say("Librarian", "Ok, that's fine. Thanks for your help! You've done enough.", function () {
									closeDialogue();
									globals.goToTheLibrary.setEnabled(false);
									changeScene(globals.start);
									socket.emit('scene_complete', { scene:"library", score:globals.library_score });
									play_video('virusremoval');
								});
							});
						}]
					]);
				});
			}];
			globals.library_have_flash_drive2 = true;
			if (globals.library_have_flash_drive1 && globals.library_have_flash_drive2) {
				globals.librarian_dialogue_options[globals.librarian_dialogue_options.length] = globals.librarian_dialogue_option_both_usbs;
			}
			closeDialogue();
		});
	}],
	["Put it in the computer", function () {
		globals.abandoned_computer_infected = true;
		say(globals.partner_name, "I don't think that was good. Take a look at the web browser. It's on some sketchy looking website.", closeDialogue());
		globals.library_score -= 5;
		// Delete this option from the dialog.
		globals.abandoned_usb_dialog_options = [globals.abandoned_usb_dialog_options[0], globals.abandoned_usb_dialog_options[1]]; 
		globals.library_computer_file_system.addFile("Downloads", "trojan.horse");
	}]],
abandoned_usb: new Button (248 , 517, 320, 573, function () {
	dialogue("", "It's a red flash drive.", globals.abandoned_usb_dialog_options);
}),
abandoned_computer_web_browsers: new Button (540, 61, 658, 167, function () {
	if (globals.abandoned_computer_infected) {
		globals.abandoned_computer_temp_browser_bar = globals.browser_bar.text;
		globals.abandoned_computer_temp_browser_bar_enabled = true;
		globals.browser_bar.text = "freephonesoftware.com"
		changeScene(globals.free_phone_software_web_page);
	}
	else {
		changeScene(globals.web_browser);
	}
}),
abandoned_computer_file_system: new Button (671, 161, 901, 354, function () {
	globals.computer_file_system.buttons = globals.library_computer_file_system.getButtonList();
	changeScene(globals.computer_file_system);
}),
library_student1: new Scene (22),
library_student2: new Scene (23),
library_student3: new Scene (23),
library_computer_file_system: new FileSystem (),
computer_file_system: new Scene (24),
file_system_x_button: new Button (1180, 0, 1280, 100, function () {
	changeScene(globals.previous_world_scene);
	if (globals.phone_state == 0)
		changePhoneState(1);
}),
file_system_up_button: new Button (1130, 0, 1170, 100, function () {

}),
infected_library_computer_file_system: new FileSystem(),
last_dialog_name:"",
last_dialog_text:"",
last_dialog_responses:[],
sequence_no:1, // save packet sequence number, to prevent late arriving old saves from overriding newer ones.
next_object_id: globals.next_object_id // This declaration must always come last. 
};
// End Global Variables

socket.on('load_save', function (info) {
	var obj_list = []
	var parsed = JSON.parse(info, function (key, value) {
		// The sent objects don't have their methods, so those must
		// be added manually.
		if (value)
		var result;
		if (value) {
			if (value.x1) {
				value.isWithinBounds = Button.prototype.isWithinBounds;
				value.doAction = Button.prototype.doAction;
				value.reactToClickAt = Button.prototype.reactToClickAt;
				value.setEnabled = Button.prototype.setEnabled;
			} else if (value.run_after_action) {
				value.draw = Scene.prototype.draw;
				value.image = Scene.prototype.image;
				value.addButton = Scene.prototype.addButton;
				value.setRunAfterAction = Scene.prototype.setRunAfterAction
			} else if (value.files) {
				value.cd = FileSystem.prototype.cd;
				value.listCurrentDirectory = FileSystem.prototype.listCurrentDirectory;
				value.folderExists = FileSystem.prototype.folderExists;
				value.addFile = FileSystem.prototype.addFile;
				value.addFolder = FileSystem.prototype.addFolder;
				value.remove = FileSystem.prototype.remove;
				value.isFolder = FileSystem.prototype.isFolder;
				value.getButtonList = FileSystem.prototype.getButtonList;
			}
		}
		if (value && value.match && value.match(/function/))
			result = eval("xyz5260y = " + value);
		else
			result = value;
		if (result && result.object_id) {
			for (var i = 0; i < obj_list.length; i++)
				if (result.object_id == obj_list[i].object_id) {
					return obj_list[i];
				}
			obj_list[obj_list.length] = result;
		}
		return result;
	});
	globals = parsed;
	// The save is counted as a file to receive.
	received_files++;
	if (received_files == EXPECTED_FILES)
		go();
});

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
	globals.dialogue_buttons = [];
	// Re-enable world buttons
	globals.worldButtonsEnabled = true;
	globals.diagUp = false;
	// redraw scene.
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.current_scene.draw(g);
//	g.drawImage(globals.inventory_image,0,0);
}

function dialogue(character_name, text, responses) {
	globals.last_dialog_name = character_name;
	globals.last_dialog_text = text;
	globals.last_dialog_responses = responses;
	// Setting default responses.
	responses = typeof responses !== 'undefined' ? responses : [["Okay (default).", function () { closeDialogue(); }]];
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.worldButtonsEnabled = false;
	globals.diagUp = true;
	//Redraw current scene.
	globals.current_scene.draw(g); // TODO I'll be honest I do not know how the scoping on this works.
	// Dark gray overlay
	g.fillStyle = "rgba(0,0,0,0.5)";
	g.fillRect(0,0,globals.MAX_X,globals.MAX_Y);
	// fill out rect of diag box.
	g.fillStyle = "rgba(50,50,50,1)";
	var dimX = 600
	var dimY = 400
	// Currentl has a border of pixel size 2. Could make this bigger or sglobals.maller, probably a function to do this explicitly.
	g.fillRect(globals.MAX_X/2 - (dimX/2 + 2), globals.MAX_Y/2 - (dimY/2 + 2), dimX + 4, dimY + 4);
	// Fill inner rect of diag box
	g.fillStyle = "rgba(70,70,70,1)";
	g.fillRect(globals.MAX_X/2 - dimX/2, globals.MAX_Y/2 - dimY/2, dimX, dimY);
	
	g.fillStyle = "rgba(255,255,255,1)";
	g.font = "24px Verdana";
	g.fillText(character_name, globals.MAX_X/2 - (dimX/2 - 8), globals.MAX_Y/2 - (dimY/2 - 24));
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
		g.fillText(lines[j].join(' '), globals.MAX_X/2 - (dimX/2 - 8), globals.MAX_Y/2 - (dimY/2 - 44 - lineHeight*j));
	}
	globals.dialogue_buttons = []; // MAKE SURE DIALOGUE BUTTONS ARE CLEAN.
	// Now load the responses:
	var dialog_buttons_left_edge = globals.MAX_X/2 - dimX/2 + 5;
	var dialog_buttons_right_edge = globals.MAX_X/2 + dimX/2 - 5;
	var dialog_buttons_width = (dialog_buttons_right_edge - dialog_buttons_left_edge)/responses.length;
	for (var j = 0; j < responses.length; j++) {
		globals.dialogue_buttons[globals.dialogue_buttons.length] = new Button(dialog_buttons_left_edge + dialog_buttons_width*j + 5, 
														   globals.MAX_Y/2 + dimY/2 - 110,
														   dialog_buttons_left_edge + dialog_buttons_width*(j+1) - 5, 
														   globals.MAX_Y/2 + dimY/2 - 10,
														   responses[j][1]);
		g.fillStyle = "rgba(80,80,80,1)";
		g.fillRect(dialog_buttons_left_edge + dialog_buttons_width*j + 5, globals.MAX_Y/2+dimY/2 - 110, dialog_buttons_width - 10, 100);
		g.fillStyle = "rgba(200,200,200,1)";
		g.font = "16px Verdana";
		//g.fillText(responses[j][0], dialog_buttons_left_edge + dialog_buttons_width*j + dialog_buttons_width/2 - (g.measureText(responses[j][0]).width/2), globals.MAX_Y/2 + dimY/2 - 50);
		drawTextInBox(g, responses[j][0], dialog_buttons_left_edge + dialog_buttons_width*j + 5, 
														   globals.MAX_Y/2 + dimY/2 - 110,
														   dialog_buttons_left_edge + dialog_buttons_width*(j+1) - 5, 
														   globals.MAX_Y/2 + dimY/2 - 10); 
	}		   
	
	//Draw GUI overlay.
//	g.drawImage(globals.inventory_image,0,0) 
}

function drawTextInBox(g, text, x1, y1, x2, y2) {
	var textWidth = x2 - x1;
	var words = text.split(' ');
	var lines = [[""]];
	
	var i = 0;
	
	while (i < words.length) {
		while (g.measureText(lines[lines.length-1].join(' ') + ' ' + words[i]).width < textWidth && i < words.length) {
			lines[lines.length-1].push(words[i]);
			i++;
		}
		// Line has over filled, so add a new line in and continue from there
		lines.push([""]);
	}
	var line_height = 20;
	for (var j = 0; j < lines.length; j ++) { 
		g.fillText(lines[j].join(' '), x1 + textWidth/2 - g.measureText(lines[j].join(' ')).width/2, y1 + (y2 - y1)/2 + line_height*(j+1) - line_height/2*lines.length);
	}
}

function changePhoneState (new_state) {
	if (new_state == 0 || new_state == -1) {
		globals.phone_down.setEnabled(false);
		globals.phone_up.setEnabled(false);
		globals.phone_home.setEnabled(false);
		globals.phone_internet.setEnabled(false);
		globals.phone_all_programs.setEnabled(false);
		globals.phone_inbox.setEnabled(false);
		globals.phone_back.setEnabled(false);
		globals.phone_email_trash.setEnabled(false);
		globals.phone_email_left_arrow.setEnabled(false);
		globals.phone_email_right_arrow.setEnabled(false);
		for (var i = 0; i < globals.phone_uninstall_buttons.length; i++) {
				globals.phone_uninstall_buttons[i].setEnabled(false);
				globals.phone_uninstall_buttons[i].text = "";
		}	
	}
	else if (new_state == 1) {
		globals.phone_down.setEnabled(false);
		globals.phone_up.setEnabled(true);
		globals.phone_home.setEnabled(false);
		globals.phone_internet.setEnabled(false);
		globals.phone_all_programs.setEnabled(false);
		globals.phone_inbox.setEnabled(false);
		globals.phone_back.setEnabled(false);
		globals.phone_email_trash.setEnabled(false);
		globals.phone_email_left_arrow.setEnabled(false);
		globals.phone_email_right_arrow.setEnabled(false);
		for (var i = 0; i < globals.phone_uninstall_buttons.length; i++) {
				globals.phone_uninstall_buttons[i].setEnabled(false);
				globals.phone_uninstall_buttons[i].text = "";
			}	
		}
	else if (new_state == 2) {
		globals.phone_down.setEnabled(true);
		globals.phone_up.setEnabled(false);
		globals.phone_home.setEnabled(true);		
		if (globals.phone_screen == 12) {
			globals.phone_internet.setEnabled(true);
			globals.phone_all_programs.setEnabled(true);
			globals.phone_inbox.setEnabled(true);
			globals.phone_back.setEnabled(false);
			globals.phone_email_trash.setEnabled(false);
			globals.phone_email_left_arrow.setEnabled(false);
			globals.phone_email_right_arrow.setEnabled(false);
			for (var i = 0; i < globals.phone_uninstall_buttons.length; i++) {
				globals.phone_uninstall_buttons[i].setEnabled(false);
				globals.phone_uninstall_buttons[i].text = "";
			}
		}
		else if (globals.phone_screen == 17) {
			globals.phone_internet.setEnabled(false);
			globals.phone_all_programs.setEnabled(false);
			globals.phone_inbox.setEnabled(false);
			globals.phone_back.setEnabled(true);
			globals.phone_email_trash.setEnabled(false);
			globals.phone_email_left_arrow.setEnabled(false);
			globals.phone_email_right_arrow.setEnabled(false);
			for (var i = 0; i < globals.phone_uninstall_buttons.length; i++) {
				if (i+1 <= globals.phone_software_apps.length) {
					globals.phone_uninstall_buttons[i].setEnabled(true);
					globals.phone_uninstall_buttons[i].text = globals.phone_software_apps[i] + "  Remove?";
				}
				else {
					globals.phone_uninstall_buttons[i].setEnabled(false);
					globals.phone_uninstall_buttons[i].text = "";
				}
			}
		}
		else if (globals.phone_screen == 18) {
			globals.phone_internet.setEnabled(false);
			globals.phone_all_programs.setEnabled(false);
			globals.phone_inbox.setEnabled(false);
			globals.phone_back.setEnabled(true);
			if (globals.email_inbox.length > 0)
				globals.phone_email_trash.setEnabled(true);
			if (globals.email_inbox_index != 0)
				globals.phone_email_left_arrow.setEnabled(true);
			if (globals.email_inbox_index < globals.email_inbox.length - 1)
				globals.phone_email_right_arrow.setEnabled(true);
			for (var i = 0; i < globals.phone_uninstall_buttons.length; i++) {
				globals.phone_uninstall_buttons[i].setEnabled(false);
				globals.phone_uninstall_buttons[i].text = "";
			}		
		}
		else {
			globals.phone_internet.setEnabled(false);
			globals.phone_all_programs.setEnabled(false);
			globals.phone_inbox.setEnabled(false);
			globals.phone_back.setEnabled(false);
			globals.phone_email_trash.setEnabled(false);
			globals.phone_email_left_arrow.setEnabled(false);
			globals.phone_email_right_arrow.setEnabled(false);
			for (var i = 0; i < globals.phone_uninstall_buttons.length; i++) {
				globals.phone_uninstall_buttons[i].setEnabled(false);
				globals.phone_uninstall_buttons[i].text = "";
			}
		}
	}
	globals.phone_state = new_state;
	var g = CANVAS_ELEMENT.getContext('2d');
	globals.current_scene.draw(g);
}


if (globals.phone_state != 2) {
	globals.phone_down.setEnabled(false);
}

if (globals.phone_state != 1) {
	globals.phone_up.setEnabled(false);
}

if (globals.phone_state != 2) {
	globals.phone_home.setEnabled(false);
}

if (globals.phone_state != 2 || globals.phone_screen != 12) {
	globals.phone_internet.setEnabled(false);
}
if (globals.phone_state != 2 || globals.phone_screen != 12) {
	globals.phone_all_programs.setEnabled(false);
}

if (globals.phone_state != 2 || globals.phone_screen != 12) {
	globals.phone_inbox.setEnabled(false);
}

if (globals.phone_state != 2 || (globals.phone_screen != 17 && globals.phone_screen != 18)) {
	globals.phone_back.setEnabled(false);
}

for (var i = 0; i < globals.NUM_PHONE_UNINSTALL_BUTTONS; i++) {
	globals.phone_uninstall_buttons[i] = new Button(1093, 340+30*i, 1265, 360+30*i, function () {
		/* Scoping behavior: i within this block is equal to globals.NUM_PHONE_UNINSTALL_BUTTONS, except within
			the for loop (var i = 0; ...) */
		var temp = [];
		var index_of_self;
		for (var i = 0; i < globals.phone_uninstall_buttons.length; i++)
			if (globals.phone_uninstall_buttons[i] == this)
				index_of_self = i;
		for (var j = 0; j < globals.phone_software_apps.length; j++)
			if (j != index_of_self)
				temp[temp.length] = globals.phone_software_apps[j];
		globals.phone_software_apps = temp;
		changePhoneState(2);
	});
	globals.phone_uninstall_buttons[i].setEnabled(false);
}



if (globals.phone_state != 2 || globals.phone_screen != 18) {
	globals.phone_email_trash.setEnabled(false);
	globals.phone_email_left_arrow.setEnabled(false);
	globals.phone_email_right_arrow.setEnabled(false);
}

function addToInbox(subject, body, sender, attachments) {
	globals.email_inbox[globals.email_inbox.length] = { subject:subject, body:body, sender:sender, attachments:attachments };
	if (globals.email_inbox_index < globals.email_inbox.length - 1 && globals.phone_state == 2 && globals.phone_screen == 18)
		globals.email_inbox_right_arrow.setEnabled(true);
	var g = CANVAS_ELEMENT.getContext("2d");
	if (globals.phone_state == 2 && globals.phone_screen == 18) {
		globals.current_scene.draw(g);
	}
}

function drawEmailInbox (g) {
	var hold_font = g.font;
	g.font = "11px Arial"
	if (globals.email_inbox.length > 0) {
		g.fillText("Viewing message " + (globals.email_inbox_index + 1) + " of " + globals.email_inbox.length, 1125, 330);
		var lineHeight = 13;
		g.fillText(globals.email_inbox[globals.email_inbox_index].sender, 1140, 345);
		g.fillText(globals.email_inbox[globals.email_inbox_index].subject, 1154, 364);
		var y = 384;
		for (var i = 0; i < globals.email_inbox[globals.email_inbox_index].attachments.length; i++) {
			g.fillText(globals.email_inbox[globals.email_inbox_index].attachments[i], 1184, y)
			y += lineHeight
		}
		if (y < 400) 
			y = 400;
		var textWidth = 1261 - 1099
		var words = globals.email_inbox[globals.email_inbox_index].body.split(' ');
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


document.onkeydown = function (e) {
	// key code for shift is 16.
	// a-z are 65-90
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 16)
		globals.holding_shift = true;
	//print(key);
	if (globals.activeTextField != null && globals.worldButtonsEnabled) {
		var g = CANVAS_ELEMENT.getContext("2d");
		g.font = "30px Arial";
		if (key >= 65 && key <= 90) {
			if (globals.holding_shift)
				globals.activeTextField.text += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(key-65);
			else
				globals.activeTextField.text += 'abcdefghijklmnopqrstuvwxyz'.charAt(key-65);
			globals.current_scene.draw(g);
		}
		else if (key >= 48 && key <= 57) {
			if (globals.holding_shift)
				globals.activeTextField.text += ')!@#$%^&*('.charAt(key-48);
			else
				globals.activeTextField.text += '0123456789'.charAt(key-48);
			globals.current_scene.draw(g);
		}
		else if (key == 8) {
			// Backspace. Prevent default because default is a shortcut to pressing the back button on the browser.
			e.preventDefault();
			globals.activeTextField.text = globals.activeTextField.text.substring(0, globals.activeTextField.text.length - 1);
			globals.current_scene.draw(g);
		}
		else if (key >= 186 && key <= 191) {
			if (globals.holding_shift)
				globals.activeTextField.text += ':+<_>?'.charAt(key-186);
			else
				globals.activeTextField.text += ';=,-./'.charAt(key-186);
			globals.current_scene.draw(g);
		}
		else if (key == 13) {
			if (globals.activeTextField == globals.browser_bar) {
				if (globals.browser_bar.text == "https://register.cyber.edu/") {
					changeScene(globals.registration_page);
				}
				else if (globals.browser_bar.text == "freephonesoftware.com") {
					changeScene(globals.free_phone_software_web_page);
				}
				else if (globals.browser_bar.text == "hookmyphoneup.net") {
					changeScene(globals.hook_my_phone_up_web_page);
				}
				else if (globals.browser_bar.text == "opensourcephones.org") {
					changeScene(globals.open_source_phones_web_page);
				}
				else {
					changeScene(globals.four_oh_four);
				}
			}
		}
		else if (key == 32) {
			globals.activeTextField.text += " ";
			globals.current_scene.draw(g);
		}
	}
};

document.onkeyup = function (e) {
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 16)
		globals.holding_shift = false;
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
	posx -= globals.CANVAS_X;
	posy -= globals.CANVAS_Y;
	// End compatibility code, posx & posy contain the clicked position
	
	// Clear out the globals.activeTextField, so it resets if you click outside it
	setActiveTextField(null);
	// Cause event(s) to occur based on the location of the mouse click.
	var found = false;
	for (var i = 0; i < globals.persistent_buttons.length; i++) {
		if (!found && globals.persistent_buttons[i].reactToClickAt(posx, posy)) {
			// play click sound for audio
			globals.click_sound.play();
			found = true;	// Must leave the method here because otherwise the changes in the scene will happen immediately, which means that the list of active buttons changes.
							// When that occurs, another button may be clicked before the user saw it, and whether or not that happens is also dependent on the order of buttons in the list.
							// However, cannot just return, because of globals.current_scene.run_after_action() call.
		}
	}
	
	if (!found && globals.worldButtonsEnabled) {
		for (var i = 0; i < globals.current_scene.buttons.length; i++) {
			if (!found && globals.current_scene.buttons[i].reactToClickAt(posx, posy)) {
				globals.click_sound.play();
				found = true;
			}
		}
	}
	
	if (!found) {
		for (var i = 0; i < globals.dialogue_buttons.length; i++) {
			if (!found && globals.dialogue_buttons[i].reactToClickAt(posx, posy)){
				// play click sound for audio
				globals.click_sound.play();
				found = true;
			}

		}
	}
	if (globals.worldButtonsEnabled)
		globals.current_scene.run_after_action();
	if (found || globals.worldButtonsEnabled) {
		
		socket.emit('save_game', { sequence_no:globals.sequence_no, data:JSON.stringify(globals, function (key, value) {
			if (typeof value === 'function')
				return value.toString('utf-8');
			else
				return value;
		}, 4)});
		globals.sequence_no += 1;
	}	
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
	posx -= globals.CANVAS_X;
	posy -= globals.CANVAS_Y;
	// End compatibility code, posx & posy contain the clicked position
	
	// document.getElementById("text").innerHTML = "(" + posx + ", " + posy + ")";
	
	var found = false;
	// Display rollover for the world interactions, if flag for worldButtons are enabled.
	if (globals.worldButtonsEnabled) {
		for (var i = 0; i < globals.current_scene.buttons.length; i++) {
			if (globals.current_scene.buttons[i].isWithinBounds(posx, posy)) {
				found = true;
			}
		}
	}
	
	// Handle rollover for GUI elements
	for (var i = 0; i < globals.persistent_buttons.length; i++) {
		if (globals.persistent_buttons[i].isWithinBounds(posx, posy)) {
			found = true;
		}
	}
	
	// Handle rollover for any dialogue buttons displayed on the screen.
	for (var i = 0; i < globals.dialogue_buttons.length; i++) {
		if (globals.dialogue_buttons[i].isWithinBounds(posx, posy)) {
			found = true;
		}
	}
	
	
	if (found)
		CANVAS_ELEMENT.style.cursor = "pointer";
	else
		CANVAS_ELEMENT.style.cursor = "auto";
}

function changeScene(new_scene) {
	if (globals.current_scene && (globals.current_scene.img_no <= 6 || (globals.current_scene.img_no >= 19 && globals.current_scene.img_no < 24))) {
		globals.previous_world_scene = globals.current_scene;
	}
	globals.current_scene = new_scene;
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.current_scene.draw(g);
//	g.drawImage(globals.inventory_image,0,0); 
	globals.current_scene.run_after_action();
}

function setActiveTextField(aButton) {
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.activeTextField = aButton;
	if (!globals.diagUp)
		globals.current_scene.draw(g); 
}

// A list of buttons that exist in multiple scenes, such as the inventory buttons.

globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_down;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_up;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_home;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_internet;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_all_programs;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_inbox;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_back;

for (var i = 0; i < globals.phone_uninstall_buttons.length; i++) {
	globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_uninstall_buttons[i];
}

globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_email_trash;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_email_left_arrow;
globals.persistent_buttons[globals.persistent_buttons.length] = globals.phone_email_right_arrow;

/*globals.persistent_buttons[globals.persistent_buttons.length] = 
	new Button(77,557, 122, 602, function() { print("Inventory slot one pressed."); }) 
globals.persistent_buttons[globals.persistent_buttons.length] = 
	new Button(137,557, 182, 602, function() { print("Inventory slot two pressed."); })
globals.persistent_buttons[globals.persistent_buttons.length] = 
	new Button(197,557, 242, 602, function() { print("Inventory slot three pressed."); })
globals.persistent_buttons[globals.persistent_buttons.length] = 
	new Button(257,557, 302, 602, function() { print("Inventory slot four pressed."); })
*/

addToInbox("Testing", "Hey, does this work?", globals.player_name, []);
addToInbox("Hello", "Hey, its your partner", globals.partner_name, []);

// Declaring the various scenes in the game
globals.coffee_shop.setRunAfterAction(function () { 
	if (!globals.entry_message_shown) {
		say(globals.partner_name, "Let's speak to the manager and let her know we are here. She's behind the counter.", function () { 
			globals.entry_message_shown = true; 
			closeDialogue(); 
			// Delaying adding the buttons until after the entry message is shown. This prevents people from skipping it by double clicking 
			// on the "Go to the Coffee Shop button", which triggers the top hat's dialogue, because they are in the same position on the screen.
			globals.coffee_shop.addButton(globals.manager);
			globals.coffee_shop.addButton(globals.witness1);
			globals.coffee_shop.addButton(globals.witness2);
			globals.coffee_shop.addButton(globals.witness3);
			globals.coffee_shop.addButton(globals.tophat);
			globals.coffee_shop.addButton(globals.suspect1);
			globals.coffee_shop.addButton(globals.suspect2);
			globals.coffee_shop.addButton(globals.culprit);
		});
		
	}
	else if (globals.entry_message_shown && !globals.spoken_to_all_witnesses && globals.spoken_to_witness1 && globals.spoken_to_witness2 && globals.spoken_to_tophat && (!globals.spoken_to_suspect1 || !globals.spoken_to_suspect2 || !globals.spoken_to_culprit)) {
		say(globals.partner_name, "Let's interview everyone else in here we haven't yet, they might have information or be the one responsible for these robberies.", closeDialogue());
		globals.spoken_to_all_witnesses = true;
	}
	else if (globals.spoken_to_witness1 && globals.spoken_to_witness2 && globals.spoken_to_tophat && globals.spoken_to_witness3 && globals.spoken_to_suspect1 && globals.spoken_to_suspect2 && globals.spoken_to_culprit && !globals.spoken_to_all_suspects) {
		say(globals.partner_name, "Let's talk to the manager and tell him who did it.", closeDialogue());
		globals.spoken_to_all_witnesses = true;
		globals.spoken_to_all_suspects = true;
		globals.manager.setEnabled(true);
	}
});

globals.goToTheMallButton.text = "Go to the mall";
globals.goToWebBrowser.text = "Go to web browser";
globals.goToTheLibrary.text = "Go to the library";
globals.start.addButton(globals.goToCoffeeShopButton);
globals.start.addButton(globals.goToTheMallButton);
//globals.start.addButton(globals.goToWebBrowser);
globals.start.addButton(globals.goToTheLibrary);

globals.mall.addButton(globals.goToFreePhoneSoftware);
globals.mall.addButton(globals.goToHookMyPhoneUp);
globals.mall.addButton(globals.goToOpenSourcePhones);
globals.mall.addButton(globals.mall_woman_walking);
globals.mall.setRunAfterAction(function () {
	if (!globals.mall_entry_message_shown) {
		globals.mall_entry_message_shown = true;
		say (globals.player_name, "(I just found this phone, but its not working. Maybe I can find what I need in here.)", function () {
			say("Saleman", "COME TO FREEPHONESOFTWARE.COM! A PHONE APPLICATION PROVIDING THE BASIC FUNCTUNALITY YOU NEED, 100% FREE, NO QUESTIONS ASKED!", function () {
				say(globals.player_name, "(That might be what I need)", closeDialogue());
			});
		});
	}
});

globals.exit_free_phone_software.text = "Back to Mall";
globals.free_phone_software.addButton(globals.install_free_phone_software);
globals.free_phone_software.addButton(globals.exit_free_phone_software);
globals.free_phone_software.addButton(globals.free_phone_software_yellow_backpack);
globals.free_phone_software.addButton(globals.free_phone_software_white_shirt);
globals.free_phone_software.addButton(globals.free_phone_software_purple_shirt); 

globals.exit_hook_my_phone_up.text = "Back to Mall";
globals.hook_my_phone_up.addButton(globals.install_hook_my_phone_up);
globals.hook_my_phone_up.addButton(globals.exit_hook_my_phone_up);
globals.hook_my_phone_up.addButton(globals.hook_my_phone_up_green_shirt);
globals.hook_my_phone_up.addButton(globals.hook_my_phone_up_red_heels);
globals.hook_my_phone_up.addButton(globals.hook_my_phone_up_pink_shirt);
globals.hook_my_phone_up.addButton(globals.hook_my_phone_up_man); 

globals.exit_open_source_phones.text = "Back to Mall";
globals.open_source_phones.addButton(globals.exit_open_source_phones);
globals.open_source_phones.addButton(globals.install_open_source_phones);
globals.open_source_phones.addButton(globals.open_source_phones_employee);
globals.open_source_phones.addButton(globals.open_source_phones_backpack);
globals.open_source_phones.addButton(globals.open_source_phones_woman); 

globals.web_browser.addButton(globals.browser_bar);
globals.web_browser.addButton(globals.browser_x_button);

globals.password_field.protect_text = true;
// MFA setting choice is for later in the game. The module in the lecture hall where passwords are stolen will result in the player's password being stolen unless they check this box
socket.on('register_success', function (info) {
	if (info.success) {
		globals.player_name = globals.username_field.text;
		changeScene(globals.previous_world_scene);
	}
	else
		alert("Unfortunately, the username you entered is already taken.");
});
globals.registration_page.addButton(globals.browser_bar);
globals.registration_page.addButton(globals.browser_x_button);
globals.registration_page.addButton(globals.username_field);
globals.registration_page.addButton(globals.password_field);
globals.registration_page.addButton(globals.mfa_check_box);
globals.registration_page.addButton(globals.registration_submit);

globals.four_oh_four.addButton(globals.browser_bar);
globals.four_oh_four.addButton(globals.browser_x_button);

globals.free_phone_software_web_page.addButton(globals.browser_bar);
globals.free_phone_software_web_page.addButton(globals.browser_x_button);
globals.free_phone_software_web_page.addButton(globals.free_phone_software_download_button);

globals.hook_my_phone_up_web_page.addButton(globals.browser_bar);
globals.hook_my_phone_up_web_page.addButton(globals.browser_x_button);
globals.hook_my_phone_up_web_page.addButton(globals.hook_my_phone_up_download_button);

globals.open_source_phones_web_page.addButton(globals.browser_bar);
globals.open_source_phones_web_page.addButton(globals.browser_x_button);
globals.open_source_phones_web_page.addButton(globals.open_source_phones_download_button);


globals.library.addButton(globals.librarian_button);
globals.library.addButton(globals.abandoned_computer_button);
globals.library.addButton(globals.student1_button);
globals.library.addButton(globals.student2_button);
globals.library.addButton(globals.student3_button);
globals.library.addButton(globals.guy_at_whiteboard);
globals.library.addButton(globals.library_exit_door);
globals.library.setRunAfterAction(function () {
	if (!globals.library_entry_message_shown) {
		say(globals.partner_name, "Why don't we go talk to the librarian? She's sitting at the desk over on the right.", closeDialogue());
		globals.library_entry_message_shown = true;
	}
});

globals.abandoned_computer_back_button.text = "Back";
globals.library_librarian.addButton(globals.talk_to_librarian);
globals.library_librarian.addButton(globals.abandoned_computer_back_button);


globals.library_abandoned_computer.setRunAfterAction(function () {
	if (globals.abandoned_computer_temp_browser_bar_enabled) {
		globals.browser_bar.text = globals.abandoned_computer_temp_browser_bar; 
		globals.abandoned_computer_temp_browser_bar_enabled = false;
	}
});
globals.library_abandoned_computer.addButton(globals.abandoned_usb);
globals.library_abandoned_computer.addButton(globals.abandoned_computer_web_browsers);
globals.library_abandoned_computer.addButton(globals.abandoned_computer_back_button);
globals.library_abandoned_computer.addButton(globals.abandoned_computer_file_system);

globals.library_student1.setRunAfterAction(function () {
	say(globals.player_name, "Do you have any papers due today?", function () {
		say("Glasses", "No. I'm just here to work on a programming project.", function () {
			say("Glasses", "What?! What the heck?! <Furious Banging on Keyboard>", function () {
				var temp = globals.browser_bar.text;
				globals.browser_bar.text = "freephonesoftware.com";
				changeScene(globals.free_phone_software_web_page);
				say("Glasses", "ARGH! It's totally locked up! I don't have time for this!", function () {
					say(globals.player_name, "What did you do to it?", function () {
						say("Glasses", "All I've done is login in a plugin in a USB drive, someone else must have messed with it", function () {
							say(globals.player_name, "Where did you find it?", function () {
								say("Glasses", "It was right here on the table, in front of the computer.", function () {
									say(globals.partner_name, "Can I have that? It might have caused the virus that just infected your computer. " +
													  "The autorun could be setup to automatically execute malware files.", function () {
										say("Glasses", "Sure, take it. I don't need it.", function () {
											closeDialogue();
											changeScene(globals.library);
											globals.browser_bar.text = temp;
											globals.student1_button.setEnabled(false);
											globals.librarian_dialogue_options[globals.librarian_dialogue_options.length] = ["The USB drive from Glasses.", function () {
												say(globals.player_name, "It's this USB drive. The kid with the glasses plugged it in to his computer and he was redirected to a suspicious website.", function () {
													globals.library_score += 10;
													dialogue("Librarian", "Great! Do you think you can fix or should I call the IT guys?", [
														["Let me fix it!", function () {
															say(globals.player_name, "Sure, I think I can fix it.", function () {
																say("Librarian", "Ok, then check out this computer. If you can't figure it out, that's okay.", function () {
																	closeDialogue();
																	globals.library_fixing_the_computer = true;
																	globals.computer_file_system.buttons = globals.infected_library_computer_file_system.getButtonList();
																	changeScene(globals.computer_file_system);
																});
															});
														}],
														["Call in the IT Professionals", function () {
															say(globals.player_name, "I don't think I can fix it. Get the IT guys to do it.", function () {
																say("Librarian", "Ok, that's fine. Thanks for your help! You've done enough.", function () {
																	closeDialogue();
																	globals.goToTheLibrary.setEnabled(false);
																	changeScene(globals.start);
																	socket.emit('scene_complete', { scene:"library", score:globals.library_score });
																	play_video('virusremoval');
																});
															});
														}]
													]);
												});
											}];
											globals.library_have_flash_drive1 = true;
											if (globals.library_have_flash_drive1 && globals.library_have_flash_drive2) {
												globals.librarian_dialogue_options[globals.librarian_dialogue_options.length] = globals.librarian_dialogue_option_both_usbs;
											}
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

globals.library_student2.setRunAfterAction(function () {
	say(globals.player_name, "Do you know if there is anything wrong with this computer?", function () {
		say("Pale Yellow Shirt", "I'm pretty sure it's working fine. I haven't had any problems with it yet. I just got here though. I have a paper due tonight and I haven't started it yet. But if something strange happens while you are here, I'll let you know.", function () {
			closeDialogue();
			changeScene(globals.library);
			globals.student2_button.setEnabled(false);
		});
	});
});

globals.library_student3.setRunAfterAction(function () {
	say(globals.player_name, "Have you been experiencing any difficulty with these computers?", function () {
		say("Red Shirt", "I don't think so. And I don't have time to check. I've been working all night on this paper! It's due at the start of class, in one hour.", function () {
			say(globals.player_name, "Well hurry up and finish then, so I can check this computer.", function () {
				say("Red Shirt", "Believe me, I am working as fast as I can.", function () {
					closeDialogue();
					changeScene(globals.library);
					globals.student3_button.setEnabled(false);
				});
			});
		});
	});
});

// TEST of file system 

globals.library_computer_file_system.addFolder("", "Documents");
globals.library_computer_file_system.addFolder("", "Downloads");
globals.library_computer_file_system.addFile("Documents", "hi.txt");
globals.library_computer_file_system.addFolder("Documents", "Stuff");
globals.library_computer_file_system.cd("Documents");
globals.library_computer_file_system.addFile("Documents/Stuff", "bye.txt");
globals.library_computer_file_system.cd("Stuff");
	
globals.computer_file_system.setRunAfterAction(function () {
	if (globals.phone_state != 0) changePhoneState(0);
});
globals.file_system_x_button.text = "Quit";
globals.file_system_up_button.text = "Up";

globals.infected_library_computer_file_system.addFolder("", "Desktop");

globals.infected_library_computer_file_system.addFolder("", "Documents");
globals.infected_library_computer_file_system.addFile("Documents", "HIST201 Paper.docx");

globals.infected_library_computer_file_system.addFolder("", "Downloads");
globals.infected_library_computer_file_system.addFile("Downloads", "vietnam_war_protest_poster.pdf");
globals.infected_library_computer_file_system.addFile("Downloads", "lyndon_b_johnson_1964_campaign_speech.pdf");

globals.infected_library_computer_file_system.addFolder("", "Pictures");
globals.infected_library_computer_file_system.addFolder("Pictures", "Sample Pictures");
globals.infected_library_computer_file_system.addFile("Pictures/Sample Pictures", "horses.jpg");
globals.infected_library_computer_file_system.addFile("Pictures/Sample Pictures", "lighthouse.jpg");
globals.infected_library_computer_file_system.addFile("Pictures/Sample Pictures", "penguins.jpg");
globals.infected_library_computer_file_system.addFile("Pictures/Sample Pictures", "tulips.jpg");
globals.infected_library_computer_file_system.addFile("Pictures", "neon_cat.gif");

globals.infected_library_computer_file_system.addFolder("", "Music");
globals.infected_library_computer_file_system.addFolder("Music", "Sample Music");
globals.infected_library_computer_file_system.addFile("Music/Sample Music", "Steal Away.mp3");
globals.infected_library_computer_file_system.addFile("Music/Sample Music", "Take the A-Train.mp3");
globals.infected_library_computer_file_system.addFile("Music/Sample Music", "Themes from the Unfinished Symphony.mp3");

globals.infected_library_computer_file_system.addFolder("", "Videos");
globals.infected_library_computer_file_system.addFolder("Videos", "Sample Videos");
globals.infected_library_computer_file_system.addFile("Videos/Sample Videos", "Wildlife.mpg");

globals.infected_library_computer_file_system.addFolder("", "Computer");
globals.infected_library_computer_file_system.addFolder("Computer", "Program Files");
globals.infected_library_computer_file_system.addFolder("Computer/Program Files", "Microsoft Office"); 
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Microsoft Office", "Word 2013.exe");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Microsoft Office", "Excel 2013.exe");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Microsoft Office", "Power Point 2013.exe");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Microsoft Office", "One Note 2013.exe");
globals.infected_library_computer_file_system.addFolder("Computer/Program Files", "Java");
globals.infected_library_computer_file_system.addFolder("Computer/Program Files/Java", "jre7");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Java/jre7", "COPYRIGHT");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Java/jre7", "LICENSE");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Java/jre7", "readme.txt");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Java/jre7", "javawr.jar");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Java/jre7", "tools.jar");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Java/jre7", "charsets.jar");
globals.infected_library_computer_file_system.addFolder("Computer/Program Files", "Internet Explorer");
globals.infected_library_computer_file_system.addFolder("Computer/Program Files/Internet Explorer", "Plugins");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Internet Explorer/Plugins", "bingsearchbar.dll");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Internet Explorer/Plugins", "adobePDFLinkHelper.dll");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Internet Explorer/Plugins", "Java Plug-in SSV Helper.dll");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Internet Explorer/Plugins", "trojan.horse");
globals.infected_library_computer_file_system.addFile("Computer/Program Files/Internet Explorer", "ie10.exe");

function go () {
	globals.inventory_image = img_list[2];
	globals.click_sound = audio_list[0];
	if (!globals.current_scene) {
		globals.current_scene = globals.mall;
	}
	if (!globals.previous_world_scene)
		globals.previous_world_scene = globals.mall;
	changeScene(globals.current_scene);
	if (globals.diagUp)
		dialogue(globals.last_dialog_name, globals.last_dialog_text, globals.last_dialog_responses);
}

/* Returns to the game after playing a video (or any action that deleted the canvas) */
function return_to_game () {
	document.getElementById('viewport').innerHTML = HTML_FOR_CANVAS;
	CANVAS_ELEMENT = document.getElementById("view")
	var g = CANVAS_ELEMENT.getContext("2d");
	globals.current_scene.draw(g);
//	g.drawImage(globals.inventory_image,0,0);
	globals.current_scene.run_after_action();
}
