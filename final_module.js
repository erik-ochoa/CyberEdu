function load_final_module (game) {

	game.final_module_variables = {
		final_router_pwd_entry:"",
		final_ssid_entry:"Elijah's Router",
		printer_pwd_entry:"",
		changed_ssid:false,
		changed_pwd:false,
		configured_router:false,
		played_cd: false,
		player_printer: false,
		selected_external_hard_drive:false,
		system_backed_up:false,
		email_fixed:false,
		email_menu_down:false,
		email_mfa_enabled:false,
		email_recovery_phone_set:false,
		final_module_complete:false
	};

	game.browsers["final_browser"] = new Browser();

	//image size is 1152x648, so use that for resizeCanvas
	game.screens["final_room"] = new Screen (0, 0, 0, new Image ("image/final_room", 0, 0, 0), [
		new Button ("final_router", 780, 280, 820, 300, 0),
		new Button ("final_laptop", 830, 255, 895, 330, 0),
		new Button ("final_CD", 885, 342, 930, 357, 0),
		new Button ("final_printer", 935, 310, 1060, 365, 0),
		new Button ("final_elijah", 640, 120, 750, 535, 0)
	], [], []);

	game.screens["final_router_box"] = new Screen(0, 0, 0, new Image ("image/final_router", 0, 0, 0),
	[ new Button ("router_configure", 425, 342, 568, 390, 0),
		new Button ("router_cancel", 630, 342, 735, 390, 0)
	], [], []);

	game.screens["final_network_browser"] =  new Screen(0,0,0, new Image ("image/final_cpu_system", 0, 0, 0), 
		[new Button("apply_button", 345,399, 395, 415)], 
		[new Button("password_entry", 462, 300, 750, 328, 3, "", "20px Arial", "rgba(0,0,0,1)", "Password...")], 
		[new Text("network", 39, 159, 155, 220, 1, "Network", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("printer", 68, 217, 250, 250, 1, "GoodTech All-In-One Printer", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("label", 45, 89, 450, 200, 1, "Network > GoodTech All-In-One Printer", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("name", 336, 177, 1000, 220, 1, "Device Name: GoodTech All-In-One Printer", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("wifi", 345, 245, 430, 330, 1, "Signal Strength:", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("password", 345, 301, 390, 328,1, "Password",  "20px Arial", "rgba(0,0,0,1)"),
		 new Text("apply", 345, 395, 365, 415, 1, "Apply", "20px Arial", "rgba(0,0,0,1)"),
		 new Rectangle ("bar1", 430, 280, 445, 285, 2, "rgba(0,0,0,1)"),
		 new Rectangle ("bar2", 450, 265, 465, 285, 2, "rgba(0,0,0,1)"),
		 new Rectangle ("bar3", 470, 250, 495, 285, 2, "rgba(0,0,0,1)"),
		 new Rectangle("password_entry_outline", 460, 300, 752, 328, 1, "rgba(0,0,0,1)"),
		 new Rectangle("entry_fill", 462, 302, 750, 326, 2, "rgba(255,255,255,1)")]);


	game.screens["final_cpu_browser"] =  new Screen(0,0,0, new Image ("image/final_cpu_system", 0, 0, 0), 
		[new Button ("autorun_yes", 345, 280, 374, 302),
			new Button("autorun_no", 530, 280, 553, 302)], 
		[], 
		[new Text("this_pc", 39, 159, 155, 220, 1, "This PC", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("c_drive", 68, 217, 200, 250, 1, "C: Hard Drive", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("label", 45, 89, 375, 200, 1, "This PC > D: CD Drive", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("d_drive", 68, 258, 200, 320, 1, "D: CD Drive", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("prompt", 336, 177, 1000, 220, 1, "Do you want to Autorun D:Drive Julio's Fire Mixtape?", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("yes", 345, 280, 370, 330, 1, "Yes", "20px Arial", "rgba(0,0,0,1)"),
		 new Text("no", 530, 280, 574, 302, 1, "No", "20px Arial", "rgba(0,0,0,1)")]);

	game.webpages["http://192.168.1.1/wireless"] = new Screen (0, 70, 0, new Rectangle ("router_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("final_change_ssid", 310, 210, 490, 240, 2, "Change SSID", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("final_set_pwd", 310, 260, 490, 290, 2, "Set Password", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("final_finish", 360, 400, 435, 430, 2, "Finish", "28px Arial", "rgba(0,0,0,1)")],
	[],
	[new Text ("router_name", 200, 55, 720, 85, 2,     "Elijah's Router (Unlocked/Open)", "28px Arial", "rgba(0,0,0,1)")]);

	game.webpages["http://192.168.1.1/wireless2"] = new Screen (0, 70, 0, new Rectangle ("router_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("final_change_ssid_2", 310, 210, 490, 240, 2, "Change SSID", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("final_set_pwd_2", 310, 260, 490, 290, 2, "Set Password", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("final_finish_2", 360, 400, 435, 430, 2, "Finish", "28px Arial", "rgba(0,0,0,1)")],
	[],
	[]);
	//not sure how to reflect the newly changed SSID on the webpage
	//[new Text ("router_name", 200, 55, 720, 85, 2,     game.final_modules_variables.ssid_entry)]);

	game.webpages["http://192.168.1.1/wireless/ssid"] = new Screen (0, 70, 0, new Rectangle ("router_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("final_ssid_finish", 100, 200, 200, 300, 2,"Save and Go Back >", "18px Arial", "rgba(0,0,0,1)")],
	[new Button ("final_ssid_page_entry", 100, 130, 500, 200, 2, "Elijah's Router", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("final_router_instruction_enter_ssid", 100, 100, 500, 150, 1, "Enter your new SSID:", "24px Arial", "rgba(0,0,0,1)")]);

	game.webpages["http://192.168.1.1/wireless/password"] = new Screen (0, 70, 0, new Rectangle ("router_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("final_router_password_finish", 100, 200, 200, 300, 2,"Save and Go Back >", "18px Arial", "rgba(0,0,0,1)")],
	[new Button ("final_router_password_entry", 100, 130, 500, 200, 2, "", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("final_router_instruction_enter_password", 100, 100, 500, 150, 1, "Enter your new password:", "24px Arial", "rgba(0,0,0,1)")]);

	game.dialogs["final_partner_dialog_2"] = new Dialog("final_partner_dialog_2", game.partner_name, "That isn't a very good idea. I doubt a local musician created a brand new audio format. This is probably trying to autorun a malicious program. I think it would be best if we removed it.", ["Remove CD."]);
	game.dialogs["final_partner_dialog_3"] = new Dialog("final_partner_dialog_3", game.partner_name, "That is a good idea. We are not sure why we need to install a new, custom music player to play his music. I'm thinking this musician had different plans for us.", ["Continue."]);
	game.dialogs["final_partner_dialog_4"] = new Dialog("final_partner_dialog_4", game.partner_name, "Thats a good choice. Even though that guys music was pretty good, we shouldn't auto media from sources that we do not trust.", ["Continue."]);
	game.dialogs["final_partner_dialog_5"] = new Dialog("final_partner_dialog_5", game.partner_name, "Hey check it out, Its one of those new wireless printers! I heard this thing could do all sorts of cool things, supports dual band frequencies and allows for WPA2 network protocol. Thats strange, I was able to connect without entering a password. Maybe you should check it out.", ["Continue."]);
	game.dialogs["final_partner_dialog_6"] = new Dialog("final_partner_dialog_6", game.partner_name, "Great. Even for devices like wireless printers and Chromecast, you should still set a password so unwanted guests can't use your device, or view what you have been doing. Talk about an invasion of privacy.", ["Continue."]);

	game.dialogs["final_player_dialog_1"] = new Dialog("final_player_dialog", game.player_name, "Hmm. Isn't that the CD the struggling musician on the mall gave me? He sounded pretty good, maybe I should give it a listen.", ["Insert CD."]);
	game.dialogs["final_player_dialog_2"] = new Dialog("final_player_dialog_2", game.player_name, "Thats strange. The CD is trying to install its own custom music player. Maybe the audio is in an unique audio format or maybe its something else.", ["Install.", "Remove CD."]);
	game.dialogs["final_player_dialog_3"] = new Dialog("final_player_dialog_3", game.player_name, "There I changed the password.", ["Continue."]);
	game.dialogs["final_partner_dialog"] = new Dialog ("final_partner_dialog", game.partner_name, "I think you should choose a different SSID. It might be too long or still contain Eli or Elijah", ["Okay."]);
	
	game.dialogs["final_elijah_dialog_1"] = new Dialog ("final_elijah_dialog_1", "Elijah", "Everything is messed up. Please help me straighten out my cyber-life.", ["Will do."]);
	game.dialogs["final_elijah_dialog_2"] = new Dialog ("final_elijah_dialog_2", game.player_name, "I think we fixed everything. You should be good to go now. Best of luck.", ["Continue."]);
	game.dialogs["final_elijah_dialog_3"] = new Dialog ("final_elijah_dialog_3", "Elijah", "Thank you so much!", ["Continue."]);
	
	game.dialogs["final_vr_system_dialog"] = new Dialog ("final_vr_system_dialog", "Voice", "Well congratulations, " + game.player_name + ". You just completed the Division of Information Technology's intern training program. Hopefully you learned some skills to apply to the real world.", ["Okay."]);
	
	// Computer is not backed up.
	game.screens["final_computer_screen"] = new Screen(0, 0, 0, new Image("image/final_computer_screen/backup_required", 0, 0, 0), 
		[ /* Buttons */
			new Button ("final_computer_set_up_backup_button", 880, 494, 1095, 517, 1, "Set up backup", "18px Arial", "rgba(64,64,255,1)"),
			new Button ("final_computer_open_browser_button", 57, 200, 186, 290, 2),
			new Button ("final_computer_exit_button", 30, 555, 150, 593, 1, "Exit", "38px Times", "rgba(255,255,255,1)")
		], 
		[ /* Text Input Fields */], 
		[ /* Extras */
			makeGoogleChromeHighlightRectangle(),
			new Text ("final_computer_screen_backup_message_header", 772, 434, 1059, 455, 1, "1 Important Message", "18px Arial Bold", "rgba(0,0,255,1)"),
			new Text ("final_computer_screen_backup_message_description", 765, 464, 1066, 489, 1, "Your files are not being backed up.", "18px Arial", "rgba(0,0,0,1)")
		]
	
	);
	
	game.screens["final_computer_screen_backup_done"] = new Screen(0, 0, 0, new Image("image/final_computer_screen/no_backup_warning", 0, 0, 0), 
		[
			new Button ("final_computer_open_browser_button", 57, 200, 186, 290, 2),
			new Button ("final_computer_exit_button", 30, 555, 150, 593, 1, "Exit", "38px Times", "rgba(255,255,255,1)")
		], [], 
		[
			makeGoogleChromeHighlightRectangle()
		]
	);
	
	game.screens["final_computer_screen_setup_backup_dialog_1"] = new Screen(0, 0, 0, new Image("image/final_computer_screen/no_backup_warning", 0, 0, 0),
		[
			new Button ("final_computer_backup_location_external_hard_drive", 450, 225, 780, 265, 3, "External hard drive", "24px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_location_select_next", 700, 450, 740, 480, 3, "Next", "16px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_location_select_cancel", 750, 450, 790, 480, 3, "Cancel", "16px Times", "rgba(0,0,0,1)")
		],
		[],
		[
			new Rectangle("final_computer_screen_setup_backup_dialog_1_background", 400, 100, 800, 500, 0, "rgba(255,255,255,0.8)"),
			new Text ("final_computer_screen_setup_backup_title", 420, 100, 780, 130, 3, "Set up backup", "24px Arial", "rgba(0,0,0,1)"),
			new Text ("final_computer_screen_setup_backup_instructions", 420, 140, 780, 180, 3, "Select where you would like to save your backup: ", "18px Arial", "rgba(64,64,255,1)"),
			new Text ("final_computer_screen_setup_backup_destination", 450, 190, 780, 210, 3, "Backup destination", "12px Arial", "rgba(0,0,0,1)")
		]
	);
	
	game.screens["final_computer_screen_setup_backup_dialog_2"] = new Screen(0, 0, 0, new Image("image/final_computer_screen/no_backup_warning", 0, 0, 0),
		[
			new Button ("final_computer_backup_schedule_day_Saturday", 450, 205, 780, 230, 3, "Saturday 1 AM", "20px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_schedule_day_Sunday", 450, 230, 780, 255, 3, "Sunday 1 AM", "20px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_schedule_day_Monday", 450, 255, 780, 280, 3, "Monday 1 AM", "20px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_schedule_day_Tuesday", 450, 280, 780, 305, 3, "Tuesday 1 AM", "20px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_schedule_day_Wednesday", 450, 305, 780, 330, 3 , "Wednesday 1 AM", "20px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_schedule_day_Thursday", 450, 330, 780, 355, 3, "Thursday 1 AM", "20px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_schedule_day_Friday", 450, 355, 780, 380, 3, "Friday 1 AM", "20px Times", "rgba(0,0,0,1)"),
			new Button ("final_computer_backup_schedule_cancel", 730, 450, 790, 480, 3, "< Back", "16px Times", "rgba(0,0,0,1)")
		],
		[],
		[
			new Rectangle("final_computer_screen_setup_backup_dialog_2_background", 400, 100, 800, 500, 0, "rgba(255,255,255,0.8)"),
			new Text ("final_computer_screen_setup_backup_title", 420, 100, 780, 130, 3, "Set up backup", "24px Arial", "rgba(0,0,0,1)"),
			new Text ("final_computer_screen_setup_backup_instructions", 420, 140, 780, 180, 3, "Select regular backup time: ", "18px Arial", "rgba(64,64,255,1)"),
		]
	);
	
	var ERROR_STRING = "If you see this message, Jonathan Hansford wrote code that didn't work when he was in a huge rush.";
	
	game.screens["final_computer_screen_setup_backup_dialog_3"] = new Screen(0, 0, 0, new Image("image/final_computer_screen/no_backup_warning", 0, 0, 0),
		[
			new Button ("final_computer_backup_finished_okay", 575, 360, 625, 390, 3, "Close", "16px Times", "rgba(0,0,0,1)")
		], [], [
			new Rectangle("final_computer_screen_setup_backup_dialog_3_background", 400, 100, 800, 400, 0, "rgba(255,255,255,0.8)"),
			new Text ("final_computer_screen_setup_backup_title", 420, 100, 780, 130, 3, "Set up backup", "24px Arial", "rgba(0,0,0,1)"),
			new Text ("final_computer_screen_setup_backup_destination", 450, 220, 750, 310, 3, ERROR_STRING, "18px Times", "rgba(64,64,255,1)") // INVARIANT: This stays in the second position, always
		]
	);
	
	game.dialogs["final_partner_dialog_haven't_fixed_everything"] = new Dialog ("final_partner_dialog_haven't_fixed_everything", game.partner_name, "We haven't fixed everything yet.", ["Okay."]);
	// End computer not backed up sub-module.
	// Email account hacked (MFA portion)
	game.dialogs["final_partner_email_dialog"] = new Dialog ("final_partner_email_dialog", game.partner_name, "Look's like Elijah's email account has been compromised recently. We should enable MFA in the settings so that doesn't happen again.", ["Okay."]);	
	game.dialogs["final_partner_email_dialog_need_recovery_phone"] = new Dialog ("final_partner_email_dialog_need_recovery_phone", game.partner_name, "We'll need to add a recovery phone first.", ["Okay."]);
	
	game.dialogs["final_recovery_phone_dialog_1"] = new Dialog ("final_recovery_phone_dialog_1", game.player_name, "Hey Elijah, what is your phone number? I need to set a recovery phone for your email account.", ["Continue."]);
	game.dialogs["final_recovery_phone_dialog_2"] = new Dialog ("final_recovery_phone_dialog_2", "Elijah", "My phone number is 333-444-5555.", ["Got it, thanks."]);
	
	game.screens["final_module_email"] = new Screen(0, 0, 0, new Image ("image/emailbody", 0 , 0 , 0, 0.35), 
	[
		new Button("final_module_email_settings_button", 22, 22, 68, 58, 2),
		new Button("final_module_email_exit_button", 1065, 20, 1115, 55, 2, "Exit", "24px Arial", "rgba(255,255,255,1)")
	], [], [
		new Text ("final_email_subject", 285, 100, 645, 130, 1, "Unusual Account Activity Detected", "24px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_sender", 285, 140, 980, 170, 1, "Sent From: no-reply@accounts.google.com at 11:39AM", "20px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_line_1", 285, 190, 980, 250, 1, "New sign-in from Google Chrome on Linux.", "20px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_line_2", 285, 255, 980, 275, 1, "Hello Elijah,", "20px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_line_3", 285, 290, 980, 335, 1, "Your Google Account elijah1998@gmail.com was just used to sign in from Google Chrome on Linux.", "20px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_line_4", 285, 340, 980, 365, 1, "IP address: 86.106.103.73 [Bucharest, Romania].", "20px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_line_5", 285, 370, 980, 395, 1, "Sincerely,", "20px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_line_6", 285, 400, 980, 435, 1, "The Google Accounts Team", "20px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_reply", 850, 140, 900, 170, 1, "Reply", "18px Arial", "rgba(0,0,0,1)"),
		new Text ("final_email_forward", 925, 140, 1000, 170, 3, "Forward", "18px Arial", "rgba(0,0,0,1)"),
		new Rectangle ("final_email_reply_bg", 845, 140, 900, 165, 2, "rgba(0,0,255,0.1)"),
		new Rectangle ("final_email_forward_bg", 920, 140, 995, 165, 2, "rgba(0,0,255,0.1)"),
		new Rectangle ("final_email_highlight_settings", 22, 22, 68, 58, 1, "rgba(255,255,128,0.3)"),
		new Rectangle ("final_email_exit_button_background", 1065, 20, 1115, 55, 1, "rgba(39,132,199,1")
	]);

	game.screens["final_module_email_settings"] = new Screen(0, 0, 0, new Rectangle("empty_background", 0, 0, 1165, 600, 0, "rgba(255,255,255,0)"),
		[
			new Button ("final_email_menu_mfa_toggle_button", 290, 125, 385, 175, 6),
			new Button ("final_email_menu_set_recovery_phone_button", 245, 65, 385, 115, 6)
		], [], 
		[
			new Rectangle ("final_email_menu_block1", 23, 60, 391, 119, 5, "rgba(240, 240, 240, 1)"),
			new Rectangle ("final_email_menu_border1", 22, 59, 392, 120, 4, "rgba(0,0,0,1)"),
			new Rectangle ("final_email_menu_block2", 23, 121, 391, 179, 5, "rgba(240,240,240,1)"),
			new Rectangle ("final_email_menu_border2", 22, 120, 392, 180, 4, "rgba(0,0,0,1)"),
			new Text ("final_module_recovery_phone", 32, 65, 240, 115, 6, "Recovery Phone #: ", "24px Arial", "rgba(0,0,0,1)"),
			new Text ("final_module_recovery_phone_number", 240, 65, 385, 115, 6, "Not set", "24px Arial", "rgba(255,0,0,1)"), 
			new Text ("final_email_menu_mfa_text", 32, 125, 290, 175, 6, "2-Factor Authentication: ", "24px Arial", "rgba(0,0,0,1)"),
			new Text ("final_email_menu_mfa_status_text", 290, 125, 385, 175, 6, "Disabled", "24px Arial", "rgba(255,0,0,1)")
		]
		
		
	);
}

function makeGoogleChromeHighlightRectangle () {
	return new Rectangle("final_computer_highlight_google_chrome", 57, 220, 186, 290, 1, "rgba(216,255,0,0.30)");
}

function final_module_text_field_edit (name, value, game) {
	if (name == "final_ssid_page_entry") {
		game.final_module_variables.final_ssid_entry = value;
		return true;
	} else if (name == "final_router_password_entry") {
		game.final_module_variables.final_router_pwd_entry = value;
		return true;
	} else if (name == "password_entry") {
		game.final_module_variables.printer_pwd_entry = value;
		return true;
	} else {
		return false;
	}
}

function final_module_finish_if_complete (checkForGameCompletion, vars) {
	if (final_module_check_completion(vars)) {
		checkForGameCompletion();
	}
}

/* Returns true if the user has completed all the sub-modules, false otherwise. */
function final_module_check_completion (vars) {
	return vars.configured_router && vars.email_fixed && vars.system_backed_up && vars.played_cd && vars.player_printer;
}

function final_module_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, displayBrowser, changeBrowserWebPage, closeBrowser, addElementToScreen, removeElementFromScreen, removeButtonFromScreen, showPhone, hidePhone, playVideo, addToTodoList, removeFromTodoList, removeAllAtLocationFromTodoList, markAsComplete, checkForGameCompletion, triggerEmailHack, returnToPlayerOffice, vars, browser, game) {
	if (button == 'go_to_dorm_room') {
		resizeCanvas(1152, 648);
		changeMainScreen("final_room");
		return false; // so this can be also be processed in server.js
	} else if (button == "final_router") {
		if (!vars.configured_router) {
			changeMainScreen("final_router_box");
		}
		return true;
	} else if (button == "router_cancel") {
		changeMainScreen("final_room");
		return true;
	} else if (button == "router_configure") {
		if (!vars.configured_router) {
			displayBrowser("final_browser");
			changeBrowserWebPage(browser, "http://192.168.1.1/wireless");
			return true;
		} else {
			return true;
		}
	} else if (button == "browser-x" || button == "browser-minimize") {
		closeBrowser(false);
		return true;
	} else if (button == "final_change_ssid" || button == "final_change_ssid_2") {
		if (!vars.changed_ssid) {
			changeBrowserWebPage(browser, "http://192.168.1.1/wireless/ssid");
			return true;
		} else {
			return true;
		}
	} else if (button == "final_ssid_finish") {
		if (vars.final_ssid_entry.length < 28) {
			if (vars.final_ssid_entry.indexOf("Eli") == -1 && vars.final_ssid_entry.indexOf("eli") == -1) {
				// Should we use this?
				//addElementToScreen(game.webpages["http://192.168.1.1/wireless2"], new Text ("router_name", 200, 55, 720, 85, 2,  vars.final_ssid_entry, "28px Arial", "rgba(0,0,0,1)"));
				changeBrowserWebPage(browser, "http://192.168.1.1/wireless2");
				vars.changed_ssid = true;
				return true;
			} else {
				showDialog("final_partner_dialog");
				return true;
			}
		} else {
			showDialog("final_partner_dialog");
			return true;
		}
	} else if (button == "dialog_final_partner_dialog_Okay.") {
		closeDialog();
		return true;
	} else if (button == "final_set_pwd" || button == "final_set_pwd_2") {
		if (!vars.changed_pwd) {
			changeBrowserWebPage(browser, "http://192.168.1.1/wireless/password");
			return true;
		} else {
			return true;
		}
	} else if (button == "final_router_password_finish") {
		if (vars.final_router_pwd_entry.length <= 0) {
			return true;
		} else if (vars.changed_ssid) {
			changeBrowserWebPage(browser, "http://192.168.1.1/wireless2");
			vars.changed_pwd = true;
			return true;
		} else {
			changeBrowserWebPage(browser, "http://192.168.1.1/wireless");
			vars.changed_pwd = true;
			return true;
		}
	} else if (button == "final_finish" || button == "final_finish_2") {
		if (vars.changed_ssid && vars.changed_pwd) {
			changeMainScreen("final_room");
			closeBrowser(false);
			vars.configured_router = true;
			return true;
		} else if (!vars.changed_ssid || !vars.changed_pwd) {
			showDialog("final_partner_dialog_haven't_fixed_everything");
			return true;
		}
	} else if(button == "final_CD") {
		showDialog("final_player_dialog_1");
		return true;
	} else if (button == "dialog_final_player_dialog_Insert CD.") {
		closeDialog();
		changeMainScreen("final_cpu_browser");
		return true;
	} else if(button == "autorun_yes") {
		showDialog("final_player_dialog_2");
		return true;
	} else if(button == "dialog_final_player_dialog_2_Install.") {
		closeDialog();
		showDialog("final_partner_dialog_2");
		return true;
	} else if(button == "dialog_final_partner_dialog_2_Remove CD.") {
		closeDialog();
		showDialog("final_partner_dialog_3");
		vars.played_cd = true;
		return true;
	} else if(button == "dialog_final_player_dialog_2_Remove CD.") {
		closeDialog();
		showDialog("final_partner_dialog_3");
		return true;
	} else if(button == "dialog_final_partner_dialog_3_Continue.") {
		closeDialog();
		changeMainScreen("final_room");
		vars.played_cd = true;
		return true;
	} else if(button == "autorun_no") {
		showDialog("final_partner_dialog_4");
		return true;
	} else if (button == "dialog_final_partner_dialog_4_Continue.") {
		closeDialog();
		changeMainScreen("final_room");
		vars.played_cd = true;
		return true;
	} else if(button == "final_printer") {
		changeMainScreen("final_network_browser");
		showDialog("final_partner_dialog_5");
		return true;
	} else if(button == "dialog_final_partner_dialog_5_Continue.") {
		closeDialog();
		return true;
	} else if(button == "apply_button") {
		if (vars.printer_pwd_entry.length > 0) {
			showDialog("final_player_dialog_3");
			return true;
		} else {
			// Ignore click; user did not enter a password.
			return true;
		}
	} else if(button == "dialog_final_player_dialog_3_Continue.") {
		closeDialog();
		showDialog("final_partner_dialog_6");
		return true;
	} else if(button == "dialog_final_partner_dialog_6_Continue.") {
		closeDialog();
		changeMainScreen("final_room");
		vars.player_printer = true;
		return true;
	} else if (button == "final_laptop") {
		resizeCanvas(1200, 600);
		if (vars.system_backed_up) {
			changeMainScreen("final_computer_screen_backup_done");
		} else {
			changeMainScreen("final_computer_screen");
		}
		hidePhone();
		return true;
	} else if (button == "final_computer_set_up_backup_button") {
		changeMainScreen("final_computer_screen_setup_backup_dialog_1");
		return true;
	} else if (button == "final_computer_backup_location_external_hard_drive" ) {
		if (vars.selected_external_hard_drive) {
			vars.selected_external_hard_drive = false;
			var extras_list = game.screens["final_computer_screen_setup_backup_dialog_1"].extras;
			
			for (var i = 0; i < extras_list.length; i++) {
				if (extras_list[i].type == 'rectangle' && extras_list[i].name == "external_hard_drive_selection_rectangle") {
					removeElementFromScreen(game.screens["final_computer_screen_setup_backup_dialog_1"], extras_list[i]);
					i--;
				}
			}
		} else {
			vars.selected_external_hard_drive = true;
			addElementToScreen(game.screens["final_computer_screen_setup_backup_dialog_1"], new Rectangle ("external_hard_drive_selection_rectangle", 450, 225, 780, 265, 2, "rgba(0,0,192,1)"));
		}
		return true;
	} else if (button == "final_computer_backup_location_select_next" ) {
		if (vars.selected_external_hard_drive) {
			// On to second step:
			changeMainScreen("final_computer_screen_setup_backup_dialog_2");
			return true;
		} else {
			// Do nothing.
			return true;
		}
	} else if (button == "final_computer_backup_location_select_cancel") {
		changeMainScreen("final_computer_screen");
		return true;
	} else if (button.match(/final_computer_backup_schedule_day_.*/)) {
		var day_of_week = button.substring(35);
		game.screens["final_computer_screen_setup_backup_dialog_3"].extras[2].text = "Automatic backup schedule successfully set for " + day_of_week + " at 1:00 AM.";
		changeMainScreen("final_computer_screen_setup_backup_dialog_3");
		return true;
	} else if (button == "final_computer_backup_schedule_cancel") {
		changeMainScreen("final_computer_screen_setup_backup_dialog_1");
		return true;
	} else if (button == "final_computer_backup_finished_okay") {
		vars.system_backed_up = true;
		changeMainScreen("final_computer_screen_backup_done");
		return true;
	} else if (button == "final_computer_open_browser_button") {
		resizeCanvas(1165, 600);
		changeMainScreen("final_module_email");
		if (!vars.email_fixed) {
			showDialog("final_partner_email_dialog");
		}
		return true;
	} else if (button == "final_computer_exit_button") {
		if (vars.system_backed_up && vars.email_fixed) {
			resizeCanvas(1152, 648);
			changeMainScreen("final_room");
			showPhone();
		} else {
			showDialog("final_partner_dialog_haven't_fixed_everything");
		}
		return true;
	} else if (button == "dialog_final_partner_dialog_haven't_fixed_everything_Okay.") {
		closeDialog();
		return true;
	} else if (button == "dialog_final_partner_email_dialog_Okay.") {
		closeDialog();
		return true;
	} else if (button == "final_module_email_settings_button") {
		if (!vars.email_menu_down) {
			vars.email_menu_down = true;
			vars.email_menu_screen_index = game.screens["final_module_email"].extras.length;
			addElementToScreen(game.screens["final_module_email"], game.screens["final_module_email_settings"]);
		} else {
			vars.email_menu_down = false;
			removeElementFromScreen(game.screens["final_module_email"], game.screens["final_module_email"].extras[vars.email_menu_screen_index]);
		}
		return true;
	} else if (button == "final_module_email_exit_button") {
		resizeCanvas(1200, 600);
		if (!vars.system_backed_up) {
			changeMainScreen("final_computer_screen");
		} else {
			changeMainScreen("final_computer_screen_backup_done");
		}
		return true;
	} else if (button == "final_email_menu_mfa_toggle_button") {
		var extras_list = game.screens["final_module_email_settings"].extras;
		if (!vars.email_recovery_phone_set) {
			showDialog("final_partner_email_dialog_need_recovery_phone");
			return true;
		} else {			
			for (var i = 0; i < extras_list.length; i++) {
				if (extras_list[i].type == 'text' && extras_list[i].name == "final_email_menu_mfa_status_text") {
					var mfa_status_element = extras_list[i];
					removeElementFromScreen(game.screens["final_module_email_settings"], mfa_status_element);
					if (vars.email_mfa_enabled) {
						mfa_status_element.text = "Disabled";
						mfa_status_element.font_color = "rgba(255,0,0,1)";
						vars.email_mfa_enabled = false;
					} else {
						mfa_status_element.text = "Enabled";
						mfa_status_element.font_color = "rgba(0,255,0,1)";
						vars.email_mfa_enabled = true;
					}
					addElementToScreen(game.screens["final_module_email_settings"], mfa_status_element);		
					break; // Must bailout, to avoid encountering the same element again.
				}
			}
			
			var previously_fixed = vars.email_fixed;
			vars.email_fixed = vars.email_mfa_enabled && vars.email_recovery_phone_set;
			// If the email is fixed, remove the yellow highlight from Google Chrome on the main page.
			if (vars.email_fixed && !previously_fixed) {
				for (var i = 0; i < game.screens["final_computer_screen"].extras.length; i++) {
					if (game.screens["final_computer_screen"].extras[i].type == 'rectangle' && game.screens["final_computer_screen"].extras[i].name == 'final_computer_highlight_google_chrome') {
						removeElementFromScreen(game.screens["final_computer_screen"], game.screens["final_computer_screen"].extras[i]);
						i--;
					}
				} 
				for (var i = 0; i < game.screens["final_computer_screen_backup_done"].extras.length; i++) {
					if (game.screens["final_computer_screen_backup_done"].extras[i].type == 'rectangle' && game.screens["final_computer_screen_backup_done"].extras[i].name == 'final_computer_highlight_google_chrome') {
						removeElementFromScreen(game.screens["final_computer_screen_backup_done"], game.screens["final_computer_screen_backup_done"].extras[i]);
						i--;
					}
				}
				
			} else if (!vars.email_fixed && previously_fixed) {
				addElementToScreen(game.screens["final_computer_screen"], makeGoogleChromeHighlightRectangle());
				addElementToScreen(game.screens["final_computer_screen_backup_done"], makeGoogleChromeHighlightRectangle());
			}
			
			return true;
		}
	} else if (button == "final_email_menu_set_recovery_phone_button") {
		showDialog("final_recovery_phone_dialog_1");
	
		vars.email_fixed = vars.email_mfa_enabled && vars.email_recovery_phone_set;
		return true;
	} else if (button == "dialog_final_partner_email_dialog_need_recovery_phone_Okay." ) {
		closeDialog();
		return true;
	} else if (button == "dialog_final_recovery_phone_dialog_1_Continue.") {
		closeDialog();
		showDialog("final_recovery_phone_dialog_2");
		return true;
	} else if (button == "dialog_final_recovery_phone_dialog_2_Got it, thanks.") {
		
		// Get rid of the button on the recovery phone #.
		var button_list = game.screens["final_module_email_settings"].buttons;
		for (var i = 0; i < button_list.length; i++) {
			if (button_list[i].name == 'final_email_menu_set_recovery_phone_button') {
				removeButtonFromScreen(game.screens["final_module_email_settings"], button_list[i]);
				i--;
			}
		}
	
		// Now change the text of the recovery phone #.
		var extras_list = game.screens["final_module_email_settings"].extras;
		for (var i = 0; i < extras_list.length; i++) {
			if (extras_list[i].type == 'text' && extras_list[i].name == "final_module_recovery_phone_number") {
				var phone_number_element = extras_list[i];
				removeElementFromScreen(game.screens["final_module_email_settings"], phone_number_element);
				phone_number_element.text = "333-444-5555";
				phone_number_element.font_color = "rgba(0,255,0,1)";
				addElementToScreen(game.screens["final_module_email_settings"], phone_number_element);
				break; // Must bailout, to avoid encountering the same element again.
			}
		}	
		
		vars.email_recovery_phone_set = true;
		console.log(vars.email_recovery_phone_set);
		closeDialog();
		return true;
	} else if (button == "final_elijah") {
		if (final_module_check_completion(vars)) {
			showDialog("final_elijah_dialog_2");
			return true;
		} else {
			showDialog("final_elijah_dialog_1");
			return true;
		}
	} else if (button == "dialog_final_elijah_dialog_1_Will do.") {
		closeDialog();
		return true;
	} else if (button == "dialog_final_elijah_dialog_2_Continue.") {
		// This can only be reached if the player is done.
		closeDialog();
		showDialog("final_elijah_dialog_3");
		return true;
	} else if (button == "dialog_final_elijah_dialog_3_Continue.") {
		closeDialog();
		showDialog("final_vr_system_dialog");
		return true;
	} else if (button == "dialog_final_vr_system_dialog_Okay.") {
		closeDialog();
		vars.final_module_complete = true;
		returnToPlayerOffice();	
		checkForGameCompletion(); // This will finish the game.
		return true;
	} else {
		return false;
	}
}
