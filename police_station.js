function load_police_station (game) {
	game.screens["office_lobby"] = new Screen(0, 0, 0, new Image("image/police_station/office_lobby", 0, 0, 0), [
		new Button ("police_station_door1", 25, 210, 143, 451, 1),
		new Button ("police_station_door2", 173, 210, 289, 451, 1),
		new Button ("police_station_door3", 317, 210, 436, 451, 1),
		new Button ("police_station_receptionist", 806, 293, 869, 421, 1)
	], [], [
		new Text ("police_station_nameplate1", 44, 233, 123, 253, 2, "P.D. Chief", "16px Arial", "rgba(0, 0, 0, 1)"),
		new Text ("police_station_nameplate2", 190, 233, 266, 253, 2, game.partner_name, "16px Arial", "rgba(0, 0, 0, 1)"),
		new Text ("police_station_nameplate3", 334, 233, 411, 253, 2, game.player_name, "16px Arial", "rgba(0, 0, 0, 1)"),
		new Image ("image/police_station/office_lobby/glass_wall", 0, 0, 3)
	]);
	
	game.screens["player_office"] = new Screen(0, 0, 0, new Image("image/police_station/player_office", 0, 0, 0), [
		new Button ("player_office_exit_door", 985, 260, 1122, 648, 1)
	], [] ,[]);
}

function police_station_onclick (button, changeMainScreen, resizeCanvas) {
	if (button == "police_station_door3") {
		changeMainScreen("player_office");
		resizeCanvas(1308, 837);
		return true;
	} else if (button == "player_office_exit_door") {
		changeMainScreen("office_lobby");
		resizeCanvas(1152, 648);
		return true;
	} else {
		return false;
	}
}