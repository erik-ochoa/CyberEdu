function load_introduction (game, PHONE_SCREEN_LAYER) {
	game.screens["introduction_dorm_room"] = new Screen (0, 0, 0, new Image ("image/dorm_room", 0, 0, 0), [new Button ("introduction_dorm_room_computer", 824, 211, 964, 340, 0)], [], [/*Extras*/])

	game.screens["introduction_computer"] = new Screen (0, 0, 0, new Image ("image/dorm_room/computer", 0, 0, 0), [
		new Button ("introduction_computer_monitor", 435, 172, 664, 302, 0),
		new Button ("introduction_computer_monitor", 682, 228, 829, 460, 0)
	], [], []);

	game.screens["introduction_transition"] = new Screen (0, 0, 0, new Animation ("animation/dorm_room/transition", 0, 0, 0, true), [], [], []);

	game.screens["introduction_outside_mall"] = new Screen (0, 0, 0, new Image ("image/mallexterior", 0, 0, 0), [], [] ,[]);

	game.screens["intro_email"] = new Screen (0, 0, 0, new Image ("image/introemail", 0, 0,0),
	[new Button ("confirmation", 350, 133, 710, 163, 2, "VR Simulation Training", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("caps_confirmation", 350, 184, 800, 210, 2, "COMPLETE FORM IMMEDIATELY", "22px Arial", "rgba(0,0,0,1)"),
	], [], []);

	game.screens["good_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35),
	[new Button ("good_link", 285, 320, 980, 350, 1, "http://login.umd/register/confirmation?", "20px Arial", "rgba(6,69,173,1)"),
	new Button ("good_inbox", 25, 95, 160, 130, 1)], [],
	[new Text ("good_subject", 285, 100, 645, 130, 1, "VR Simulation Training", "24px Arial", "rgba(0,0,0,1)"),
	new Text ("good_dear", 285, 150, 645, 180, 1, "Welcome!", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_please", 285, 195, 980, 225, 1, "Thank-you for deciding to intern wiht the Division of IT here at UMD.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_aup", 285, 240, 980, 270, 1, "As part of your training we ask that all of our interns complete", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_aup_2", 285, 275, 980, 305, 1, "our new VR training. Here we will test your knowledge in a variety of cyber-securty related topics.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_disregard", 285, 365, 980, 395, 1, "Once you have put on and calibrated your VR headset, click the link below to begin.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_disregard_2", 285, 410, 980, 440, 1, "-UMD Division of IT", "20px Arial", "rgba(0,0,0,1)")
	]);

	game.screens["bad_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35),
	[new Button ("bad_link", 285, 515, 980, 545, 1, "http://ti-it.registration.payroll.com", "20px Arial", "rgba(6,69,173,1)"),
	new Button ("bad_inbox", 25, 95, 160, 130, 1)], [],
	[new Text ("bad_subject", 285, 100, 735, 130, 1, "COMPLETE FORM IMMEDIATELY", "22px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_dear", 285, 150, 645, 180, 1, "Dear Friend,", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please", 285, 195, 980, 225, 1, "We have noticed that you are missing key payroll employment", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please_2", 285, 230, 980, 260, 1, "documents in regards to your new position.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please_3", 285, 265, 980, 295, 1, "Please use the link below to fill out the missing form.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup", 285, 310, 980, 340, 1, "In order to continue processing your employment we need", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup_2", 285, 345, 980, 375, 1, "you to take immediate action to fill out these forms, if not.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup_2", 285, 390, 980, 420, 1, "you will be terminated from your current position.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_disregard", 285, 435, 980, 465, 1, "Thank you for choosing TI-IT Solutions", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_disregard_2", 285, 470, 980, 500, 1, "Online Employee Form Advisor -IT-TI Solutions Team", "20px Arial", "rgba(0,0,0,1)")
	]);

	game.dialogs["introduction_dialog"] = new Dialog ("introduction_dialog", "", "Finally back from that 4 hour long meeting. Amy said that they were going email me with instructions on starting the VR training. I wonder if she found the time yet.", ["Begin."]);
	game.dialogs["introduction_get_my_apps"] = new Dialog ("introduction_get_my_apps", "", "Sweet, she sent the email. Let's take a look and see how long this will take. Hmmm there seems to be two emails from the Division of IT.", ["Let's go!"]);
	game.dialogs["introduction_phone_dialog_1a"] = new Dialog ("introduction_phone_dialog_1a", "Voice", "Congratulations! You just became a statistic by failing your first test, the classic phishing scam. Don't worry though, alot of our first time intern fall for this. Let's see if you'll do better on our other tests. Put on the VR headset when ready to continue your training.", ["Continue."]);
	game.dialogs["introduction_phone_dialog_1b"] = new Dialog ("introduction_phone_dialog_1b", "Voice", "Congratulations on passing our first test. You would be surprised how many of our interns fall for that phishing scam test. You might be able to pull this off. Put on the VR headset when ready to continue your training.", ["Continue."]);

	game.browsers["introduction_computer_browser"] = new Browser ();

	game.webpages["1"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [new Button ("introduction_name_entry_finish_button", 100, 200, 200, 300, 2, "Next >", "18px Arial", "rgba(0,0,0,1)")], [new Button ("introduction_name_text_entry", 100, 130, 500, 200, 3, "", "24px Arial", "rgba(64,64,64,1)", "Your name here...")], [new Text ("introduction_registration_enter_name", 100, 100, 500, 150, 1, "What's your name?", "24px Arial", "rgba(0,0,0,1)"), new Rectangle("introduction_name_text_entry_outline_1", 98, 128, 502, 202, 1, "rgba(0, 0, 0, 1)"), new Rectangle("introduction_name_text_entry_outline_2", 100, 130, 500, 200, 2, "rgba(255, 255, 255, 1)")]);
	game.webpages["2"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [new Button ("introduction_partner_name_entry_finish_button", 100, 200, 200, 300, 2, "Next >", "18px Arial", "rgba(0,0,0,1)")], [new Button ("introduction_partner_name_text_entry", 100, 130, 500, 200, 3, "", "24px Arial", "rgba(64,64,64,1)", "Best friend's name here...")], [new Text ("introduction_registration_enter_partner_name", 100, 100, 500, 150, 1, "What's your best friend's name?", "24px Arial", "rgba(0,0,0,1)"), new Rectangle("introduction_partner_name_text_entry_outline_1",  98, 128, 502, 202, 1, "rgba(0, 0, 0, 1)"), new Rectangle("introduction_partner_name_text_entry_outline_2", 100, 130, 500, 200, 2, "rgba(255, 255, 255, 1)")]);
	game.webpages["3"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_3_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"), [], [], [new Text ("introduction_done_registration", 30, 50, 200, 500, 1, "Finished registration! You may now exit the browser.", "18px Arial", "rgba(0,0,0,1)")]);

	// Phone screens.
	game.screens["phoneAppStoreButtonScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneAppStoreButtonScreenBackground", 0, 0, 173, 291, 0, "rgba(255,255,255,1)"), [new Button ("introduction_app_store_button", 10, 10, 163, 281, 2, "Visit the APP Store!", "18px Georgia", "rgba(0,0,0,1)")], [], []);
	game.screens["phoneNotYetActivatedScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneNotYetActivatedScreenBackground", 0, 0, 173, 291, 0, "rgba(255,255,255,1)"), [], [], [new Text ("phone_not_yet_activated_message", 10, 10, 173, 291, 1, "Not yet activated. To place phone calls, send messages, or install apps, please start the VR training.", "10px Georgia", "rgba(0,0,0,1)")]);


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
	game.dialogs["introduction_phone_dialog_8"] = new Dialog ("introduction_phone_dialog_8", game.player_name, "What?! You can't do that! I'm a living being, and you're just a phone.", ["Next."]);
	game.dialogs["introduction_phone_dialog_9"] = new Dialog ("introduction_phone_dialog_9", "Phone", "Well good luck then. Try not to get lost - there is quite a big world in there.", ["Continue."]);
}

function introduction_onclick (button, changeMainScreen, showDialog, closeDialog, displayBrowser, changeBrowserWebPage, closeBrowser, changePhoneScreen, resizeCanvas, loadScenes, hidePhone, showPhone, browser, vars) {
	if (button == "introduction_dorm_room_computer") {
		changeMainScreen("introduction_computer");
		return true;
	} else if (button == "dialog_introduction_dialog_Begin.") {
		closeDialog();
		//showDialog("police_partner_dialog");
		return true;
	} else if (button == "good_download") {
		changeBrowserWebPage(browser, "http://arithmeticlab.com/downloadAL");
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
		hidePhone();
		changeMainScreen("intro_email");
		return true;
	} else if (button == "confirmation" ) {
		changeMainScreen("good_email");
		hidePhone();
		return true;
	} else if (button == "caps_confirmation" )  {
		changeMainScreen("bad_email");
		hidePhone();
		return true;
	} else if (button == "bad_link") {
		showDialog("introduction_phone_dialog_1a");
		hidePhone();
		return true;
	} else if (button == "good_link") {
		showDialog("introduction_phone_dialog_1b");
		hidePhone;
		return true;
	} else if (button == "bad_inbox" || button == "good_inbox") {
		changeMainScreen("intro_email");
		hidePhone();
		return true;
	} else if (button == "dialog_introduction_phone_dialog_1a_Continue." || button == "dialog_introduction_phone_dialog_1b_Continue.") {
		closeDialog();
		loadScenes();
		resizeCanvas(1152, 648);
		hidePhone(); // Hiding the phone for the duration of the animated GIF and dialog following it.
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
		showPhone();
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
