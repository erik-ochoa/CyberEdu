function load_introduction (game, PHONE_SCREEN_LAYER) {
	game.screens["introduction_dorm_room"] = new Screen (0, 0, 0, new Image ("image/dorm_room", 0, 0, 0), [new Button ("introduction_dorm_room_computer", 824, 211, 964, 340)], [], [/*Extras*/])
	
	game.screens["introduction_computer"] = new Screen (0, 0, 0, new Image ("image/dorm_room/computer", 0, 0, 0), [
		new Button ("introduction_computer_monitor", 435, 172, 664, 302),
		new Button ("introduction_computer_monitor", 682, 228, 829, 460)
	], [], []);
	
	game.screens["introduction_transition"] = new Screen (0, 0, 0, new Animation ("animation/dorm_room/transition", 0, 0, 0, true), [], [], []);
	
	game.screens["introduction_outside_mall"] = new Screen (0, 0, 0, new Image ("image/mallexterior", 0, 0, 0), [], [] ,[]);
	
	game.dialogs["introduction_dialog"] = new Dialog ("introduction_dialog", "", "I just got this new phone, I need to get on my computer and activate it so I can use it.", ["Begin."]);
	game.dialogs["introduction_get_my_apps"] = new Dialog ("introduction_get_my_apps", "", "Sweet, now I can get all my apps on this phone!", ["Let's go!"]);
	game.dialogs["introduction_phone_dialog_1"] = new Dialog ("introduction_phone_dialog_1", "Voice", "So you think you can just use the App Store?! Downloading happily every after? You have much to learn.", ["Continue."]);
	
	game.browsers["introduction_computer_browser"] = new Browser ();
	
	game.webpages["1"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [new Button ("introduction_name_entry_finish_button", 100, 200, 200, 300, "Next >", "18px Arial", "rgba(0,0,0,1)", 2)], [new Button ("introduction_name_text_entry", 100, 130, 500, 200, "Bobby", "24px Arial", "rgba(64,64,64,1)", 2)], [new Text ("introduction_registration_enter_name", 100, 100, 500, 150, 1, "What's your name?", "24px Arial", "rgba(0,0,0,1)")]);
	game.webpages["2"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [new Button ("introduction_partner_name_entry_finish_button", 100, 200, 200, 300, "Next >", "18px Arial", "rgba(0,0,0,1)", 2)], [new Button ("introduction_partner_name_text_entry", 100, 130, 500, 200, "Ashley", "24px Arial", "rgba(64,64,64,1)", 2)], [new Text ("introduction_registration_enter_partner_name", 100, 100, 500, 150, 1, "What's your best friend's name?", "24px Arial", "rgba(0,0,0,1)")]);
	game.webpages["3"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_3_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [], [], [new Text ("introduction_done_registration", 30, 50, 200, 500, 1, "Finished registration! You may now exit the browser.", "18px Arial", "rgba(0,0,0,1)")]);
	
	// Phone screens.
	game.screens["phoneAppStoreButtonScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneAppStoreButtonScreenBackground", 0, 0, 173, 291, 0, "rgba(0,64,255,1)"), [new Button ("introduction_app_store_button", 10, 10, 163, 281, "Visit the APP Store!", "18px Georgia", "rgba(255,255,255,1)", 2)], [], []);
	game.screens["phoneNotYetActivatedScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneNotYetActivatedScreenBackground", 0, 0, 173, 291, 0, "rgba(0,64,255,1)"), [], [], [new Text ("phone_not_yet_activated_message", 10, 10, 173, 291, 1, "Not yet activated. To place phone calls, send messages, or install apps, please register your phone online.", "10px Georgia", "rgba(255,255,255,1)")]);
	
	game.introduction_variables = {  
		finished_registration:false
	};
}

function load_introduction_part2 (game) {
	game.dialogs["introduction_phone_dialog_2"] = new Dialog ("introduction_phone_dialog_2", game.player_name, "Where the heck am I?", ["Next."]);
	game.dialogs["introduction_phone_dialog_3"] = new Dialog ("introduction_phone_dialog_3", "Voice", "Cyberspace, hopefully you'll learn a few things...", ["Next."]);
	game.dialogs["introduction_phone_dialog_4"] = new Dialog ("introduction_phone_dialog_4", game.player_name, "And who are you?", ["Next."]);
	game.dialogs["introduction_phone_dialog_5"] = new Dialog ("introduction_phone_dialog_5", "Voice", "Your brand new phone!", ["Next."]);
	game.dialogs["introduction_phone_dialog_6"] = new Dialog ("introduction_phone_dialog_6", game.player_name, "How is this possible?! Let me out of here!!!", ["Next."]);
	game.dialogs["introduction_phone_dialog_7"] = new Dialog ("introduction_phone_dialog_7", "Phone", "Hmm. If you think I'm going to let you ruin my hardware, you're wrong. You'll have to find your own way out.", ["Next."]);
	game.dialogs["introduction_phone_dialog_8"] = new Dialog ("introduction_phone_dialog_8", game.player_name, "But why can you just ruin my life! I'm a live human, a living being, and you're just a phone.", ["Next."]);
	game.dialogs["introduction_phone_dialog_9"] = new Dialog ("introduction_phone_dialog_9", "Phone", "Well good luck then. Try not to get lost - there is quite a big world in there.", ["Continue."]);
}

function introduction_onclick (button, changeMainScreen, showDialog, closeDialog, displayBrowser, changeBrowserWebPage, closeBrowser, changePhoneScreen, resizeCanvas, loadScenes, browser, vars) {
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
	} else if (button == "introduction_partner_name_entry_finish_button") {
		vars.finished_registration = true;
		changePhoneScreen("phoneAppStoreButtonScreen");
		changeBrowserWebPage(browser, "3");
		return true;
	} else if (button == "introduction_app_store_button") {
		showDialog("introduction_phone_dialog_1");
		return true;
	} else if (button == "browser-x" || button == "browser-minimize") {
		if (vars.finished_registration) {
			showDialog("introduction_get_my_apps");
			return true; // Consume this event to leave the browser open, until the dialog is processed.
		} else { // Do nothing.
			return false;
		}
	} else if (button == "dialog_introduction_get_my_apps_Let's go!") {
		closeDialog();
		closeBrowser(false);
		return true;
	} else if (button == "dialog_introduction_phone_dialog_1_Continue.") {
		closeDialog();
		loadScenes();
		resizeCanvas(1152, 648);
		changeMainScreen("introduction_transition"); // This will play the transition animated gif, dialog will begin once it terminates.
		return true;
	} else if (button == "dialog_introduction_phone_dialog_2_Next.") {
		closeDialog();
		showDialog("introduction_phone_dialog_3");
		return true;
	} else if (button == "dialog_introduction_phone_dialog_3_Next.") {
		closeDialog();
		showDialog("introduction_phone_dialog_4");
		return true;
	} else if (button == "dialog_introduction_phone_dialog_4_Next.") {
		closeDialog();
		showDialog("introduction_phone_dialog_5");
		return true;
	} else if (button == "dialog_introduction_phone_dialog_5_Next.") {
		closeDialog();
		showDialog("introduction_phone_dialog_6");
		return true;
	} else if (button == "dialog_introduction_phone_dialog_6_Next.") {
		closeDialog();
		showDialog("introduction_phone_dialog_7");
		return true;
	} else if (button == "dialog_introduction_phone_dialog_7_Next.") {
		closeDialog();
		showDialog("introduction_phone_dialog_8");
		return true;
	} else if (button == "dialog_introduction_phone_dialog_8_Next.") {
		closeDialog();
		showDialog("introduction_phone_dialog_9");
		return true;
	} else if (button == "dialog_introduction_phone_dialog_9_Continue.") {
		closeDialog();
		changePhoneScreen("phoneHomeScreen");
		changeMainScreen("mall_scene");
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
	} else if (name == "introduction_partner_name_text_entry") {
		game.partner_name = value;
		return true;
	} else {
		return false;
	}
}

function introduction_on_gif_ended (name, showDialog, changeMainScreen) {
	if (name == "animation/dorm_room/transition") {
		changeMainScreen("introduction_outside_mall");
		showDialog("introduction_phone_dialog_2");
		return true;
	} else {
		return false;
	}
} 