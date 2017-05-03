function load_final_module (game) {

	game.final_module_variables = {
		final_router_pwd_entry:"abcdef",
		final_ssid_entry:"ssidabc",
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
	} else {
		return false;
	}
}
