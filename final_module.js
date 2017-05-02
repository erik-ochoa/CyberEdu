function load_final_module (game) {

	game.final_module_variables = {
		router_pwd_entry:"abcdef",
		ssid_entry:"ssidabc",
		changed_ssid:false,
		changed_pwd:false,
		configured_router:false
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

	game.webpages["http://192.168.0.1/wireless"] = new Screen (0, 70, 0, new Rectangle ("router_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("change_ssid", 310, 210, 490, 240, 2, "Change SSID", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("set_pwd", 310, 260, 490, 290, 2, "Set Password", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("finish_secure", 360, 400, 435, 430, 2, "Finish", "28px Arial", "rgba(0,0,0,1)")],
	[],
	[new Text ("router_name", 200, 55, 720, 85, 2,     "Elijah's Router (Unlocked/Open)")]);

	game.webpages["http://192.168.0.1/wireless2"] = new Screen (0, 70, 0, new Rectangle ("router_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("change_ssid", 310, 210, 490, 240, 2, "Change SSID", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("set_pwd", 310, 260, 490, 290, 2, "Set Password", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("finish_secure", 360, 400, 435, 430, 2, "Finish", "28px Arial", "rgba(0,0,0,1)")],
	[],
	[];
	//not sure how to reflect the newly changed SSID on the webpage
	//[new Text ("router_name", 200, 55, 720, 85, 2,     game.final_modules_variables.ssid_entry)]);

	game.webpages["http://192.168.0.1/wireless/ssid"] = new Screen (0, 70, 0, new Rectangle ("router_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("ssid_finish_button", 100, 200, 200, 300, 2,"Save and Go Back >", "18px Arial", "rgba(0,0,0,1)")],
	[new Button ("ssid_page_entry", 100, 130, 500, 200, 2, "********", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("router_instruction_enter_ssid_", 100, 100, 500, 150, 1, "Enter your new SSID:", "24px Arial", "rgba(0,0,0,1)")]);

	game.webpages["http://192.168.0.1/wireless/password"] = new Screen (0, 70, 0, new Rectangle ("router_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("router_password_finish_button", 100, 200, 200, 300, 2,"Save and Go Back >", "18px Arial", "rgba(0,0,0,1)")],
	[new Button ("router_password_entry", 100, 130, 500, 200, 2, "********", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("router_instruction_enter_password_", 100, 100, 500, 150, 1, "Enter your new password:", "24px Arial", "rgba(0,0,0,1)")]);

	game.dialogs["final_partner_dialog"] = new Dialog ("final_partner_dialog", game.partner_name, "I think you should click on your password and change it. It might be too long or still contain Eli or Elijah", ["Okay."]);
}

function final_module_text_field_edit (name, value, game) {
	if (name == "ssid_page_entry") {
		game.final_module_variables.ssid_entry = value;
		return true;
	} else if (name == "router_password_entry") {
		game.final_module_variables.router_pwd_entry = value;
		return true;
	} else {
		return false;
	}
}

function final_module_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, removeElementFromScreen, playVideo, addToTodoList, removeFromTodoList, removeAllAtLocationFromTodoList, markAsComplete, checkForGameCompletion, triggerEmailHack, returnToPlayerOffice, vars, game) {
	//handle if (button == go_to_final_module) like we did in other modules??

	if (button == "final_router") {
		changeMainScreen("final_router_box");
		return true;
	} else if (button == "router_cancel") {
		changeMainScreen("final_room");
		return true;
	} else if (button == "router_configure") {
		if (!vars.configured_router) {
			displayBrowser("final_browser");
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless");
			return true;
		} else {
			return true;
		}
	} else if (button == "browser-x" || button == "browser-minimize") {
		closeBrowser(false);
		return true;
	} else if (button == "change_ssid") {
		if (!vars.changed_ssid) {
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless/ssid");
			return true;
		} else {
			return true;
		}
	} else if (button == "ssid_finish_button") {
		if (vars.ssid_entry.length < 28) {
			if (!vars.ssid_entry.includes("Elijah")) {
				changeBrowserWebPage(browser, "http://192.168.0.1/wireless2");
				vars.changed_ssid = true;
				return true;
			} else {
				return true;
			}
		} else {
			showDialog("final_partner_dialog");
			return true;
		}
	} else if (button == "dialog_final_partner_dialog_Okay.") {
		closeDialog();
		return true;
	} else if (button == "set_pwd") {
		if (!vars.changed_pwd) {
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless/password");
			return true;
		} else {
			return true;
		}
	} else if (button == "router_password_finish_button") {
		if (vars.changed_ssid) {
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless2");
			vars.changed_pwd = true;
			return true;
		} else {
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless");
			vars.changed_pwd = true;
			return true;
		}
	} else if (button == "finish_secure") {
		if (vars.changed_ssid && vars.changed_pwd) {
			changeMainScreen("final_room");
			closeBrowser(false);
			vars.configured_router = true;
			return true;
		} else if (!vars.changed_ssid || !vars.changed_pwd) {
			return true;
		}
	} else {
		return false;
	}
}
