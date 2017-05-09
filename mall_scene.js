function load_mall(game) {
	game.screens["mall_scene"] = new Screen (0, 0, 0, new Image ("image/mallexterior", 0, 0, 0), [
		new Button ("mall_doors", 443, 153, 812, 514, 0)],[],[]);
	game.screens["mall_inside"] = new Screen (0, 0, 0, new Image ("image/mallinterior", 0, 0, 0), [
		new Button ("productivity_store", 0.5, 212, 169, 566, 0),
		new Button ("navigation_store", 558, 262, 798, 377, 0),
		new Button ("social_space", 1085, 280, 1152, 455, 0)
		], [], []);
	game.screens["Productivity_Store"] = new Screen (0, 0, 0, new Image ("image/productivity", 0, 0, 0), [
		new Button ("exit_productivity", 650, 131, 801, 363, 0),
		new Button ("iread_stand", 805, 230, 938, 596, 1),
		new Button ("countdown_poster", 0.5, 111, 77,338, 0),
		new Button ("throw_me_poster", 142, 130, 226, 304, 0),
		new Button ("email_poster", 928, 183, 996, 326, 0),
		new Button ("todo_poster", 1030, 170, 1114, 346)
		], [], []);
	game.screens["Navigation_Store"] = new Screen (0, 0, 0, new Image ("image/navigation", 0, 0, 0), [
		new Button ("exit_store", 721, 248, 908, 468, 0),
		new Button ("iumbrella_poster", 181, 216, 295, 412, 0),
		new Button ("map_stand", 880, 380, 988, 475, 1)
		], [], []);
	game.screens["Social_Hub"] = new Screen (0, 0, 0, new Image ("image/social", 0, 0, 0), [
		new Button ("exit_store", 1.5, 540, 578, 643, 0),
		new Button ("camera_poster", 325, 89, 500, 400, 0),
		new Button ("discover_poster", 528, 89, 703, 400, 0),
		new Button ("do_something_poster", 730, 37, 906, 399, 0),
		new Button ("2spooky_poster", 932, 87, 1109, 399, 0),
		new Button ("social_hub_employee", 170, 185, 322, 367, 0)
		], [], []);

	game.screens["Spoof"] = new Screen (0, 0, 0, new Image ("image/email_spoof", 0, 0, 0), [
		new Button ("infinity_email", 191, 205, 300, 235, 0),
		new Button ("limitless_email", 752, 205, 860, 235, 0)
		], [], []);

	var inside_female = "Emma";
	var social_employee ="Craig"
	var social_male = "Patrick";
	var social_female = "Denise";
	var productivity_employee = "Adam";
	var productivity_female = "Emily";
	var navigation_employee = "Natalie";
	var navigation_male = "Justin";

	game.dialogs["map_talk_1"] = new Dialog ("map_talk_1", game.player_name, "Maybe I should download it directly from the Navigation store instead.", ["Continue."]);
	game.dialogs["map_talk_2"] = new Dialog ("map_talk_2", game.player_name, "Oh wait, Emma sent me the Map app via Bluetooth. I should decide to download it or not.", ["Continue."]);
	game.dialogs["map_talk_3"] = new Dialog ("map_talk_3", game.player_name, "I should check out all these stores before I try to use this Map app.", ["Continue."]);

	game.dialogs["inside_female_dialog_1"] = new Dialog ("inside_female_dialog_1", inside_female, "Now lets see where I am, don't want to get lost again like last time. Where was that map app again?", ["Continue."]);
	game.dialogs["inside_female_dialog_2"] = new Dialog ("inside_female_dialog_2", game.player_name, "Hm, that lady over there just mentioned something about a map of this place. Might come in handy later, I should ask her about it.", ["Continue."]);
	game.dialogs["inside_female_dialog_3"] = new Dialog ("inside_female_dialog_3", game.player_name, "Excuse me miss, I overheard you talking about a map app for this mall. Would you mind telling me where I can download it?", ["Continue."]);
	game.dialogs["inside_female_dialog_4"] = new Dialog ("inside_female_dialog_4", inside_female, "Sure thing, I'll send you the download link via Bluetooth. The last thing this place needs is another lost person.", ["Continue."]);
	game.dialogs["inside_female_dialog_5"] = new Dialog ("inside_female_dialog_5", game.player_name, "Thank you miss.", ["Continue."]);
	game.dialogs["social_store_manager_dialog_1"] = new Dialog ("social_store_manager_dialog_1", social_employee, "Hello and welcome to the Social Hub, where we can find anything and everything that happening around you. Our current notable apps are: 2spooky4me, Daily Discover, and Do Something. If you have any questions feel free to ask me!", ["Continue."]);
	game.dialogs["discover_poster_content"] = new Dialog ("discover_poster_content", "Discover Daily", "Find what music people around you are listening to! Get a list of the songs other Discover Daily users are listening to and even listen along to music with them! Seamlessly jump in and out of songs, tag your favorite parts, rate your favorites! Download?", ["Yes.", "No."]);
	game.dialogs["do_something_poster_content"] = new Dialog ("do_something_poster_content", "Do Something!", "Find what’s happening near you based on your interests! Discover concerts, shows, movies, and other events near you for you. Download?", ["Yes.", "No."]);
	game.dialogs["2spooky_poster_content"] = new Dialog ("2spooky_poster_content", "2spooky4me Cam", "Change any picture into a spooky one with one of our hundreds and themes and filters. Including iconic horror characters, scenes and weapons. Try now for free a limited time! Download?", ["Yes.", "No."]);
	game.dialogs["productivity_manager_dialog_1"] = new Dialog ("productivity_manager_dialog_1", productivity_employee, "Welcome to the productivity section of the mall -- where you try to make you a better you. Our most productive apps today are: Final Countdown, Throw Me, and iRead. We are also giving away highly coveted email apps on the house! Be sure to download the To-Do app as well!", ["Continue."]);
	game.dialogs["productivity_manager_dialog_2"] = new Dialog ("productivity_manager_dialog_2", game.player_name, "Thank you. Where would I be without an email app... now which should I download?", ["Continue."]);
	game.dialogs["final_countdown_poster_content"] = new Dialog ("final_countdown_poster_content", "Final Countdown!", "Never be late for any of your finals again! Find your university and courses and we will make reminders and a countdown timer for each of your finals! Create notifications and reminders as far as 1 month before you take your finals. Download?", ["Yes.", "No."]);
	game.dialogs["throw_me_poster_content"] = new Dialog ("throw_me_poster_content", "Throw Me!", "This app measure the distance you just threw your phone using your phone’s built in accelerometer. Post your distance and compare it with the world. Download?", ["Yes.", "No."]);
	game.dialogs["iread_stand_content"] = new Dialog ("iread_stand_content", "iRead", "Point and read! Read any text out loud using OCR technology so you will never have to read again!", ["Yes.", "No."]);
	game.dialogs["navigation_manager_dialog_1"] = new Dialog ("navigation_manager_dialog_1", navigation_employee, "Welcome to Navigate, where we put you in the driver seat of your life. Our Map app is our most popular app by a mile. Let me know if you didn't like that joke or if you have any questions.", ["Continue."]);
	game.dialogs["iUmbrella_poster_content"] = new Dialog ("iUmbrella_poster_content", "iUmbrella", "Never be without an umbrella again! When it’s raining open the app and you’ll instantly have an umbrella to cover your head with! Download?", ["Yes.", "No."]);

	game.dialogs["social_hub_employee_dialog"] = new Dialog ("social_hub_employee_dialog", social_employee, "Would you like to leave?", ["Yes.", "No, I'll shop a little more."]);

	game.dialogs["check_email_dialog"] = new Dialog ("check_email_dialog", game.player_name, "Why don't I check my email?", ["Okay."]);

	game.screens["map_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/map", "Map", "Navigation", "Infinity", 752589, "Maps, GPS", "Find your way throughout the world, so you can visit other places with this map application.");
	game.screens["map_emma_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/map_emma", "Map ", "Navigation", "Negative Pi", 3, "Maps, GPS, Read SMS", "Find your way through the world, so you can visit other places with this map application.");
	game.screens["camera_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/camera", "Camera", "Social", "Banana", 859140, "Camera", "Take and view pictures with this simple, no strings-attached camera app.");
	game.screens["discover_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/discover_daily", "Discover Daily", "Social", "Picosoft", 15738, "Network, Bluetooth, Speakers", "Find what music people around you are listening to! Get a list of the songs other Discover Daily users are listening to and even listen along to music with them! Seamlessly jump in jump out songs, tag your favorite parts, rate your favorites!");
	game.screens["do_something_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/do_something", "Do Something!", "Social", "Infinity", 125789, "Network, Maps, GPS", "Find what’s happening near you based on your interests! Discover concerts, shows, movies, and other events near you for you.");
	game.screens["2spooky_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/2spooky", "2Spooky4Me", "Social", "Banana", 258240, "Camera, Network", "Change any picture into a spooky one with one of our hundreds and themes and filters. Including iconic horror characters, scenes and weapons. Try now for free a limited time!");
	game.screens["final_countdown_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/final_countdown", "Final Countdown", "Productivity", "Banana", 5781, "Calendar", "Never be late for any of your finals again! Find your university and courses and we will make reminders and a countdown timer for each of your finals! Create notifications and reminders as far as 1 month before you take your finals.");
	game.screens["throw_me_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/throw_me", "Throw Me!", "Productivity", "Infinity", 84634, "Network, GPS, Position Sensors", "This app measure the distance you just threw your phone using your phone’s built in accelerometer. Post your distance and compare it with the world.");
	game.screens["iRead_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/iRead", "iRead", "Productivity", "Picosoft", 6752, "Camera, Speakers, Network", "Point and read! Read any text out loud using OCR technology so you will never have to read again!");
	game.screens["iUmbrella_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/iUmbrella", "iUmbrella", "Navigation", "Banana", 12472, "Magic", "Never be without an umbrella again! When it’s raining open the app and you’ll instantly have an umbrella to cover your head with!");
	game.screens["email_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/email", "Email", "Productivity", "Infinity", 851591, "Network", "Receive email with this basic email application.");
	game.screens["email_download_screen_2"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/email_2", "Email", "Productivity", "Limitless", 5349, "Network, Read Contacts, Send SMS, GPS, Storage", "Access email with this premium application.");
	game.screens["todo_download_screen"] = new AppPurchaseScreen(0, 0, 0, "image/phone/icon/todo", "To-Do", "Productivity", "Banana", 80796, "Calendar", "Keep track of your objectives automatically. Open this app to see a list of your objectives in each area.");

	game.mall_scene_variables = {
		spoken_to_emma: false,
		entry_to_social_hub: false,
		entry_to_productivity: false,
		entry_to_navigation: false,
		downloaded_from_emma: false,
		did_not_trust_emma: false,
		downloaded_spoof: false,
		downloaded_good_email_app: false,
		made_decision_on_map: false,
		app_security_video_played: false,
		score:0,
		list_of_people: {inside_female:inside_female, social_employee:social_employee, social_male:social_male, social_female:social_female, productivity_employee:productivity_employee, productivity_female:productivity_female, navigation_employee:navigation_employee, navigation_male:navigation_male}
	};
}

function resetMallVariables (vars) {
	vars.spoken_to_emma = false;
	vars.entry_to_social_hub = false;
	vars.entry_to_productivity = false;
	vars.entry_to_navigation = false;
	vars.did_not_trust_emma = false;
	vars.made_decision_on_map = false;
	vars.downloaded_spoof = false;
	vars.downloaded_good_email_app = false;
	vars.downloaded_from_emma = false;
	vars.score = 0;
}

// Note: (JRH) I actually decided to call this function from checkForGameCompletion, rather than in this module.
// So the score will be zero even after some objectives are completed. 
function score_mall (vars) {
	vars.score = 0;
	if (vars.did_not_trust_emma) {
		vars.score += 15;
	} else if (vars.downloaded_from_emma) {
		vars.score += 3;
	}
	
	if (vars.downloaded_good_email_app) {
		vars.score += 15;
	} else if (vars.downloaded_spoof) {
		vars.score += 3;
	}
}

function mall_scene_onclick(button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, installPhoneApp, addButtonToScreen, changePhoneScreen, addToTodoList, markAsComplete, removeElementFromScreen, showPhone, raisePhone, phoneScreenOn, game, vars) {

	var PHONE_X = 200;
	var PHONE_Y_RAISED = 400;
	var PHONE_Y_LOWERED = 50;
	var PHONE_LAYER = 100;

	var PHONE_SCREEN_X = PHONE_X - 13;
	var PHONE_SCREEN_Y = PHONE_Y_RAISED - 56;
	var PHONE_SCREEN_LAYER = PHONE_LAYER + 1;

	// Helper function which turns the user's phone on and switches to a screen.
	function changeToAndShowPhoneScreen (screen_name) {
		changePhoneScreen(screen_name);
		showPhone();
		raisePhone();
		phoneScreenOn();
	}

	if (button == "mall_doors") {
		changeMainScreen("mall_inside");
		if (!vars.spoken_to_emma) {
			showDialog("inside_female_dialog_1");
			vars.spoken_to_emma = true;
		}

		return true;
	} else if ((button == "productivity_store" || button == "navigation_store" || button == "social_space") && !vars.made_decision_on_map) {
		showDialog("map_talk_2");
		return true;
	} else if (button == "dialog_map_talk_2_Continue.") {
		closeDialog();
		return true;
	} else if (button == "productivity_store" && vars.made_decision_on_map) {
		changeMainScreen("Productivity_Store");
		if (!vars.entry_to_productivity) {
			showDialog("productivity_manager_dialog_1");
			vars.entry_to_productivity = true;
		}
		return true;
	} else if (button == "exit_store") {
		changeMainScreen("mall_inside");
		return true;
	} else if (button == "exit_productivity") {
		changeMainScreen("mall_inside");
		return true;
	} else if (button == "navigation_store" && vars.made_decision_on_map) {
		changeMainScreen("Navigation_Store");
		if(!vars.entry_to_navigation) {
			showDialog("navigation_manager_dialog_1");
			vars.entry_to_navigation = true;
		}
		return true;
	} else if (button == "social_space" && vars.made_decision_on_map) {
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
		changeToAndShowPhoneScreen("map_emma_download_screen");
		vars.spoken_to_April = true;
		return true;
	} else if (button == "camera_poster") {
		changeToAndShowPhoneScreen("camera_download_screen");
		return true;
	} else if (button == "discover_poster") {
		changeToAndShowPhoneScreen("discover_download_screen");
		return true;
	} else if (button == "2spooky_poster") {
		changeToAndShowPhoneScreen("2spooky_download_screen");
		return true;
	} else if (button == "do_something_poster") {
		changeToAndShowPhoneScreen("do_something_download_screen");
		return true;
	} else if (button == "app_purchase_screen_Camera_download") {
		game.screens["phoneCameraAppScreen"] = new Screen (game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		installPhoneApp(new PhoneApp ("Camera", new Image ("image/phone/icon/camera", 0, 0, 0), "phoneCameraAppScreen", "camera_download_screen"));
		addButtonToScreen(game.screens["phoneCameraAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Camera", "24px Times", "rgba(0, 0, 0, 1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "app_purchase_screen_Discover Daily_download") {
		game.screens["phoneDiscoverAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		installPhoneApp( new PhoneApp ("Discover Daily", new Image("image/phone/icon/discover_daily", 0, 0, 0), "phoneDiscoverAppScreen", "discover_download_screen"));
		addButtonToScreen(game.screens["phoneDiscoverAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Discover Daily", "24px Times", "rgba(0,0,0,1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "app_purchase_screen_Do Something!_download") {
		installPhoneApp( new PhoneApp ("Do Something!", new Image("image/phone/icon/do_something", 0, 0, 0), "phoneDoSomethingAppScreen", "do_something_download_screen"));
		game.screens["phoneDoSomethingAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneDoSomethingAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Do Something", "24px Times", "rgba(0,0,0,1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "app_purchase_screen_2Spooky4Me_download") {
		installPhoneApp(new PhoneApp ("2Spooky4Me", new Image("image/phone/icon/2spooky", 0, 0, 0), "phone2Spooky4MeAppScreen", "2spooky_download_screen"));
		game.screens["phone2Spooky4MeAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phone2Spooky4MeAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit 2Spooky", "24px Times", "rgba(0,0,0,1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "dialog_social_store_manager_dialog_1_Continue.") {
		closeDialog();
		return true;
	} else if (button == "dialog_productivity_manager_dialog_1_Continue.") {
		closeDialog();
		showDialog("productivity_manager_dialog_2");
		return true;
	} else if (button == "dialog_productivity_manager_dialog_2_Continue.") {
		closeDialog();
		//changeToAndShowPhoneScreen("email_download_screen");
		changeMainScreen("Spoof");
		return true;
	} else if (button == "infinity_email") {
		vars.downloaded_good_email_app = true;
		installPhoneApp(new PhoneApp ("Email", new Image ("image/phone/icon/email", 0, 0, 0, 56.0/57.0), "phoneEmailAppScreen", "email_download_screen"));
		changeMainScreen("Productivity_Store");
		showDialog("check_email_dialog");

		// Play the video in each of these cases.
		if (!vars.app_security_video_played) {
			playVideo("video/appSecurity");
			vars.app_security_video_played = true;
		}
		return true;
	} else if (button == "limitless_email") {
		vars.downloaded_spoof = true;
		installPhoneApp(new PhoneApp ("Email", new Image ("image/phone/icon/email_2", 0, 0, 0, 56.0/32.0), "phoneEmailAppScreen", "email_download_screen_2"));
		changeMainScreen("Productivity_Store");
		showDialog("check_email_dialog");

		// Play the video in each of these cases.
		if (!vars.app_security_video_played) {
			playVideo("video/appSecurity");
			vars.app_security_video_played = true;
		}
		return true;
	} else if (button == "countdown_poster") {
		changeToAndShowPhoneScreen("final_countdown_download_screen");
		return true;
	} else if (button == "app_purchase_screen_Map _cancel") { // Previously included && !vars.entry_to_navigation, but that is not necessary b/c the purchase screen is now unique.
		showDialog("map_talk_1");
		vars.made_decision_on_map = true;
		return true;
	} else if (button == "dialog_map_talk_1_Continue.") {
			closeDialog();
			changeToAndShowPhoneScreen("phoneHomeScreen");
			vars.did_not_trust_emma = true;
			return true;
	}	else if (button == "app_purchase_screen_Final Countdown_download") {
		installPhoneApp(new PhoneApp ("Final Countdown", new Image("image/phone/icon/final_countdown", 0, 0, 0), "phoneFinalCountdownAppScreen", "final_countdown_download_screen"));
		game.screens["phoneFinalCountdownAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneFinalCountdownAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Final Countdown", "24px Times", "rgba(0,0,0,1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "iread_stand") {
		changeToAndShowPhoneScreen("iRead_download_screen");
		return true;
	} else if (button == "app_purchase_screen_iRead_download") {
		installPhoneApp(new PhoneApp ("iRead", new Image("image/phone/icon/iRead", 0, 0, 0), "phoneI-ReadAppScreen", "iRead_download_screen"));
		game.screens["phoneI-ReadAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneI-ReadAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit I-Read", "24px Times", "rgba(0,0,0,1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "throw_me_poster") {
		changeToAndShowPhoneScreen("throw_me_download_screen");
		return true;
	} else if (button == "app_purchase_screen_Throw Me!_download") {
		installPhoneApp(new PhoneApp ("Throw Me!", new Image("image/phone/icon/throw_me", 0, 0, 0), "phoneThrowMeAppScreen", "throw_me_download_screen"));
		game.screens["phoneThrowMeAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneThrowMeAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit Throw Me", "24px Times", "rgba(0,0,0,1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "email_poster" && !vars.downloaded_spoof) {
		changeToAndShowPhoneScreen("email_download_screen");
		return true;
	} else if (button == "email_poster" && vars.downloaded_spoof) {
		changeToAndShowPhoneScreen("email_download_screen_2");
		return true;
	} else if (button == "app_purchase_screen_Email_download") {
		installPhoneApp(new PhoneApp ("Email", new Image ("image/phone/icon/email", 0, 0, 0, 56.0/57.0), "phoneEmailAppScreen", "email_download_screen"));
		return true;
	} else if (button == "dialog_check_email_dialog_Okay.") {
		closeDialog();
		return true;
	} else if (button == "todo_poster") {
		changeToAndShowPhoneScreen("todo_download_screen");
		return true;
	} else if (button == "app_purchase_screen_To-Do_download") {
		installPhoneApp(new PhoneApp ("To-Do", new Image ("image/phone/icon/todo", 0, 0, 0, 56.0/57.0), "phoneTodoListAppScreen", "todo_download_screen"));
		return true;
	} else if (button == "dialog_navigation_manager_dialog_1_Continue.") {
		closeDialog();
		return true;
	} else if (button == "iumbrella_poster") {
		changeToAndShowPhoneScreen("iUmbrella_download_screen");
		return true;
	} else if (button == "app_purchase_screen_iUmbrella_download") {
		installPhoneApp(new PhoneApp ("iUmbrella", new Image("image/phone/icon/iUmbrella", 0, 0, 0), "phoneiUmbrellaAppScreen", "iUmbrella_download_screen"));
		game.screens["phoneiUmbrellaAppScreen"] = new Screen(game.canvas.x - PHONE_SCREEN_X, game.canvas.y - PHONE_SCREEN_Y, PHONE_SCREEN_LAYER, new Image ("image/phone/screen/on", 0, 0, 0), [], [], []);
		addButtonToScreen(game.screens["phoneiUmbrellaAppScreen"], new Button("phone-exit-app", 0, 0, 173, 30, 2, "Exit I-Umbrella", "24px Times", "rgba(0,0,0,1)"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "map_stand") {
		changeToAndShowPhoneScreen("map_download_screen");
		return true;
	} else if (button == "app_purchase_screen_Map _download") { // previously included && !vars.entry_to_navigation, but that is not necessary b/c the app purchase screen is now unique
		vars.made_decision_on_map = true;
		installPhoneApp(new PhoneApp ("Map ", new Image ("image/phone/icon/map_emma", 0, 0, 0, 56.0/32.0), "phoneMapSpoofAppScreen", "map_emma_download_screen"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "app_purchase_screen_Map_download") { // previously included && vars.entry_to_navigation, but that is not necessary b/c the app purchase screen is now unique
		installPhoneApp(new PhoneApp ("Map", new Image ("image/phone/icon/map", 0, 0, 0, 56.0/57.0), "phoneMapAppScreen", "map_download_screen"));
		changeToAndShowPhoneScreen("phoneHomeScreen");
		return true;
	} else if (button == "social_hub_employee") {
		showDialog("social_hub_employee_dialog");
		return true;
	} else if (button == "dialog_social_hub_employee_dialog_Yes.") {
		closeDialog();
		changeMainScreen("mall_inside");
		return true;
	} else if (button == "dialog_social_hub_employee_dialog_No, I'll shop a little more.") {
		closeDialog();
		return true;
	}

}
