function load_introduction (game, changeBrowserWebPage, PHONE_SCREEN_LAYER) {
	game.screens["introduction_dorm_room"] = new Screen (0, 0, 0, new Image ("image/dorm_room", 0, 0, 0), [new Button ("introduction_dorm_room_computer", 824, 211, 964, 340, 0)], [], [/*Extras*/])

	game.screens["introduction_computer"] = new Screen (0, 0, 0, new Image ("image/dorm_room/computer", 0, 0, 0), [
		new Button ("introduction_computer_monitor", 435, 172, 664, 302, 0),
		new Button ("introduction_computer_monitor", 682, 228, 829, 460, 0)
	], [], []);

	game.screens["introduction_transition"] = new Screen (0, 0, 0, new Animation ("animation/dorm_room/transition", 0, 0, 0, true), [], [], []);

	game.screens["introduction_outside_mall"] = new Screen (0, 0, 0, new Image ("image/mallexterior", 0, 0, 0), [], [] ,[]);

	game.screens["intro_email"] = new Screen (0, 0, 0, new Image ("image/emailinbox", 0, 0, 0, 0.35),
	[new Button ("confirmation", 350, 200, 800, 230, 2, "VR Simulation Training", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("caps_confirmation", 350, 152, 850, 182, 2, "COMPLETE FORM IMMEDIATELY", "22px Arial", "rgba(0,0,0,1)")
	], [], []);

	game.screens["good_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35),
	[new Button ("good_link", 285, 375, 665, 395, 1, "http://login.umd.edu/register/confirmation?", "20px Arial", "rgba(6,69,173,1)"),
	new Button ("good_inbox", 25, 95, 160, 130, 1)], [],
	[new Text ("good_subject", 285, 100, 645, 130, 1, "VR Simulation Training", "24px Arial", "rgba(0,0,0,1)"),
	new Text ("good_sender", 350, 140, 790, 170, 1, "Sent From: dit@umd.edu at 12:30PM", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_dear", 285, 190, 645, 220, 1, "Welcome!", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_please", 285, 235, 980, 255, 1, "Thank you for deciding to intern with the Division of IT here at UMD.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_aup", 285, 270, 980, 300, 1, "We ask that all of our new interns complete our new VR training module.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_aup_2", 285, 305, 980, 335, 1, "There, we will test your knowledge in a variety of cybersecurity-related topics.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_disregard", 285, 350, 980, 370, 1, "Go ahead, put on your VR headset and click the link below to begin!", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_disregard_2", 285, 430, 980, 460, 1, "-UMD Division of IT", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("good_reply", 850, 140, 900, 170, 1, "Reply", "18px Arial", "rgba(0,0,0,1)"),
	new Text ("good_forward", 925, 140, 1000, 170, 3, "Forward", "18px Arial", "rgba(0,0,0,1)"),
	new Rectangle ("reply_bg", 845, 140, 900, 165, 2, "rgba(0,0,255,0.1)"),
	new Rectangle ("forward_bg", 920, 140, 995, 165, 2, "rgba(0,0,255,0.1)"),
	new Rectangle ("inbox_bg", 20, 95, 165, 135, 2, "rgba(0,0,255,0.1)")
	]);

	game.screens["bad_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35),
	[new Button ("bad_link", 285, 545, 580, 575, 1, "http://it-it.registration.payroll.com", "20px Arial", "rgba(6,69,173,1)"),
	new Button ("bad_inbox", 25, 95, 160, 130, 1),
	new Button ("bad_forward", 925, 140, 1000, 170, 3, "Forward", "18px Arial", "rgba(0,0,0,1)")], [],
	[new Text ("bad_subject", 285, 100, 735, 130, 1, "COMPLETE FORM IMMEDIATELY", "22px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_sender", 350, 140, 820, 170, 1, "Sent From: ti-itsupp@gmail.com at 12:34PM", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_dear", 285, 190, 645, 220, 1, "Dear Friend,", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please", 285, 245, 980, 265, 1, "We have noticed that you are missing key pay roll empolyment", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please_2", 285, 270, 980, 290, 1, "documents in regards to your new position, so", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_please_3", 285, 295, 980, 325, 1, "please use the link below to fill them out.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup", 285, 350, 980, 370, 1, "In order to continue processing your employment, we need", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup_2", 285, 375, 980, 405, 1, "you to take immediate action to fill out these forms.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_aup_3", 285, 420, 980, 450, 1, "Otherwise, you will be terminated.", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_disregard", 285, 465, 980, 495, 1, "Thank you for choosing TI-IT Solutions", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_disregard_2", 285, 500, 980, 530, 1, "Online Employee Form Advisor -TI-IT Solutions Team", "20px Arial", "rgba(0,0,0,1)"),
	new Text ("bad_reply", 850, 140, 900, 170, 1, "Reply", "18px Arial", "rgba(0,0,0,1)"),
	new Rectangle ("reply_bg", 845, 140, 900, 165, 2, "rgba(0,0,255,0.1)"),
	new Rectangle ("forward_bg", 920, 140, 995, 165, 2, "rgba(0,0,255,0.1)"),
	new Rectangle ("inbox_bg", 20, 95, 165, 135, 2, "rgba(0,0,255,0.1)")
	]);

	game.dialogs["introduction_dialog"] = new Dialog ("introduction_dialog", "", "Finally back from that 4 hour long meeting. Amy said that they were going email me with instructions on starting the VR training. I wonder if she found the time yet.", ["Begin."]);
	game.dialogs["introduction_get_my_apps"] = new Dialog ("introduction_get_my_apps", "", "Sweet, she sent the email. Let's take a look and see how long this will take. Hmmm there seems to be two emails from the Division of IT.", ["Let's go!"]);
	game.dialogs["introduction_phone_dialog_1a"] = new Dialog ("introduction_phone_dialog_1a", "Voice", "Congratulations! You just became a statistic by failing your first test, the classic phishing scam. Don't worry though, a lot of our first-time interns fall for this. Let's see if you'll do better on our other tests. Put on the VR headset when ready to continue your training.", ["Continue."]);
	game.dialogs["introduction_phone_dialog_1b"] = new Dialog ("introduction_phone_dialog_1b", "Voice", "Congratulations on passing our first test. You would be surprised how many of our interns fall for that phishing scam test. You might be able to pull this off.", ["Continue."]);
	game.dialogs["introduction_forward"] = new Dialog ("introduction_forward", "", "Forward this email to spam@umd.edu?", ["Yes.", "No."]);
	game.dialogs["introduction_must_enter_password"] = new Dialog("introduction_must_enter_password", "", "You must enter a password", ["Okay."]);
	game.dialogs["introduction_incorrect_mfa_code"] = new Dialog("introduction_incorrect_mfa_code", "", "Incorrect authentication code entered. Try again.", ["Okay."]);

	game.browsers["introduction_computer_browser"] = new Browser ();

	game.webpages["1"] = new Screen (0, 70, 0, new Rectangle ("introduction_registration_1_background", 0, 0, 800, 600, 0, "rgba(255,255,255,1)"), [
		new Button ("introduction_registration_1_continue_button", 500, 430, 700, 530, 1, "Continue", "18px Arial", "rgba(0,0,255,1)")], [], [
		new Text ("introduction_registration_1_instructions_text", 100, 50, 700, 430, 1, "Congratulations on your acceptance into the Division of Information Technology (DIT) student internship program. All DIT interns are required an email account on the department's email server to be used for work purposes. To begin the process of creating this account, press the continue button at the bottom of this page.", "14px Arial", "rgba(0,0,0,1)")
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
	
	game.webpages["2b"] = new Screen(0, 70, 0, new Rectangle ("introduction_registration_2b_background", 0, 0, 800, 600, 0, "rgba(255,255,255,1)"),
		[ /*Buttons */	
			new Button ("introduction_registration_2b_continue_button", 500, 430, 700, 530, 1, "Continue", "18px Arial", "rgba(0,0,255,1)")
		], [ /* Text Fields */
			new Button ("introduction_password_text_entry", 100, 100, 750, 150, 3, "", "24px Arial", "rgba(0,0,0,1)", "Enter a password...")
		], [ /* Extras */
			new Text("introduction_registration_create_password", 50, 50, 750, 100, 1, "Create a password for your account:", "18px Arial",	"rgba(0,0,0,1)"),
			new Rectangle("introduction_registration_password_entry_outline", 98, 98, 752, 152, 1, "rgba(0,0,0,1)"),
			new Rectangle("introduction_registration_password_entry_fill", 100, 100, 750, 150, 2, "rgba(255,255,255,1)")
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

	game.webpages["5"] = new Screen (0, 70, 0, new Rectangle ("introduction_phished", 0, 0, 800, 600, 0, 'rgba(255,255,255,1)'),
		[], [],
		[new Image("image/bademail", 170, 170, 1, 0.3),
		new Text ("introduction_phishing_instructions", 50, 50, 750, 150, 1, "You've just been phished. But don't worry, we just want you to watch out for suspicious cues like unverified email accounts, typos, harsh/extreme deadlines. Now, close this window and forward that email to spam@umd.edu.", "18px Times", "rgba(0, 0, 0, 1)")]
	);

	game.webpages["6"] = new Screen (0, 70, 0, new Rectangle ("introduction_phished", 0, 0, 800, 600, 0, 'rgba(255,255,255,1)'),
		[], [],
		[new Image("image/bademail", 170, 170, 1, 0.3),
		new Text ("introduction_phishing_instructions", 50, 50, 750, 150, 1, "It looks like you simply ignored that phishing email in your Inbox. Close this window and forward that email to spam@umd.edu. After you forward it, you can click the link again to finally begin your training.", "18px Times", "rgba(0, 0, 0, 1)")]
	);

	changeBrowserWebPage(game.browsers["introduction_computer_browser"], "1");

	// Phone screens.
	game.screens["phoneAppStoreButtonScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneAppStoreButtonScreenBackground", 0, 0, 173, 291, 0, "rgba(255,255,255,1)"), [new Button ("introduction_app_store_button", 10, 10, 163, 281, 2, "Visit the APP Store!", "18px Georgia", "rgba(0,0,0,1)")], [], []);
	game.screens["phoneNotYetActivatedScreen"] = new Screen (0, 0, PHONE_SCREEN_LAYER, new Rectangle("phoneNotYetActivatedScreenBackground", 0, 0, 173, 291, 0, "rgba(255,255,255,1)"), [], [], [new Text ("phone_not_yet_activated_message", 10, 10, 173, 291, 1, "Not yet activated. To place phone calls, send messages, or install apps, please start the VR training.", "10px Georgia", "rgba(0,0,0,1)")]);


	game.introduction_variables = {
		finished_registration:false,
		forwarded_phishing_email:false,
		mfa_enabled:false,
		mfa_code:"0",
		player_mfa_code_entry:"#####",
		clicked_bad_link:false,
		ignored_bad_email:false,
		passwords_video_played:false, 
		phishing_video_played:false,
		entered_password:false,
		score:0
	};
}

function load_introduction_part2 (game) {
	game.dialogs["introduction_phone_dialog_2"] = new Dialog ("introduction_phone_dialog_2", game.player_name, "Where the heck am I?", ["Next."]);
	game.dialogs["introduction_phone_dialog_3"] = new Dialog ("introduction_phone_dialog_3", "Voice", "Welcome to cyberspace. Here, you'll hopefully learn a few things about computers and other electronic devices.", ["Next."]);
	game.dialogs["introduction_phone_dialog_4"] = new Dialog ("introduction_phone_dialog_4", game.player_name, "And you are?", ["Next."]);
	game.dialogs["introduction_phone_dialog_5"] = new Dialog ("introduction_phone_dialog_5", "Voice", "This is the Virtual Reality (VR) System speaking.", ["Next."]);
	game.dialogs["introduction_phone_dialog_6"] = new Dialog ("introduction_phone_dialog_6", game.player_name, "How do I get out of here?", ["Next."]);
	game.dialogs["introduction_phone_dialog_7"] = new Dialog ("introduction_phone_dialog_7", "Voice", "To complete your training an return to the living world, you'll have to complete a series of training exercises that we've designed for you. However, you may pause your training and come back at anytime - if you leave this webpage, your progress will automatically be saved.", ["Next."]);
	game.dialogs["introduction_phone_dialog_8"] = new Dialog ("introduction_phone_dialog_8", "Voice", "By the way, your first challenge starts now. It's quite a big world in here - you'll need to acquire a map to find your way around.", ["Continue."]);
}

function introduction_onclick (button, changeMainScreen, showDialog, closeDialog, displayBrowser, changeBrowserWebPage, closeBrowser, changePhoneScreen, resizeCanvas, loadScenes, hidePhone, showPhone, pushPhoneAlert, playVideo, browser, vars) {
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
		displayBrowser ("introduction_computer_browser");
		return true;
	} else if (button == "introduction_registration_1_continue_button") {
		changeBrowserWebPage(browser, "2");
		return true;
	} else if (button == "introduction_registration_2_continue_button") {
		changeBrowserWebPage(browser, "2b");
		return true;
	}  else if (button == "introduction_registration_2b_continue_button") {
		if (!vars.entered_password) {
			showDialog("introduction_must_enter_password");
		} else { 
			if (!vars.passwords_video_played) {
				vars.passwords_video_played = true;
				playVideo("video/passwords");
			}
			changeBrowserWebPage(browser, "3");
		}
		return true;
	} else if (button == "dialog_introduction_must_enter_password_Okay.") {
		closeDialog();
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
			showDialog("introduction_incorrect_mfa_code");
		}
		return true;
	} else if (button == "dialog_introduction_incorrect_mfa_code_Okay.") {
		closeDialog();
		return true;
	} else if (button == "introduction_app_store_button") {
		showDialog("introduction_phone_dialog_1");
		return true;
	} else if (button == "browser-x" || button == "browser-minimize") {
		if (vars.finished_registration) {
			if (vars.clicked_bad_link == true || vars.ignored_bad_email == true) {
				closeBrowser(false);
				hidePhone();
				changeMainScreen("intro_email");
				return true;
			} else {
				showDialog("introduction_get_my_apps");
				return true; // Consume this event to leave the browser open, until the dialog is processed.
			}
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
		vars.clicked_bad_link = true;
		changeBrowserWebPage(browser, "5");
		displayBrowser("introduction_computer_browser");
		hidePhone();
		return true;
	} else if (button == "good_link") {
		if (vars.forwarded_phishing_email == true) {
			if (!vars.phishing_video_played) {
				vars.phishing_video_played = true;
				playVideo("video/phishing");
			}
			
			if (vars.clicked_bad_link == false) {
				showDialog("introduction_phone_dialog_1b"); //passed
				hidePhone();
				return true;
			} else {
				showDialog("introduction_phone_dialog_1a"); //failed
				hidePhone();
				return true;
			}
		} else { //ignored phishing email
			vars.ignored_bad_email = true;
			changeBrowserWebPage(browser, "6");
			displayBrowser("introduction_computer_browser");
			hidePhone();
			return true;
		}
	} else if (button == "bad_forward") {
		showDialog("introduction_forward");
		hidePhone();
		return true;
	} else if (button == "dialog_introduction_forward_Yes.") {
		vars.forwarded_phishing_email = true;
		closeDialog();
		hidePhone();
		return true;
	} else if (button == "dialog_introduction_forward_No.") {
		closeDialog();
		hidePhone();
		return true;
	} else if (button == "bad_inbox" || button == "good_inbox") {
		changeMainScreen("intro_email");
		hidePhone();
		return true;
	} else if (button == "dialog_introduction_phone_dialog_1a_Continue." || button == "dialog_introduction_phone_dialog_1b_Continue.") {
		// Calculate the player's score for this module. (out of 30)
		if (vars.clicked_bad_link) {
			vars.score = 15;
		} else if (vars.ignored_bad_email) {
			vars.score = 25;
		} else {
			vars.score = 30;
		}
	
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
	} else if (button == "dialog_introduction_phone_dialog_8_Continue.") {
		closeDialog();
		changePhoneScreen("phoneHomeScreen");
		showPhone();
		changeMainScreen("mall_scene");
		return true;
	} else {
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
	} else if (name == "introduction_password_text_entry") {
		// Sending this value here is actually insecure, since it is transmitted in the clear.
		game.introduction_variables.entered_password = true;
		// Don't store this value in the game object either, to avoid storing this information in plaintext inside the game JSON object.
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
