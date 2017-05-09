
// DO NOT declare variables at the Top level scope in this file.
// Put them into the game object in the load_apartment() method instead.

function load_apartment (game) {

	game.apartment_variables = {
		router_pwd_entry:"abcdef",
		ssid_entry:"ssidabc",
		new_ssid:"MyRouter100",
		theSpotofdot20: "theSpotofdot20",
		score:0,
		metMadeline:false,
		metEmily:false,
		metJacob:false,
		metBilly:false,
		metAll:false,
		routerChecked:false,
		sawHistory:false,
		askedAboutRouter:false,
		leftMadeline:false,
		inHerRoom:false,
		ethicsWithBilly:false,
		ratBilly:false,
		helpBilly:false,
		accusedJacob:false,
		changedSSID:false,
		changedPassword:false,
		firstTry:true,
		wifi_config_video_played:false,
		piracy_video_played:false,
		background_music_audio_id:"audio/mall",
		on_completion_trigger_email_hack:false,
		names_of_people:{billy:resident_1_name, jacob:resident_2_name, emily:resident_3_name, madeline:resident_4_name}
	};

	game.browsers["rout"] = new Browser();

	//History, Wired Settings, Wireless Settings, Factory Reset
	game.webpages["http://192.168.0.1"] = new Screen (0, 70, 0, new Rectangle ("router_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("history_button", 65, 300, 165, 350, 2, "History", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("factory_button", 595, 300, 780, 350, 2, "Factory Reset", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("wired_button", 110, 120, 335, 160, 2, "Wired Settings", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("wireless_button", 500, 120, 750, 160, 2, "Wireless Settings", "28px Arial", "rgba(0,0,0,1)")], [], []);

	game.webpages["http://192.168.0.1/history"] = new Screen(0, 70, 0, new Image("image/history", 0, 0, 0), [], [], []);

	game.webpages["Jacob's Phone Networks"] = new Screen(0, 70, 0, new Image("image/jacobNetworks", 0, 0, 0), [], [], []);

	game.webpages["http://192.168.0.1/wireless"] = new Screen (0, 70, 0, new Rectangle ("router_1_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("change_ssid", 90, 130, 270, 180, 2, "Change SSID", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("broadcast", 540, 130, 740, 180, 2, "Broadcast SSID", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("set_pwd", 90, 410, 280, 440, 2, "Set Password", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("parental", 540, 410, 760, 440, 2, "Parental Controls", "28px Arial", "rgba(0,0,0,1)"),
	new Button ("finish_secure", 370, 435, 445, 465, 2, "Finish", "28px Arial", "rgba(0,0,0,1)")], [], []);

	game.webpages["http://192.168.0.1/wireless/password"] = new Screen (0, 70, 0, new Rectangle ("router_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("router_password_finish_button", 100, 200, 200, 300, 2,"Save and Go Back >", "18px Arial", "rgba(0,0,0,1)")],
	[new Button ("router_password_entry", 100, 130, 500, 200, 2, "********", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("router_instruction_enter_password_", 100, 100, 500, 150, 1, "Enter your new password:", "24px Arial", "rgba(0,0,0,1)")]);

	game.webpages["http://192.168.0.1/wireless/ssid"] = new Screen (0, 70, 0, new Rectangle ("router_2_background", 0, 0, 1224, 688, 0, "rgba(255,255,255,1)"),
	[new Button ("ssid_finish_button", 100, 200, 200, 300, 2,"Save and Go Back >", "18px Arial", "rgba(0,0,0,1)")],
	[new Button ("ssid_page_entry", 100, 130, 500, 200, 2, "********", "24px Arial", "rgba(64,64,64,1)")],
	[new Text ("router_instruction_enter_ssid_", 100, 100, 500, 150, 1, "Enter your new SSID:", "24px Arial", "rgba(0,0,0,1)")]);

	game.screens["apartment"] = new Screen (0, 0, 0, new Image ("image/hallway", 0, 0, 0), [
		new Button ("apartment_manager", 268, 313, 328, 396, 0),
		new Button ("madeline_door", 120, 360, 200, 400, 0),
		new Button ("billy_door", 788, 325, 812, 385, 0),
		new Button ("jacob_door", 444, 330, 474, 375, 0),
		new Button ("emily_door", 582, 321, 627, 383, 0)
	], [], []);

	game.screens["billy_room"] = new Screen (0, 0, 0, new Image ("image/billya", 0, 0, 0), [
		new Button ("door", 75, 355, 135, 385, 0),
		new Button ("bill", 650, 108, 780, 430, 0)
	], [], []);

	game.screens["jacob_room"] = new Screen (0, 0, 0, new Image ("image/jacoba", 0, 0, 0), [
		new Button ("door1", 571, 169, 684, 429, 0),
		new Button ("jac", 455, 158, 510, 444, 0),
		new Button ("jacob_phone", 220, 438, 260, 453, 0)
	], [], []);

	game.screens["emily_room"] = new Screen (0, 0, 0, new Image ("image/emilya", 0, 0, 0), [
		new Button ("door2", 792, 190, 850, 290, 0),
		new Button ("em", 338, 135, 477, 425, 0)
	], [], []);

	game.screens["madeline_room"] = new Screen (0, 0, 0, new Image ("image/madelinea", 0, 0, 0), [
		new Button ("door3", 258, 360, 290, 373, 0),
		new Button ("mad_laptop", 930, 410, 1090, 550, 0),
		new Button ("mad", 643, 155, 780, 455, 0)
	], [], []);

	game.screens["apartment_success"] = new Screen (0, 0, 0, new Image ("image/mission/complete", 0, 0, 0), [
		new Button ("apartment_failed_quit", 404, 427, 714, 515, 2, "Select Another Mission", "24px Arial", "rgba(255,255,255,1)")
	], [], [
		new Text ("apartment_success_score", 404, 535, 714, 600, 2, "You scored " + game.apartment_variables.score + " points!", "24px Arial", "rgba(255,255,0,1)"),
		new Rectangle ("apartment_success_quit_backing_rectangle", 404, 427, 714, 515, 1, "rgba(255,255,255,0.5)")
	]);

	var resident_1_name = "Billy";
	var resident_2_name = "Jacob";
	var resident_3_name = "Emily";
	var resident_4_name = "Madeline";

	var ERROR_STRING = "If you see this message, Jonathan Hansford wrote code that didn't work and should be ashamed of it.";

	game.dialogs["rout1"] = new Dialog ("rout1", game.partner_name, "We're not done yet...", ["Okay."]);
	game.dialogs["rout2"] = new Dialog ("rout2", game.partner_name, "Not sure going there will help us right now.", ["Alright."]);
	game.dialogs["stop_reset"] = new Dialog ("stop_reset_dialog", game.partner_name, "We probably shouldn't do that. It'll reset everything and we won't be able to check her router history.", ["Okay."]);

	game.dialogs["apartment_partner_dialog"] = new Dialog ("apartment_partner_dialog", game.partner_name, "A student named Madeline sent us that email about illegal downloads. She said to come by her room - first door on the left.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_2"] = new Dialog ("apartment_partner_dialog_2", game.partner_name, "Madeline's room is the first door on the left.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_4"] = new Dialog ("apartment_partner_dialog_4", game.partner_name, "We should check her router history to see if anyone else has been using it. Let's try" +
	" going to http://192.168.0.1 on her laptop.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_5"] = new Dialog ("apartment_partner_dialog_5", game.partner_name, "Madeline, have you changed any of these settings in the past?", ["Continue."]);
	game.dialogs["apartment_partner_dialog_6"] = new Dialog ("apartment_partner_dialog_6", game.partner_name, "Let's see if we can get anymore information from the router history and then do some investigating.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_7"] = new Dialog ("apartment_partner_dialog_7", game.partner_name, "We've talked to all possible suspects. Let's check in on Madeline.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_8"] = new Dialog ("apartment_partner_dialog_8", game.partner_name, "Not broadcasting the SSID is a bad idea since it forces the laptops remembering the router to transmit the SSID wherever they go, meaning snoopers could end up seeing it.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_9"] = new Dialog ("apartment_partner_dialog_9", game.partner_name, "Her SSID is currently 'Madeline's Wi-Fi' - we should change it to something like MyRouter100 so people don't easily find out it's tied to her.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_10"] = new Dialog ("apartment_partner_dialog_10", game.partner_name, "There isn't any reason to change these, but you could block certain websites and put on time of day restrictions.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_11"] = new Dialog ("apartment_partner_dialog_11", game.partner_name, "We need a password so neighbors can't easily connect to your network. What would you like to be set as your password, Madeline?", ["Okay."]);
	game.dialogs["apartment_partner_dialog_12"] = new Dialog ("apartment_partner_dialog_12", game.partner_name, "We already set her password the way she wanted.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_13"] = new Dialog ("apartment_partner_dialog_13", game.partner_name, "According to the router history, Jacob and Billy used at least 1 GB of data -- seems like a lot in just a couple hours.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_14"] = new Dialog ("apartment_partner_dialog_14", game.partner_name, "Hold on. You didn't enter theSpotofdot20 as her password.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_15"] = new Dialog ("apartment_partner_dialog_15", game.partner_name, "I think it should be MyRouter100.", ["Okay."]);


	game.dialogs["madeline_dialog"] = new Dialog ("madeline_dialog", game.player_name, "Hello Madeline. We're the detectives you contacted about this music piracy problem. How can we help?", ["Continue."]);
	game.dialogs["madeline_dialog_2"] = new Dialog ("madeline_dialog_2", resident_4_name, "Thank you so much for coming. Like I said, the Music Protection Association is claiming I illegally downloaded a thousand dollars worth of songs. I'm incredibly stressed right now, since I know they've got this all wrong. You could even look" +
	" at my computer and see that there aren't any downloaded music files on it. Please help!", ["Okay."]);
	game.dialogs["madeline_dialog_3"] = new Dialog ("madeline_dialog_3", resident_4_name, "I definitely haven't. I don't even know how to get to this screen", ["Okay."]);
	game.dialogs["madeline_dialog_4"] = new Dialog ("madeline_dialog_4", game.player_name, "It looks like Jacob, Billy, and Emily have used your Wi-Fi network in the past 48 hours.", ["Continue."]);
	game.dialogs["madeline_dialog_5"] = new Dialog ("madeline_dialog_5", resident_4_name, "Wow, I would have never known that. Could you help me ask some of the people who live here? I know Jacob lives to my left, Emily lives down the hall, and" +
	" my friend Billy lives across from me.", ["Okay."]);

	//partner speaking
	game.dialogs["madeline_dialog_6"] = new Dialog ("madeline_dialog_6", game.partner_name, "Remember, Jacob lives to her left, Emily lives down the hall, and Billy lives somewhere across from her room.", ["Okay."]);

	game.dialogs["madeline_dialog_7"] = new Dialog ("madeline_dialog_7", resident_4_name, "Perfect timing! The Music Protection Association just emailed me saying all the illegally downloaded files were songs by country artists.", ["Continue."]);
	game.dialogs["madeline_dialog_8"] = new Dialog ("madeline_dialog_8", game.player_name, "Thanks Madeline. With that, I believe our investigation lets us conclude that our culprit is ", ["Emily.", "Jacob.", "Billy."]);
	game.dialogs["madeline_dialog_9"] = new Dialog ("madeline_dialog_9", game.player_name, "Actually, the culprit is ", ["Emily.", "Jacob.", "Billy."]);
	game.dialogs["madeline_dialog_10"] = new Dialog ("madeline_dialog_10", resident_4_name, "I'll let them know immediately about this situation and talk to Jacob about what he almost caused. I'm just glad I can avoid a random lawsuit - student loans are already tough enough.", ["Continue."]);
	game.dialogs["madeline_dialog_11"] = new Dialog ("madeline_dialog_11", resident_4_name, "By the way, they also told me to secure my network since I'm responsible for the traffic on it. Could you help me with that?", ["Okay."]);
	game.dialogs["madeline_dialog_12"] = new Dialog ("madeline_dialog_12", resident_4_name, "Please help me secure my network!", ["Okay."]);
	game.dialogs["madeline_dialog_13"] = new Dialog ("madeline_dialog_13", resident_4_name, "I want it set as 'theSpotofdot20'", ["Okay."]);
	game.dialogs["madeline_dialog_14"] = new Dialog ("madeline_dialog_14", game.player_name, "Well, Madeline, that's everything.", ["Continue."]);
	game.dialogs["madeline_dialog_15"] = new Dialog ("madeline_dialog_15", resident_4_name, "I am so glad you guys were able to solve my problem. Please accept my collection of baseball cards as a gift! Some of the players in it include Adam Jones, Chris Davis, Bryce Harper, and Ryan Zimmerman.", ["Okay."]);



	game.dialogs["jacob_dialog"] = new Dialog ("jacob_dialog", game.player_name, "Hello Jacob. How are you doing today?", ["Continue."]);
	game.dialogs["jacob_dialog_2"] = new Dialog ("jacob_dialog_2", resident_2_name, "I'm listening to some old-fashioned country music, so I couldn't be better. Wait, but how do you know my name? Who are you?", ["Continue."]);
	game.dialogs["jacob_dialog_3"] = new Dialog ("jacob_dialog_3", game.player_name, "We're just a couple of detectives doing a case here. Quite a few files have been illegally downloaded recently, and we wanted to know if you" +
	" knew anything about that. So just one question: have you been on Madeline's Wi-Fi network at all the past few days?", ["Continue."]);
	game.dialogs["jacob_dialog_4"] = new Dialog ("jacob_dialog_4", resident_2_name, "All I know is that I use a wired connection for my computer. As for my phone, it automatically connects to to any" +
	" remembered networks, so I don't know if that helps you. You could even look at my phone, but I doubt you'll find anything useful.", ["Okay. Thanks."]);
	game.dialogs["jacob_dialog_5"] = new Dialog ("jacob_dialog_5", resident_2_name, "I'm just listening to my country music. I pretty much told you everything.", ["Okay."]);

	game.dialogs["emily_dialog"] = new Dialog ("emily_dialog", game.player_name, "Emily? Hi. We were called in by Madline down the hall, and we recently discovered that you might have used your tablet on her Wi-Fi Network. Is this true?", ["Continue."]);
	game.dialogs["emily_dialog_2"] = new Dialog ("emily_dialog_2", resident_3_name, "I knew I should have just waited for the campus Wi-Fi to connect.. All I did was download some homework off of Canvas! Please tell Madeline I'm sorry!", ["Okay."]);
	game.dialogs["emily_dialog_3"] = new Dialog ("emily_dialog_3", resident_3_name, "Sorry, I really need to get some homework done! If you're trying to leave, check the wall my dresser is up against.", ["Okay."]);

	game.dialogs["billy_dialog"] = new Dialog ("billy_dialog", game.player_name, "Hello there. Your friend Madeline called us in saying the Music Protection Association found many files being illegally downloaded on" +
	" her Wi-Fi network. Have you been using it?", ["Continue."]);
	game.dialogs["billy_dialog_2"] = new Dialog ("billy_dialog_2", resident_1_name, "Alright, I don't want to start too much trouble. I don't have a network of my own, and I've been hijacking on my neighbors' networks for years. I thought" +
	" this was a good way to save some money on my rent and to stream my favorite Rock songs.", ["Okay."]);
	game.dialogs["billy_dialog_3"] = new Dialog ("billy_dialog_3", resident_1_name, "Could you let this one slide? I can't afford these expenses.", ["Sure.", "Sorry."]); //ethical decision probably
	game.dialogs["billy_dialog_4"] = new Dialog ("billy_dialog_4", resident_1_name, "Awesome, you're the best!", ["Okay."]);
	game.dialogs["billy_dialog_5"] = new Dialog ("billy_dialog_5", resident_1_name, "Wait what? That's not cool.", ["Okay."]);
	game.dialogs["billy_dialog_6"] = new Dialog ("billy_dialog_6", resident_1_name, "Please don't tell her!", ["Maybe."]);
}

function pickCulprit (accused, showDialog, closeDialog, vars) {
	vars.accusation_dialog.text = vars.names_of_people[accused] + " is the one responsible.";
	vars.accused_dialog.title = vars.names_of_people[accused];
	if (accused == vars.culprit) {
		vars.after_accused_speaks_show = "apartment_police_dialog_4";
	} else {
		vars.after_accused_speaks_show = "apartment_police_dialog_2";
	}
	showDialog("apartment_player_dialog");
}

// Returns true if the input event is consumed by this function, false if it does not.
// Takes the name of the button and whatever other arguments it needs from the server.js in order to work.
// Here vars is game.apartment_variables as assigned above.
function apartment_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, vars, browser, displayBrowser, closeBrowser, changeBrowserWebPage, triggerEmailHack, checkForGameCompletion, returnToPlayerOffice, score_text_element) {
	if (button == "go_to_apartment") { // Button on the phone's map app.
		resizeCanvas(1153, 648.5);
		changeMainScreen("apartment");
		if (!vars.entry_message_shown) {
			showDialog("apartment_partner_dialog");
		}
		return false; // Allow the main file to handle this event as well.
	} else if (button == "dialog_apartment_partner_dialog_Okay.") {
		closeDialog();
		return true;
	} else if (button == "madeline_door" && !vars.metAll) {
		vars.inHerRoom = true;
		if (vars.picking_culprit) {
			pickCulprit(button, showDialog, closeDialog, vars);
		} else if (!vars.metMadeline) {
			changeMainScreen("madeline_room");
			showDialog("madeline_dialog");
		} else {
			showDialog("madeline_dialog_6");
		}
		return true;
	} else if (button == "dialog_madeline_dialog_Continue.") {
		closeDialog();
		showDialog("madeline_dialog_2");
		return true;
	} else if (button == "dialog_madeline_dialog_2_Okay.") {
		closeDialog();
		//showPartnerDialog(showDialog, closeDialog, vars);
		showDialog("apartment_partner_dialog_4");
		return true;
	} else if (button == "dialog_apartment_partner_dialog_4_Okay.") {
	 	closeDialog();
		return true;









	} else if (button == "mad_laptop" && !vars.accusedJacob) {
		resizeCanvas(800, 600);
		//changeMainScreen("router");
		//if user changes url in-game, they'll be stuck because it doesn't let us enter .'s'
		changeBrowserWebPage(browser, "http://192.168.0.1");

		displayBrowser("rout");
		if (!vars.routerChecked && !vars.askedAboutRouter) {
			showDialog("apartment_partner_dialog_5");
			vars.askedAboutRouter = true;
		}
		return true;
	} else if (button == "mad_laptop" && vars.accusedJacob) {
		resizeCanvas(800,600);
		changeBrowserWebPage(browser, "http://192.168.0.1");
		displayBrowser("rout");
		return true;
	} else if ((button == "browser-minimize" || button == "browser-x") && !vars.accusedJacob) {
		if (!vars.routerChecked) {
			showDialog("rout1");
			return true;
		} else {
			vars.routerChecked = true;
			closeBrowser(false);
			resizeCanvas(1153, 648.5);
			if (vars.inHerRoom) {
				changeMainScreen("madeline_room");
				if (vars.sawHistory && !vars.accusedJacob) {
					showDialog("apartment_partner_dialog_13");
				}
			} else {
				changeMainScreen("jacob_room");
			}
			if (!vars.sawHistory) {
				showDialog("madeline_dialog_4");
			}
			return true;
		}
	} else if ((button == "browser-minimize" || button == "browser-x") && vars.accusedJacob) {
		showDialog("rout1");
		return true;
	} else if (button == "dialog_rout1_Okay.") {
		closeDialog();
		return true;
	} else if ((button == "wired_button" || button == "wireless_button") && !vars.accusedJacob) { //was metAll
		showDialog("rout2");
		return true;
	} else if (button == "dialog_rout2_Alright.") {
		closeDialog();
		return true;
	} else if (button == "wired_button" && vars.accusedJacob) {
		showDialog("rout2");
		return true;
	} else if (button == "wireless_button" && vars.accusedJacob) {
		changeBrowserWebPage(browser, "http://192.168.0.1/wireless");
		return true;
	}	else if (button == "factory_button") {
		showDialog("stop_reset");
		return true;
	} else if (button == "history_button") {
		if (!vars.accusedJacob) {
			changeBrowserWebPage(browser, "http://192.168.0.1/history");
			vars.routerChecked = true;
		} else {
			showDialog("rout2");
		}
		return true;
	} else if (button == "broadcast") {
		showDialog("apartment_partner_dialog_8");
		return true;
	} else if (button == "dialog_apartment_partner_dialog_8_Okay.") {
		closeDialog();
		return true;
	} else if (button == "change_ssid") {
		if (!vars.changedSSID) {
			showDialog("apartment_partner_dialog_9");
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless/ssid");
		} else {
			showDialog("rout2");
		}
		return true;
	} else if (button == "dialog_apartment_partner_dialog_9_Okay.") {
		closeDialog();
		return true;
	} else if (button == "ssid_finish_button") {
		if (vars.ssid_entry == vars.new_ssid) {
			vars.changedSSID = true;
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless");
		} else {
			showDialog("apartment_partner_dialog_15");
		}
		return true;
	} else if (button == "dialog_apartment_partner_dialog_15_Okay.") {
		closeDialog();
		return true;
	} else if (button == "parental") {
		showDialog("apartment_partner_dialog_10");
		return true;
	} else if (button == "dialog_apartment_partner_dialog_10_Okay.") {
		closeDialog();
		return true;
	} else if (button == "set_pwd") {
		if (!vars.changedPassword) {
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless/password");
			showDialog("apartment_partner_dialog_11");
			return true;
		} else {
			showDialog("apartment_partner_dialog_12");
		}
	} else if (button == "dialog_apartment_partner_dialog_11_Okay.") {
		closeDialog();
		showDialog("madeline_dialog_13");
		return true;
	} else if (button == "dialog_madeline_dialog_13_Okay.") {
		closeDialog();
		return true;
	} else if (button == "dialog_apartment_partner_dialog_12_Okay.") {
		closeDialog();
		return true;
	} else if (button == "dialog_apartment_partner_dialog_13_Okay.") {
		closeDialog();
		return true;














	} else if (button == "dialog_stop_reset_dialog_Okay.") {
		closeDialog();
		return true;
	} else if (button == "dialog_rout1_Okay.") {
		closeDialog();
	} else if (button == "dialog_apartment_partner_dialog_5_Continue."){
		closeDialog();
		showDialog("madeline_dialog_3");
		return true;
	} else if (button == "dialog_madeline_dialog_3_Okay.") {
		closeDialog();
		return true;
	} else if (button == "dialog_madeline_dialog_4_Continue.") {
		closeDialog();
		showDialog("madeline_dialog_5");
		return true;
	} else if (button == "dialog_madeline_dialog_5_Okay.") {
		closeDialog();
		showDialog("apartment_partner_dialog_6");
		return true;
	} else if (button == "dialog_apartment_partner_dialog_6_Okay.") {
		closeDialog();
		vars.metMadeline = true;
		vars.sawHistory = true;
		return true;
	} else if (button == "mad" && vars.metMadeline) {
		if (!vars.accusedJacob) {
			showDialog("madeline_dialog_6");
		} else {
			showDialog("madeline_dialog_12");
		}
		return true;
	} else if (button == "dialog_madeline_dialog_12_Okay.") {
		closeDialog();
		return true;
	} else if (button == "mad" && !vars.metMadeline) {
		showDialog("apartment_partner_dialog_4");
		return true;
	} else if (button == "dialog_madeline_dialog_6_Okay.") {
		closeDialog();
		return true;
	} else if (button == "door3" && vars.routerChecked && !vars.metAll) {
		vars.leftMadeline = true;
		changeMainScreen("apartment");
		return true;
	} else if (button == "door3" && !vars.routerChecked && !vars.metAll) {
		showDialog("apartment_partner_dialog_4");
		return true;
	} else if (button == "door3" && vars.metAll) {
		showDialog("rout2");
		return true;








	} else if (button == "emily_door" && !vars.metMadeline) {
		showDialog("apartment_partner_dialog_2");
		return true;
	} else if (button == "dialog_apartment_partner_dialog_2_Okay.") {
		closeDialog();
		return true;
	} else if (button == "emily_door") {
		changeMainScreen("emily_room");
		if (!vars.metAll && !vars.metEmily) {
			showDialog("emily_dialog");
		}
		return true;
	} else if (button == "dialog_emily_dialog_Continue.") {
		closeDialog();
		showDialog("emily_dialog_2");
		return true;
	} else if (button == "dialog_emily_dialog_2_Okay.") {
		closeDialog();
		vars.metEmily = true;
		return true;
	} else if (button == "em" && vars.metEmily) {
		showDialog("emily_dialog_3");
		return true;
	} else if (button == "dialog_emily_dialog_3_Okay.") {
		closeDialog();
		return true;
	} else if (button == "door2") {
		changeMainScreen("apartment");
		if (vars.metJacob && vars.metBilly) {
			showDialog("apartment_partner_dialog_7");
		}
		return true;









	} else if (button == "jacob_door" && !vars.metMadeline) {
		showDialog("apartment_partner_dialog_2");
		return true;
	} else if (button == "dialog_apartment_partner_dialog_2_Okay.") {
		closeDialog();
		return true;
	} else if (button == "jacob_door") {
		vars.inHerRoom = false;
		changeMainScreen("jacob_room");
		if (!vars.metAll && !vars.metJacob) {
			showDialog("jacob_dialog");
		}
		return true;
	} else if (button == "dialog_jacob_dialog_Continue.") {
		closeDialog();
		showDialog("jacob_dialog_2");
		return true;
	} else if (button == "dialog_jacob_dialog_2_Continue.") {
		closeDialog();
		showDialog("jacob_dialog_3");
		return true;
	} else if (button == "dialog_jacob_dialog_3_Continue.") {
		closeDialog();
		showDialog("jacob_dialog_4");
		return true;
	} else if (button == "dialog_jacob_dialog_4_Okay. Thanks.") {
		closeDialog();
		vars.metJacob = true;
		return true;
	} else if (button == "jac" && vars.metJacob) {
		showDialog("jacob_dialog_5");
		return true;
	} else if (button == "dialog_jacob_dialog_5_Okay.") {
		closeDialog();
		return true;
	} else if (button == "jacob_phone") {
		resizeCanvas(500,600);
		changeBrowserWebPage(browser, "Jacob's Phone Networks");
		displayBrowser("rout");
		return true;
	} else if (button == "door1") {
		changeMainScreen("apartment");
		if (vars.metEmily && vars.metBilly) {
			showDialog("apartment_partner_dialog_7");
		}
		return true;









	} else if (button == "billy_door" && !vars.metMadeline) {
		showDialog("apartment_partner_dialog_2");
		return true;
	} else if (button == "dialog_apartment_partner_dialog_2_Okay.") {
		closeDialog();
		return true;
	} else if (button == "billy_door") {
		changeMainScreen("billy_room");
		if (!vars.MetAll && !vars.metBilly) {
			showDialog("billy_dialog");
		}
		return true;
	} else if (button == "dialog_billy_dialog_Continue.") {
		closeDialog();
		showDialog("billy_dialog_2");
		return true;
	} else if (button == "dialog_billy_dialog_2_Okay.") {
		closeDialog();
		vars.metBilly = true;
		return true;
	} else if (button == "bill" && vars.metBilly && !vars.ethicsWithBilly) {
		showDialog("billy_dialog_3");
		return true;
	} else if (button == "bill" && vars.ethicsWithBilly) {
		showDialog("billy_dialog_6");
		return true;
	} else if (button == "dialog_billy_dialog_3_Sure.") {
		vars.helpBilly = true;
		closeDialog();
		showDialog("billy_dialog_4");
		return true;
	} else if (button == "dialog_billy_dialog_3_Sorry.") {
		vars.ratBilly = true;
		closeDialog();
		showDialog("billy_dialog_5");
		return true;
	} else if (button == "dialog_billy_dialog_4_Okay." || button == "dialog_billy_dialog_5_Okay." ||
		button == "dialog_billy_dialog_6_Maybe.") {
		vars.ethicsWithBilly = true;
		closeDialog();
		return true;
	} else if (button == "door") {
		changeMainScreen("apartment");
		if (vars.metJacob && vars.metEmily) {
			showDialog("apartment_partner_dialog_7");
		}
		return true;







	} else if (button == "dialog_apartment_partner_dialog_7_Okay.") {
		vars.metAll = true;
		closeDialog();
		return true;
	} else if (button == "madeline_door" && vars.metAll) {
		vars.inHerRoom = true;
		changeMainScreen("madeline_room");
		showDialog("madeline_dialog_7");
		return true;
	} else if (button == "dialog_madeline_dialog_7_Continue.") {
		closeDialog();
		showDialog("madeline_dialog_8");
		return true;
	} else if (button == "dialog_madeline_dialog_8_Emily." || button == "dialog_madeline_dialog_8_Billy." || button == "dialog_madeline_dialog_9_Billy."
			|| button == "dialog_madeline_dialog_9_Emily.") {
		closeDialog();
		showDialog("madeline_dialog_9");
		return true;
	} else if (button == "dialog_madeline_dialog_8_Jacob.") {
		vars.accusedJacob = true;
		closeDialog();
		showDialog("madeline_dialog_10");
		return true;
	} else if (button == "dialog_madeline_dialog_9_Jacob.") {
		vars.firstTry = false;
		vars.accusedJacob = true;
		closeDialog();
		showDialog("madeline_dialog_10");
		return true;
	} else if (button == "dialog_madeline_dialog_10_Continue.") {
		closeDialog();
		showDialog("madeline_dialog_11");
		if (!vars.piracy_video_played) {
			playVideo("video/piracy");
			vars.piracy_video_played = true;
		}
		return true;
	} else if (button == "dialog_madeline_dialog_11_Okay.") {
		closeDialog();
		return true;
	} else if (button == "router_password_finish_button") {
		if (vars.router_pwd_entry == vars.theSpotofdot20) {
			vars.changedPassword = true;
			changeBrowserWebPage(browser, "http://192.168.0.1/wireless");
			return true;
		} else {
			showDialog("apartment_partner_dialog_14");
			return true;
		}
	} else if (button == "dialog_apartment_partner_dialog_14_Okay.") {
		closeDialog();
		return true;
	} else if (button == "finish_secure") {
		if (!vars.changedPassword || !vars.changedSSID) {
			showDialog("rout1");
			return true;
		} else {
			closeBrowser();
			changeMainScreen("madeline_room");
			resizeCanvas(1153, 648.5);
			showDialog("madeline_dialog_14");
			return true;
		}
	} else if (button == "dialog_madeline_dialog_14_Continue.") {
		closeDialog();
		showDialog("madeline_dialog_15");
		return true;
	} else if (button == "dialog_madeline_dialog_15_Okay.") {
		closeDialog();
		resizeCanvas(1153, 648.5);

		finishApartment(vars, score_text_element, resizeCanvas, changeMainScreen, playVideo, triggerEmailHack, checkForGameCompletion);
		return true;
	} else if (button == "apartment_failed_quit") {
		returnToPlayerOffice();
		return true;
	}

	else {
		return false;
	}
}

function apartment_text_field_edit (name, value, game) {
	if (name == "ssid_page_entry") {
		game.apartment_variables.ssid_entry = value;
		return true;
	} else if (name == "router_password_entry") {
		game.apartment_variables.router_pwd_entry = value;
		return true;
	} else {
		return false;
	}
}

function finishApartment (vars, score_text_element, resizeCanvas, changeMainScreen, playVideo, triggerEmailHack, checkForGameCompletion) {
	var score = 15 + (vars.firstTry ? 15 : 0) + (vars.helpBilly ? 0 : 0) + (vars.ratBilly ? 0 : 0);
	if (score > vars.score)
	  vars.score = score;
	score_text_element.text = "You Scored " + vars.score + " Points (out of 30)!";
	resizeCanvas(1153, 648.5);
	changeMainScreen("apartment_success");
	if (!vars.wifi_config_video_played) {
	  playVideo("video/wifiConfig");
	  vars.wifi_config_video_played = true;
	}
	if (vars.on_completion_trigger_email_hack) {
		triggerEmailHack();
	}
	checkForGameCompletion();
}
