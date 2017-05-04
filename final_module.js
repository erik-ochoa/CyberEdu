function load_final_module (game) {

	game.final_module_variables = {
		final_router_pwd_entry:"abcdef",
		final_ssid_entry:"Elijah's Router",
		changed_ssid:false,
		changed_pwd:false,
		configured_router:false,
		selected_external_hard_drive:false,
		system_backed_up:false,
		email_fixed:true // TODO Debugging: this portion not yet added.
	};

	game.browsers["final_browser"] = new Browser();

	//image size is 1152x648, so use that for resizeCanvas
	game.screens["final_room"] = new Screen (0, 0, 0, new Image ("image/final_room", 0, 0, 0), [
		new Button ("final_router", 780, 280, 820, 300, 0),
		new Button ("final_laptop", 830, 255, 895, 330, 0),
		new Button ("final_CD", 885, 342, 930, 357, 0),
		new Button ("final_printer", 935, 310, 1060, 365, 0)
	], [], []);

	game.screens["final_router_box"] = new Screen(0, 0, 0, new Image ("image/final_router", 0, 0, 0),
	[ new Button ("router_configure", 425, 342, 568, 390, 0),
		new Button ("router_cancel", 630, 342, 735, 390, 0)
	], [], []);

	game.webpages["http://192.168.1.1/wireless"] = new Screen (0, 70, 0, new Rectangle ("router_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("final_change_ssid", 310, 210, 490, 240, 2, "Change SSID", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("final_set_pwd", 310, 260, 490, 290, 2, "Set Password", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("final_finish", 360, 400, 435, 430, 2, "Finish", "28px Arial", "rgba(0,0,0,1)")],
	[],
	[new Text ("router_name", 200, 55, 720, 85, 2,     "Elijah's Router (Unlocked/Open)")]);

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
	[new Button ("final_router_password_entry", 100, 130, 500, 200, 2, "********", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("final_router_instruction_enter_password", 100, 100, 500, 150, 1, "Enter your new password:", "24px Arial", "rgba(0,0,0,1)")]);

	game.dialogs["final_partner_dialog"] = new Dialog ("final_partner_dialog", game.partner_name, "I think you should choose a different SSID. It might be too long or still contain Eli or Elijah", ["Okay."]);
	
	// Computer is not backed up.
	game.screens["final_computer_screen"] = new Screen(0, 0, 0, new Image("image/final_computer_screen/backup_required", 0, 0, 0), 
		[ /* Buttons */
			new Button ("final_computer_set_up_backup_button", 765, 464, 1066, 517, 1, "Set up backup", "18px Arial", "rgba(64,64,255,1)"),
			new Button ("final_computer_open_browser_button", 57, 200, 186, 290, 2),
			new Button ("final_computer_exit_button", 30, 555, 150, 593, 1, "Exit", "38px Times", "rgba(255,255,255,1)")
		], 
		[ /* Text Input Fields */], 
		[ /* Extras */
			new Rectangle("final_computer_highlight_google_chrome", 57, 220, 186, 290, 1, "rgba(216,255,0,0.30)"),
			new Text ("final_computer_screen_backup_message_header", 772, 434, 1059, 455, 1, "1 Important Message", "18px Arial Bold", "rgba(0,0,255,1)")
		]
	
	);
	
	game.screens["final_computer_screen_backup_done"] = new Screen(0, 0, 0, new Image("image/final_computer_screen/no_backup_warning", 0, 0, 0), 
		[
			new Button ("final_computer_open_browser_button", 57, 200, 186, 290, 2),
			new Button ("final_computer_exit_button", 30, 555, 150, 593, 1, "Exit", "38px Times", "rgba(255,255,255,1)")
		], [], 
		[
			new Rectangle("final_computer_highlight_google_chrome", 57, 220, 186, 290, 1, "rgba(216,255,0,0.30)"),
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
	
	game.dialogs["final_partner_dialog_2"] = new Dialog ("final_partner_dialog_2", game.partner_name, "We haven't fixed everything yet.", ["Okay."]);
}

function final_module_text_field_edit (name, value, game) {
	console.log("Final module text field edit received");
	console.log(name);
	console.log(value);
	if (name == "final_ssid_page_entry") {
		game.final_module_variables.final_ssid_entry = value;
		return true;
	} else if (name == "final_router_password_entry") {
		game.final_module_variables.final_router_pwd_entry = value;
		return true;
	} else {
		return false;
	}
}

function final_module_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, displayBrowser, changeBrowserWebPage, closeBrowser, addElementToScreen, removeElementFromScreen, showPhone, hidePhone, playVideo, addToTodoList, removeFromTodoList, removeAllAtLocationFromTodoList, markAsComplete, checkForGameCompletion, triggerEmailHack, returnToPlayerOffice, vars, browser, game) {
	if (button == 'go_to_dorm_room') {
		resizeCanvas(1152, 648);
		changeMainScreen("final_room");
		return false; // so this can be also be processed in server.js
	} else if (button == "final_router") {
		changeMainScreen("final_router_box");
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
		if (vars.changed_ssid) {
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
			return true;
		}
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
		return true;
	} else if (button == "final_computer_exit_button") {
		if (vars.system_backed_up && vars.email_fixed) {
			resizeCanvas(1152, 648);
			changeMainScreen("final_room");
			showPhone();
		} else {
			showDialog("final_partner_dialog_2");
		}
		return true;
	} else if (button == "dialog_final_partner_dialog_2_Okay.") {
		closeDialog();
		return true;
	} else {
		return false;
	}
}
