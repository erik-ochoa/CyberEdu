function load_police_station (game) {
	game.screens["office_lobby"] = new Screen(0, 0, 0, new Image("image/police_station/office_lobby", 0, 0, 0), [
		new Button ("police_station_door1", 25, 210, 143, 451, 1),
		new Button ("police_station_door2", 173, 210, 289, 451, 1),
		new Button ("police_station_door3", 317, 210, 436, 451, 1),
		new Button ("police_station_receptionist", 806, 293, 869, 421, 1)
	], [], [
		new Text ("police_station_nameplate1", 44, 233, 123, 253, 2, "P.D. Chief", "16px Arial", "rgba(0, 0, 0, 1)"),
		new Text ("police_station_nameplate2", 190, 233, 266, 253, 2, game.partner_name, "16px Arial", "rgba(0, 0, 0, 1)"),
		new Text ("police_station_nameplate3", 334, 233, 411, 253, 2, game.player_name, "16px Arial", "rgba(0, 0, 0, 1)")//,
		//new Image ("image/police_station/office_lobby/glass_wall", 0, 0, 3)
	]);
	
	game.screens["player_office"] = new Screen(0, 0, 0, new Image("image/police_station/player_office", 0, 0, 0), [
		new Button ("player_office_exit_door", 985, 260, 1122, 648, 1)
	], [] ,[]);
	
	game.dialogs["police_station_receptionist_dialog_1"] = new Dialog ("police_station_receptionist_dialog_1", "Receptionist", "Hello, " + game.player_name + ". Welcome to the police station. Here's your badge. Your new office is the door on the right. From here on out, You'll receive notifications of missions to complete via email on your phone.", ["Got it."]);
	game.dialogs["police_station_receptionist_dialog_2"] = new Dialog ("police_station_receptionist_dialog_2", "Receptionist", "How are you doing, " + game.player_name + "? Remember, you get notifications of missions to complete via email. Once you get a mission, use the map to travel to the location and solve the case.", ["I'm doing fine."]);	
	
	game.dialogs["police_station_error_dialog"] = new Dialog ("police_station_error_dialog", "Notice", "This area is still under construction, and isn't in the game yet. Sorry.", ["Okay."]);
	
	game.police_station_variables = {
		spoken_to_receptionist_once:false
	}
}

function police_station_onclick (button, changeMainScreen, resizeCanvas, sendMissionEmail, showDialog, closeDialog, vars) {
	if (button == "police_station_door3") {
		changeMainScreen("player_office");
		resizeCanvas(1308, 837);
		return true;
	} else if (button == "player_office_exit_door") {
		changeMainScreen("office_lobby");
		resizeCanvas(1152, 648);
		return true;
	} else if (button == "police_station_receptionist") {
		if (vars.spoken_to_receptionist_once) {
			showDialog("police_station_receptionist_dialog_2");
		} else {
			showDialog("police_station_receptionist_dialog_1");
		}
		return true;
	} else if (button == "dialog_police_station_receptionist_dialog_1_Got it.") {
		vars.spoken_to_receptionist_once = true;
		sendMissionEmail("coffee_shop");
		sendMissionEmail("apartment");
		sendMissionEmail("library");
		closeDialog();
		return true;
	} else if (button == "dialog_police_station_receptionist_dialog_2_I'm doing fine.") {
		closeDialog();
		return true;
	} /* Remove these two cases later!*/ else if (button == "police_station_door1" || button == "police_station_door2") {
		showDialog("police_station_error_dialog");
		return true;
	} /* Remove this case later! */else if (button == "dialog_police_station_error_dialog_Okay.") {
		closeDialog();
		return true;
	} else {
		return false;
	}
}