function load_final_module (game) {

	game.final_module_variables = {
		final_router_pwd_entry:"abcdef",
		final_ssid_entry:"ssidabc",
		changed_ssid:false,
		changed_pwd:false,
		configured_router:false,
		played_cd: false
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
	[new Button ("final_ssid_page_entry", 100, 130, 500, 200, 2, "********", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("final_router_instruction_enter_ssid", 100, 100, 500, 150, 1, "Enter your new SSID:", "24px Arial", "rgba(0,0,0,1)")]);

	game.webpages["http://192.168.1.1/wireless/password"] = new Screen (0, 70, 0, new Rectangle ("router_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("final_router_password_finish", 100, 200, 200, 300, 2,"Save and Go Back >", "18px Arial", "rgba(0,0,0,1)")],
	[new Button ("final_router_password_entry", 100, 130, 500, 200, 2, "********", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("final_router_instruction_enter_password", 100, 100, 500, 150, 1, "Enter your new password:", "24px Arial", "rgba(0,0,0,1)")]);

	game.dialogs["final_partner_dialog"] = new Dialog ("final_partner_dialog", game.partner_name, "I think you should click on your password and change it. It might be too long or still contain Eli or Elijah", ["Okay."]);
	game.dialogs["final_partner_dialog_2"] = new Dialog("final_partner_dialog_2", game.partner_name, "That isn't a very good idea. I doubt a local musician created a brand new audio format. This is probably trying to autorun a malicious program. I think it would be best if we removed it.", ["Continue."]);
	game.dialogs["final_partner_dialog_3"] = new Dialog("final_partner_dialog_3", game.partner_name, "That is a good idea. We are not sure why we need to install a new, custom music player to play his music. I'm thinking this musician had different plans for us.", ["Continue."]);
	game.dialogs["final_partner_dialog_4"] = new Dialog("final_partner_dialog_4", game.partner_name, "Thats a good choice. Even though that guys music was pretty good, we shouldn't auto media from sources that we do not trust.", ["Continue."]);
	game.dialogs["final_partner_dialog_5"] = new Dialog("final_partner_dialog_5", game.partner_name, "Hey check it out, Its one of those new wireless printers! I heard this thing could do all sorts of cool things, supports dual band frequencies and allows for WPA2 network protocol. Thats strange, I was able to connect without entering a password. Maybe you should check it out.", ["Continue."]);
	game.dialogs["final_partner_dialog_6"] = new Dialog("final_partner_dialog_6", game.partner_name, "Great. Even for devices like wireless printers and Chromecast, you still shoudld set a password so unwanted guests can use your device, or view what you have been doing. Talk about an invasion of privacy.", ["Continue."]);

	game.dialogs["final_player_dialog"] = new Dialog("final_player_dialog", game.player_name, "Hmm. Isn't that the CD the struggling musician on the mall gave me? He sounded pretty good, maybe I should give it a listen.", ["Insert CD."]);
	game.dialogs["final_player_dialog_2"] = new Dialog("final_player_dialog_2", game.player_name, "Thats strange. The CD is trying to install its own custom music player. Maybe the audio is in an unique audio format or maybe its something else.", ["Install.", "Remove CD."]);
	game.dialogs["final_player_dialog_3"] = new Dialog("final_player_dialog_3", game.player_name, "There I changed the password.", ["Continue."]);
}

function final_module_text_field_edit (name, value, game) {
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

function final_module_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, displayBrowser, changeBrowserWebPage, closeBrowser, addElementToScreen, removeElementFromScreen, playVideo, addToTodoList, removeFromTodoList, removeAllAtLocationFromTodoList, markAsComplete, checkForGameCompletion, triggerEmailHack, returnToPlayerOffice, vars, browser, game) {
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
			if (!vars.final_ssid_entry.includes("Elijah")) {
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
	} else if(button == "final_CD") {
		showDialog("final_player_dialog");
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
	} else if(button == "dialog_final_partner_dialog_2_Continue.") {
		closeDialog();
		changeMainScreen("final_room");
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
		showDialog("final_player_dialog_3");
		return true;
	} else if(button == "dialog_final_player_dialog_3_Continue.") {
		closeDialog();
		showDialog("final_partner_dialog_6");
		return true;
	} else if(button == "dialog_final_partner_dialog_6_Continue.") {
		closeDialog();
		changeMainScreen("final_room");
		return true;
	}

	else {
		return false;
	}
}
