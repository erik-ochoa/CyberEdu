function load_introduction (game, changeBrowserWebPage, PHONE_SCREEN_LAYER) {
	game.screens["introduction_dorm_room"] = new Screen (0, 0, 0, new Image ("image/dorm_room", 0, 0, 0), [new Button ("introduction_dorm_room_computer", 824, 211, 964, 340, 0)], [], [/*Extras*/])

	game.screens["introduction_computer"] = new Screen (0, 0, 0, new Image ("image/dorm_room/computer", 0, 0, 0), [
		new Button ("introduction_computer_monitor", 435, 172, 664, 302, 0),
		new Button ("introduction_computer_monitor", 682, 228, 829, 460, 0)
	], [], [
		new ScrollableList ("test_list", 100, 100, 300, 400, 1, new Rectangle("test_rectangle", 0, 0, 200, 300, 0, 'rgba(255,255,255,1)'))
	]);

	game.screens["introduction_transition"] = new Screen (0, 0, 0, new Animation ("animation/dorm_room/transition", 0, 0, 0, true), [], [], []);

	game.screens["introduction_outside_mall"] = new Screen (0, 0, 0, new Image ("image/mallexterior", 0, 0, 0), [], [] ,[]);

	game.screens["intro_email"] = new Screen (0, 0, 0, new Image ("image/emailinbox", 0, 0, 0, 0.35),
	[new Button ("confirmation", 350, 250, 710, 280, 2, "Online Registration Confirmation", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("caps_confirmation", 350, 200, 800, 230, 2, "CONFIRM NEW ACCOUNT IMMEDIATELY", "22px Arial", "rgba(0,0,0,1)"),
	new Button ("dit_reminder", 350, 150, 850, 180, 2, "Reminder: Forward Phishing Emails to DIT", "24px Arial", "rgba(0,0,0,1)")
	], [], []);

	game.screens["dit_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35),
	[new Button ("dit_inbox", 25, 95, 160, 130, 1),
	new Button ("dit_reply", 850, 140, 900, 170, 3, "Reply", "18px Arial", "rgba(0,0,0,1)"),
	new Button ("dit_forward", 925, 140, 1000, 170, 3, "Forward", "18px Arial", "rgba(0,0,0,1)")], [],
	[new Text ("dit_subject", 285, 100, 980, 130, 1, "Reminder: Forward Phishing Emails to DIT", "24px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_sender", 350, 140, 685, 170, 1, "Sent From: soc@umd.edu at 9:05AM", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_dear", 285, 190, 645, 220, 1, "Important!", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_phi", 285, 245, 1035, 285, 1, "What do you do if you fall victim to phishing or think you are being phished?", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_aup", 285, 290, 1035, 320, 1, "Email: Forward any possible or known phishing email messages to spam@umd.edu", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_for", 285, 325, 1035, 355, 1, "Call: You may contact the IT Help Desk to speak with a customer service agent.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_upd", 285, 370, 1035, 400, 1, "We also recommend updating your password, changing your security questions,", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_rec", 285, 405, 980, 435, 1, "and monitoring your accounts for suspicious activities", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_disregard", 285, 460, 980, 490, 1, "Thanks for your cooperation.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("dit_disregard_2", 285, 495, 980, 525, 1, "-Division of Information Technology", "20px Arial", "rgba(0,0,0,1)"),
	new Rectangle ("reply_bg", 845, 140, 900, 165, 2, "rgba(0,0,255,0.1)"),
	new Rectangle ("forward_bg", 920, 140, 995, 165, 2, "rgba(0,0,255,0.1)")
	]);

	game.screens["good_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35),
	[new Button ("good_link", 285, 340, 980, 370, 1, "http://login.cyberphone/register/confirmation?", "20px Arial", "rgba(6,69,173,1)"),
	new Button ("good_inbox", 25, 95, 160, 130, 1),
	new Button ("good_reply", 850, 140, 900, 170, 1, "Reply", "18px Arial", "rgba(0,0,0,1)"),
	new Button ("good_forward", 925, 140, 1000, 170, 3, "Forward", "18px Arial", "rgba(0,0,0,1)")], [],
	[new Text ("good_subject", 285, 100, 645, 130, 1, "Online Registration Confirmation", "24px Arial", "rgba(0,0,0,1)"),
	new Text ("good_sender", 350, 140, 790, 170, 1, "Sent From: support@cyberphone.com at 8:35AM", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_dear", 285, 190, 645, 220, 1, "Welcome!", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_please", 285, 235, 980, 255, 1, "Please confirm your account registration.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_aup", 285, 270, 980, 300, 1, "To accept the terms of the Acceptable Use Policy and Agreement and to", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_aup_2", 285, 305, 980, 335, 1, "validate your account, please click the link below.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_disregard", 285, 385, 980, 415, 1, "Thank you for choosing CyberPhone as your provider!", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_disregard_2", 285, 430, 980, 460, 1, "-CyberPhone Team", "20px Arial", "rgba(0,0,0,1)"),
	new Rectangle ("reply_bg", 845, 140, 900, 165, 2, "rgba(0,0,255,0.1)"),
	new Rectangle ("forward_bg", 920, 140, 995, 165, 2, "rgba(0,0,255,0.1)")
	]);

	game.screens["bad_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35),
	[new Button ("bad_link", 285, 545, 980, 575, 1, "http://cyberphonies.registration.confirmation.com", "20px Arial", "rgba(6,69,173,1)"),
	new Button ("bad_inbox", 25, 95, 160, 130, 1),
	new Button ("bad_reply", 850, 140, 900, 170, 1, "Reply", "18px Arial", "rgba(0,0,0,1)"),
	new Button ("bad_forward", 925, 140, 1000, 170, 3, "Forward", "18px Arial", "rgba(0,0,0,1)")], [],
	[new Text ("bad_subject", 285, 100, 735, 130, 1, "CONFIRM NEW ACCOUNT IMMEDIATELY", "22px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_sender", 350, 140, 820, 170, 1, "Sent From: cyberphonesupp@gmail.com at 8:34AM", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_dear", 285, 190, 645, 220, 1, "Dear Friend,", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please", 285, 235, 980, 265, 1, "Please confirm your account registration. If you do not complete", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please_2", 285, 270, 980, 290, 1, "this within 24 hours, your phone will be inactive and will", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please_3", 285, 295, 980, 325, 1, "require a full factory reset.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup", 285, 340, 980, 370, 1, "You can reply with an email containing the information below or", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup_2", 285, 375, 980, 405, 1, "click the link at the bottom of this email.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup_3", 285, 420, 980, 450, 1, "Required: Name, Email, Password, Phone PIN, SSN", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_disregard", 285, 465, 980, 495, 1, "Thank you for choosing CyberPhones", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_disregard_2", 285, 500, 980, 530, 1, "Customer Registration Advisor -CyberPhone Team", "20px Arial", "rgba(0,0,0,1)"),
	new Rectangle ("reply_bg", 845, 140, 900, 165, 2, "rgba(0,0,255,0.1)"),
	new Rectangle ("forward_bg", 920, 140, 995, 165, 2, "rgba(0,0,255,0.1)")
	]);

	game.dialogs["introduction_dialog"] = new Dialog ("introduction_dialog", "", "I just got this new phone, I need to get on my computer and activate it so I can use it.", ["Begin."]);
	game.dialogs["introduction_get_my_apps"] = new Dialog ("introduction_get_my_apps", "", "Sweet, now I can get all my apps on this phone! Now I just have to verify my account.", ["Let's go!"]);
	game.dialogs["intro_unneeded_reply"] = new Dialog ("intro_unneeded_reply", "", "Wait, I don't need to reply to or forward this email.", ["Continue."]);
	game.dialogs["intro_bad_reply"] = new Dialog ("intro_bad_reply", "", "Reply to this email with my information?", ["Yes.", "No."]);
	game.dialogs["intro_forward"] = new Dialog ("intro_forward", "", "Forward this email to spam@umd.edu?", ["Yes.", "No."]);
	game.dialogs["intro_already_forwarded"] = new Dialog ("intro_already_forwarded", "", "Wait, I already forwarded this email.", ["Continue."]);
	game.dialogs["introduction_phone_dialog_1a"] = new Dialog ("introduction_phone_dialog_1a", "Voice", "So you think you can just use the App Store?! Downloading happily every after? After you just fell for that totally obvious phishing scam, you have much to learn.", ["Continue."]);
	game.dialogs["introduction_phone_dialog_1b"] = new Dialog ("introduction_phone_dialog_1b", "Voice", "Not bad. At least you avoided that totally obvious phishing scam. Unfortunately, you probably still have much to learn. You might have indeed clicked on the safe web address, but I'm not going to let you just use the app store.", ["Continue."]);

	game.browsers["introduction_computer_browser"] = new Browser ();
	
	game.webpages["1"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_1_background", 0, 0, 800, 600, 0, "rgba(255,255,255,1)"), [
		new Button ("introduction_registration_1_continue_button", 500, 430, 700, 530, 1, "Continue", "18px Arial", "rgba(0,0,255,1)")], [], [
		new Text ("introduction_registration_1_instructions_text", 100, 50, 700, 430, 1, "Congratulations on your acceptance into the Division of Information Technology student internship program. All DIT interns are required an email account on the department's email server to be used for work purposes. To begin the process of creating this account, press the continue button at the bottom of this page.", "14px Arial", "rgba(0,0,0,1)")
	]);
	
	game.webpages["2"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_2_background", 0, 0, 800, 600, 0, "rgba(255,255,255,1)"), 
		[	/*Buttons*/
			new Button ("introduction_registration_2_continue_button", 500, 430, 700, 530, 1, "Continue", "18px Arial", "rgba(0,0,255,1)")
		], [ /*Text fields*/
			new Button ("introduction_name_text_entry", 100, 100, 750, 150, 3, "", "24px Arial", "rgba(0,0,0,1)", "Your name here..."), 
			new Button ("introduction_partner_name_text_entry", 100, 250, 750, 300, 3, "", "24px Arial", "rgba(0,0,0,1)", "Best friend's name here...")
		], [
			/*Extras*/
			new Rectangle("introduction_registration_2_player_name_entry_outline", 98, 98, 752, 152, 1, "rgba(0,0,0,1)"),
			new Rectangle("introduction_registration_2_partner_name_entry_outline", 98, 248, 752, 302, 1, "rgba(0,0,0,1)"),
			new Rectangle("introduction_registration_2_player_name_entry_fill", 100, 100, 750, 150, 2, "rgba(255,255,255,1)"),
			new Rectangle("introduction_registration_2_partner_name_entry_fill", 100, 250, 750, 300, 2, "rgba(255,255,255,1)"),
			new Text("introduction_registration_enter_name", 50, 50, 750, 100, 1, "Enter your name:", "18px Arial", "rgba(0,0,0,1)"), 
			new Text("introduction_registration_enter_partner_name", 50, 200, 750, 250, 1, "Enter your best friend's name:", "18px Arial", "rgba(0,0,0,1)")
		]
	);
	
	game.webpages["3"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_3_background", 0, 0, 800, 600, 0, 'rgba(255,255,255,1)'),
		[
			new Button("mfa_yes_button", 50, 200, 300, 250, 1, "Yes", "18px Arial", "rgba(0,255,0,1)"),
			new Button("mfa_no_button", 350, 200, 600, 250, 1, "No", "18px Arial", "rgba(255,0,0,1)")
		], [], [
			new Text ("introduction_registration_enable_mfa", 50, 50, 750, 100, 1, "Would you like to enable multi-factor authentication (MFA)?", "24px Arial", "rgba(0,0,0,1)"),
			new Text ("introduction_registration_mfa_instructions", 50, 100, 750, 200, 1, "Multi-factor authentication provides extra security to your account by sending a randomly generated authentication code to your phone each time you attempt to log in, which you will be prompted to enter to proceed. As a result, even if someone obtains your password, they will still be unable to access your account without also someone obtaining the code.", "14px Times", "rgba(0, 0, 0, 1)")
		]
	);
	
	game.webpages["3b"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_3b_background", 0, 0, 800, 600, 0, 'rgba(255,255,255,1)'),
		[
			new Button ("mfa_confirm_button", 350, 300, 600, 350, 1, "Confirm", "18px Arial", "rgba(0,0,255,1)"),
			new Button ("mfa_cancel_button", 50, 300, 300, 350, 1, "Cancel", "18px Arial", "rgba(255,0,0,1)")
		], [
			new Button ("mfa_code_text_entry", 50, 150, 300, 250, 1, "", "18px Arial", "rgba(0,0,0,1)", "Enter code...")
		], [
			new Text ("introduction_enter_mfa_code", 50, 50, 750, 100, 1, "An authentication code was just sent to your phone. Enter the code to activate MFA.", "24px Arial", "rgba(0,0,0,1)")
		]
	);
	
	game.webpages["4"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_4_background", 0, 0, 800, 600, 0, 'rgba(255,255,255,1)'),
		[], [], [new Text("introduction_registration_finished", 50, 50, 750, 150, 1, "Registration complete. You may now close this window.", "18px Arial", "rgba(0, 0, 0, 1)")]
	);
		
	changeBrowserWebPage(game.browsers["introduction_computer_browser"], "1");

	// Phone screens.
	game.screens["phoneAppStoreButtonScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneAppStoreButtonScreenBackground", 0, 0, 173, 291, 0, "rgba(255,255,255,1)"), [new Button ("introduction_app_store_button", 10, 10, 163, 281, 2, "Visit the APP Store!", "18px Georgia", "rgba(0,0,0,1)")], [], []);
	game.screens["phoneNotYetActivatedScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneNotYetActivatedScreenBackground", 0, 0, 173, 291, 0, "rgba(255,255,255,1)"), [], [], [new Text ("phone_not_yet_activated_message", 10, 10, 173, 291, 1, "Not yet activated. To place phone calls, send messages, or install apps, please register your phone online.", "10px Georgia", "rgba(0,0,0,1)")]);

	game.introduction_variables = {
		finished_registration:false,
		forwarded_phishing_email:false,
		fell_for_scam:false,
		mfa_enabled:false,
		mfa_code:"0",
		player_mfa_code_entry:"#####"
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

function introduction_onclick (button, changeMainScreen, showDialog, closeDialog, displayBrowser, changeBrowserWebPage, closeBrowser, changePhoneScreen, resizeCanvas, loadScenes, hidePhone, showPhone, pushPhoneAlert, browser, vars) {
	if (button == "introduction_dorm_room_computer") {
		changeMainScreen("introduction_computer");
		return true;
	} else if (button == "dialog_introduction_dialog_Begin.") {
		closeDialog();
		return true;
	} else if  (button == "introduction_computer_monitor") {
		displayBrowser ("introduction_computer_browser");
		return true;
	} else if (button == "introduction_registration_1_continue_button") {
		changeBrowserWebPage(browser, "2");
		return true;
	} else if (button == "introduction_registration_2_continue_button") {
		changeBrowserWebPage(browser, "3");
		return true;
	} else if (button == "mfa_no_button") {
		vars.finished_registration = true;
		vars.mfa_enabled = false;
		changePhoneScreen("phoneAppStoreButtonScreen");
		changeBrowserWebPage(browser, "4");
		return true;
	} else if (button == "mfa_yes_button") {
		// Generate an MFA code
		vars.mfa_code = Math.random().toString(10).substring(2,7) // Note: it appears to be okay if the last index happens to be out of bounds.
		pushPhoneAlert("To finish setting up Multi-factor authentication, enter this code when prompted: " + vars.mfa_code);
		changeBrowserWebPage(browser, "3b");
		return true;
	} else if (button == "mfa_cancel_button") {
		changeBrowserWebPage(browser, "3");
		return true;
	} else if (button == "mfa_confirm_button") {
		if (vars.mfa_code == vars.player_mfa_code_entry) {
			vars.finished_registration = true;
			vars.mfa_enabled = true;
			changePhoneScreen("phoneAppStoreButtonScreen");
			changeBrowserWebPage(browser, "4");
		} else {
			// TODO if code is incorrect, need to display something and prompt user to re-enter code.
		}
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
	} else if (button == "bad_reply") {
		hidePhone();
		showDialog("intro_bad_reply");
		return true;
	} else if (button == "bad_forward") {
		hidePhone();
		showDialog("intro_forward");
		return true;
	} else if (button == "dialog_intro_forward_Yes.") {
		if (vars.forwarded_phishing_email == false) {
			hidePhone();
			closeDialog();
			vars.forwarded_phishing_email = true;
			return true;
		} else {
			hidePhone();
			closeDialog();
			showDialog("intro_already_forwarded");
			return true;
		}
	} else if (button == "dialog_intro_already_forwarded_Continue.") {
		hidePhone();
		closeDialog();
		return true;
	} else if (button == "dialog_intro_forward_No.") {
		hidePhone();
		closeDialog();
		return true;
	} else if (button == "dit_reminder") {
		changeMainScreen("dit_email");
		hidePhone();
		return true;
	} else if (button == "dit_reply" || button == "dit_forward" || button == "good_reply" || button == "good_forward") {
		hidePhone();
		showDialog("intro_unneeded_reply");
		return true;
	} else if (button == "dialog_intro_unneeded_reply_Continue.") {
		hidePhone();
		closeDialog();
		return true;
	} else if (button == "bad_link" || button == "dialog_intro_bad_reply_Yes.") {
		vars.fell_for_scam = true;
		closeDialog();
		showDialog("introduction_phone_dialog_1a");
		hidePhone();
		return true;
	} else if (button == "dialog_intro_bad_reply_No.") {
		closeDialog();
		hidePhone();
		return true;
	} else if (button == "good_link") {
		showDialog("introduction_phone_dialog_1b");
		hidePhone;
		return true;
	} else if (button == "bad_inbox" || button == "good_inbox" || button == "dit_inbox") {
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
	} else if (name == "mfa_code_text_entry") {
		game.introduction_variables.player_mfa_code_entry = value;
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
