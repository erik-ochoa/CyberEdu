function load_mall(game) {
	game.screens["mall_scene"] = new Screen (0, 0, 0, new Image ("image/mallexterior", 0, 0, 0), [
		new Button ("mall_doors", 443, 153, 812, 514)],[],[]);
	game.screens["mall_inside"] = new Screen (0, 0, 0, new Image ("image/mallinterior", 0, 0, 0), [
		new Button ("productivity_store", 0.5, 212, 169, 566),
		new Button ("navigation_store", 558, 262, 798, 377),
		new Button ("social_space", 799, 276, 953, 441)
		], [], []);
	game.screens["Productivity_Store"] = new Screen (0, 0, 0, new Image ("image/productivity", 0, 0, 0), [
		new Button ("exit_store", 650, 131, 801, 363),
		new Button ("iread_stand", 822, 185, 977, 544),
		new Button ("countdown_poster", 0.5, 111, 77,338),
		new Button ("throw_me_poster", 142, 130, 226, 304)
		], [], []);
	game.screens["Navigation_Store"] = new Screen (0, 0, 0, new Image ("image/navigation", 0, 0, 0), [
		new Button ("exit_store", 520, 197, 999, 467),
		new Button ("iumbrella_poster", 181, 216, 295, 412)
		], [], []);
	game.screens["Social_Hub"] = new Screen (0, 0, 0, new Image ("image/social", 0, 0, 0), [
		new Button ("exit_store", 1.5, 540, 578, 643),
		new Button ("discover_poster", 310, 35, 546, 446),
		new Button ("do_something_poster", 582, 33, 816, 446),
		new Button ("2spooky_poster", 855, 34, 999, 446)
		], [], []);

	game.background_music["mall_inside"] = "audio/mall";
	game.background_music["Productivity_Store"] = "audio/mall";
	game.background_music["Navigation_Store"] = "audio/mall";
	game.background_music["Social_Hub"] = "audio/mall";

	var inside_female = "Emma";
	var social_employee ="Craig"
	var social_male = "Patrick";
	var social_female = "Denise";
	var productivity_employee = "Adam";
	var productivity_female = "Emily";
	var navigation_employee = "Natalie";
	var navigation_male = "Justin";

	game.dialogs["inside_female_dialog_1"] = new Dialog ("inside_female_dialog_1", inside_female, "Now lets see where I am, don't want to get lost again like last time. Where was that map app again?", ["Continue."]);
	game.dialogs["inside_female_dialog_2"] = new Dialog ("inside_female_dialog_2", game.partner_name, "I overheard that lady over mention a map app for this place. Might come in handy don't you think.", ["Continue."]);
	game.dialogs["inside_female_dialog_3"] = new Dialog ("inside_female_dialog_3", game.player_name, "Good Idea.", ["Continue."]);
	game.dialogs["inside_female_dialog_4"] = new Dialog ("inside_female_dialog_4", game.player_name, "Excuse me miss, I overheard you talking about a map app for this mall. Would you mind telling me where I can download it?", ["Continue."]);
	game.dialogs["inside_female_dialog_5"] = new Dialog ("inside_female_dialog_5", inside_female, "Sure thing, I send you the download link via Bluetooth. The last thing this place needs is two lost people.", ["Continue."]);
	game.dialogs["inside_female_dialog_6"] = new Dialog ("inside_female_dialog_6", game.player_name, "Thank you miss.", ["Continue."]);
	game.dialogs["inside_female_dialog_7"] = new Dialog ("inside_female_dialog_7", game.partner_name, "Cool, we can now move through different areas freely, by selecting a location on the map. Before we leave maybe we should take look around and see if we can find a useful app.", ["Continue."]);
	game.dialogs["social_store_manager_dialog_1"] = new Dialog ("social_store_manager_dialog_1", social_employee, "Hello and welcome to the Social Hub, where we can find anything and everything that happening around you. Our current notable apps are: 2spooky4me, Daily Discover, and Do Something. If you have any questions feel free to ask me!", ["Continue."]);
	game.dialogs["discover_poster_content"] = new Dialog ("discover_poster_content", "Discover Daily", "Find what music people around you are listening to! Get a list of the songs other Discover Daily users are listening to and even listen along to music with them! Seamlessly jump in jump out songs, tag your favorite parts, rate your favorites! Download?", ["Yes.", "No."]);
	game.dialogs["do_something_poster_content"] = new Dialog ("do_something_poster_content", "Do Something!", "Find what’s happening near you based on your interests! Discover concerts, shows, movies, and other events near you for you. Download?", ["Yes.", "No."]);
	game.dialogs["2spooky_poster_content"] = new Dialog ("2spooky_poster_content", "2spooky4me Cam", "Change any picture into a spooky one with one of our hundreds and themes and filters. Including iconic horror characters, scenes and weapons. Try now for free a limited time! Download?", ["Yes.", "No."]);
	game.dialogs["productivity_manager_dialog_1"] = new Dialog ("productivity_manager_dialog_1", productivity_employee, "Hi there and welcome to the productivity section of the mall, where you try to make you a better you. Our current most productive apps are: Final Countdown, Throw Me, and iRead. Please enjoy and feel free to ask me any question you may have.", ["Continue."]);
	game.dialogs["final_countdown_poster_content"] = new Dialog ("final_countdown_poster_content", "Final Countdown!", "Never be late for any of your finals again! Find your university and courses and we will make reminders and a countdown timer for each of your finals! Create notifications and reminders as far as 1 month before you take your finals. Download?", ["Yes.", "No."]);
	game.dialogs["throw_me_poster_content"] = new Dialog ("throw_me_poster_content", "Throw Me!", "This app measure the distance you just threw your phone using your phone’s built in accelerometer. Post your distance and compare it with the world. Download?", ["Yes.", "No."]);
	game.dialogs["iread_stand_content"] = new Dialog ("iread_stand_content", "iRead", "Point and read! Read any text out loud using OCR technology so you will never have to read again!", ["Yes.", "No."]);
	game.dialogs["navigation_manager_dialog_1"] = new Dialog ("navigation_manager_dialog_1", navigation_employee, "Welcome to Navigate, where we put you in the driver seat of your life. Currently our most popular app is iUmbrella. Go Figure! If you have any questions feel free to ask.", ["Continue."]);
	game.dialogs["iUmbrella_poster_content"] = new Dialog ("iUmbrella_poster_content", "iUmbrella", "Never be without an umbrella again! When it’s raining open the app and you’ll instantly have an umbrella to cover your head with! Download?", ["Yes.", "No."]);


	game.mall_scene_variables = {
		spoken_to_emma: false,
		entry_to_social_hub: false,
		entry_to_productivity: false,
		entry_to_navigation: false,
		list_of_people: {inside_female:inside_female, social_employee:social_employee, social_male:social_male, social_female:social_female, productivity_employee:productivity_employee, productivity_female:productivity_female, navigation_employee:navigation_employee, navigation_male:navigation_male}
	};
}

function resetMallVariables (vars) {
	vars.spoken_to_emma = false;
	vars.entry_to_social_hub = false;
	vars.entry_to_productivity = false;
	vars.entry_to_navigation = false;

}

function mall_scene_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, vars) {
	if (button == "mall_doors") {
		changeMainScreen("mall_inside");
		if (!vars.spoken_to_emma) {
			showDialog("inside_female_dialog_1");
			vars.spoken_to_emma = true;
	}
		return true;
	} else if (button == "productivity_store") {
		changeMainScreen("Productivity_Store");
		if (!vars.entry_to_productivity) {
			showDialog("productivity_manager_dialog_1");
			vars.entry_to_productivity = true;
		}
		return true;
	} else if (button == "exit_store") {
		changeMainScreen("mall_inside");
		return true;
	} else if (button == "navigation_store") {
		changeMainScreen("Navigation_Store");
		if(!vars.entry_to_navigation) {
			showDialog("navigation_manager_dialog_1");
			vars.entry_to_navigation = true;
		}
		return true;
	} else if (button == "social_space") {
		changeMainScreen("Social_Hub");
		if(!vars.entry_to_social_hub) {
			showDialog("social_store_manager_dialog_1");
			vars.entry_to_social_hub = true;
			}
		return true;
	} else if (button == "dialog_inside_female_dialog_1_Continue.") {
		closeDialog();
		showDialog("inside_female_dialog_2");
		return true;
	} else if (button == "dialog_inside_female_dialog_2_Continue.") {
		closeDialog();
		showDialog("inside_female_dialog_3");
		return true;
	} else if (button == "dialog_inside_female_dialog_3_Continue.") {
		closeDialog();
		showDialog("inside_female_dialog_4");
		return true;
	} else if (button == "dialog_inside_female_dialog_4_Continue.") {
		closeDialog();
		showDialog("inside_female_dialog_5");
		return true;
	} else if (button == "dialog_inside_female_dialog_5_Continue.") {
		closeDialog();
		showDialog("inside_female_dialog_6");
		return true;
	} else if (button == "dialog_inside_female_dialog_6_Continue.") {
		closeDialog();
		showDialog("inside_female_dialog_7");
		return true;
	} else if (button == "dialog_inside_female_dialog_7_Continue.") {
		closeDialog();
		vars.spoken_to_April = true;
		return true;
	} else if (button == "discover_poster") {
		showDialog("discover_poster_content");
		return true;
	} else if (button == "2spooky_poster") {
		showDialog("2spooky_poster_content");
		return true;
	} else if (button == "do_something_poster") {
		showDialog("do_something_poster_content");
		return true;
	} else if (button == "dialog_discover_poster_content_No.") {
		closeDialog();
		return true;
	} else if (button == "dialog_do_something_poster_content_No.") {
		closeDialog();
		return true;
	} else if (button == "dialog_2spooky_poster_content_No.") {
		closeDialog();
		return true;
	} else if (button == "dialog_social_store_manager_dialog_1_Continue.") {
		closeDialog();
		return true;
	} else if (button == "dialog_productivity_manager_dialog_1_Continue.") {
		closeDialog();
		return true;
	} else if (button == "countdown_poster") {
		showDialog("final_countdown_poster_content");
		return true;
	} else if (button == "dialog_final_countdown_poster_content_No.") {
		closeDialog();
		return true;
	} else if (button == "iread_stand") {
		showDialog("iread_stand_content");
		return true;
	} else if (button == "dialog_iread_stand_content_No.") {
		closeDialog();
		return true;
	} else if (button == "throw_me_poster") {
		showDialog("throw_me_poster_content");
		return true;
	} else if (button == "dialog_throw_me_poster_content_No.") {
		closeDialog();
		return true;
	} else if (button == "dialog_navigation_manager_dialog_1_Continue.") {
		closeDialog();
		return true;
	} else if (button == "iumbrella_poster") {
		showDialog("iUmbrella_poster_content");
		return true;
	} else if (button == "dialog_iUmbrella_poster_content_No.") {
		closeDialog();
		return true;
	}

}

