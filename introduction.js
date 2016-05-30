function load_introduction (game) {
	game.screens["introduction_dorm_room"] = new Screen (0, 0, 0, new Image ("image/dorm_room", 0, 0, 0), [new Button ("introduction_dorm_room_computer", 824, 211, 964, 340)], [], [/*Extras*/])
	
	game.screens["introduction_computer"] = new Screen (0, 0, 0, new Image ("image/dorm_room/computer", 0, 0, 0), [
		new Button ("introduction_computer_monitor", 435, 172, 664, 302),
		new Button ("introduction_computer_monitor", 682, 228, 829, 460)
	], [], []);
	
	game.dialogs["introduction_dialog"] = new Dialog ("introduction_dialog", "", "I just got this new phone, I need to get on my computer and activate it so I can use it.", ["Begin."]);
	
	game.browsers["introduction_computer_browser"] = new Browser ();
	
	game.webpages["1"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [new Button ("introduction_name_entry_finish_button", 100, 200, 200, 300, "Next >", "18px Arial", "rgba(0,0,0,1)", 2)], [new Button ("introduction_name_text_entry", 100 + 138, 100, 500, 200, "", "24px Arial", "rgba(64,64,64,1)", 2)], [new Text ("introduction_registration_enter_name", 100, 100, 500, 150, 1, "Enter Name:", "24px Arial", "rgba(0,0,0,1)")]);
	game.webpages["2"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [], [], []);
	game.webpages["3"] = [];
	game.webpages["4"] = [];
	
	// Manually set the browser to open to the registration page
	// game.browsers["introduction_computer_browser"].url = "1";
	// game.browsers["introduction_computer_browser"].screen.extras = [game.webpages["1"]];
}

function introduction_onclick (button, changeMainScreen, showDialog, closeDialog, displayBrowser, changeBrowserWebPage, browser) {
	if (button == "introduction_dorm_room_computer") {
		changeMainScreen("introduction_computer");
		return true;
	} else if (button == "dialog_introduction_dialog_Begin.") {
		closeDialog();
		return true;
	} else if  (button == "introduction_computer_monitor") {
		changeBrowserWebPage(browser, "1");
		displayBrowser ("introduction_computer_browser");
		return true;
	} else if (button == "introduction_name_entry_finish_button") {
		changeBrowserWebPage(browser, "2");
		return true;
	}
	
	else {
		return false;
	}
}

function introduction_text_field_edit (name, value, game) {
	if (name == "introduction_name_text_entry") {
		game.player_name = value;
		return true;
	} else {
		return false;
	}
}