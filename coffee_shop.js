// DO NOT declare variables at the Top level scope in this file.
// Put them into the game object in the load_coffee_shop() method instead.

function load_coffee_shop (game, addElementToScreen, removeElementFromScreen) {
	game.screens["coffee_shop"] = new Screen (0, 0, 0, new Image ("image/coffeeshop", 0, 0, 0, 0.25), [
		new Button ("coffee_shop_manager", 240, 313, 297, 396, 0), 
		new Button ("coffee_shop_customer_1", 340, 319, 396, 431, 0),
		new Button ("coffee_shop_customer_2", 237, 405, 306, 606, 0),
		new Button ("coffee_shop_customer_3", 606, 305, 655, 374, 0),
		new Button ("coffee_shop_customer_4", 519, 375, 577, 500, 0),
		new Button ("coffee_shop_customer_5", 997, 333, 1064, 403, 0),
		new Button ("coffee_shop_culprit_1", 854, 337, 896, 391, 0),
		new Button ("coffee_shop_culprit_2", 920, 336, 978, 396, 0),
		new Button ("coffee_shop_culprit_3", 1070, 358, 1120, 553, 0)
	], [], []);
	
	game.screens["coffee_shop_success"] = new Screen (0, 0, 0, new Image ("image/mission/complete", 0, 0, 0), [
		new Button ("coffee_shop_failed_quit", 404, 427, 714, 515, 2, "Select Another Mission", "24px Arial", "rgba(255,255,255,1)")
	], [], [
		new Text ("coffee_shop_success_score", 404, 535, 714, 600, 2, ERROR_STRING, "24px Arial", "rgba(255,255,0,1)"),
		new Rectangle ("coffee_shop_success_quit_backing_rectangle", 404, 427, 714, 515, 1, "rgba(255,255,255,0.5)")
	]);
	
	game.screens["coffee_shop_failed"] = new Screen (0, 0, 0, new Image ("image/mission/failed", 0, 0, 0), [
		new Button ("coffee_shop_failed_restart", 224, 427, 534, 515, 2, "Retry Mission?", "24px Arial", "rgba(255,255,255,1)"),
		new Button ("coffee_shop_failed_quit", 628, 427, 938, 515, 2, "Select Another Mission", "24px Arial", "rgba(255,255,255,1")
	], [], [
		new Rectangle ("coffee_shop_failed_restart_backing_rectangle", 224, 427, 534, 515, 1, "rgba(255,255,255,0.5)"),
		new Rectangle ("coffee_shop_failed_quit_backing_rectangle", 628, 427, 938, 515, 1, "rgba(255,255,0,0.5)")
	]);
	
	var manager_name = "Manager";
	var customer_1_name = "Yellow Shirt";
	var customer_2_name = "White Sweater";
	var customer_3_name = "Top Hat";
	var customer_4_name = "Red Shirt";
	var customer_5_name = "Black Suit";
	var culprit_1_name = "Pink Shirt";
	var culprit_2_name = "White Shirt";
	var culprit_3_name = "Brown Sweatshirt";
	
	var ERROR_STRING = "If you see this message, Jonathan Hansford wrote code that didn't work and should be ashamed of it.";
	
	game.dialogs["coffee_shop_manager_dialog"] = new Dialog ("coffee_shop_manager_dialog", game.player_name, "Hello sir. We're the detectives you called for. Do you have any leads?", ["Continue."]);
	game.dialogs["coffee_shop_manager_dialog_2"] = new Dialog ("coffee_shop_manager_dialog_2", manager_name, "The man in the top hat, the man wearing a purple tie, and the woman in a white sweater all told me that they had financial information stolen from them sometime after they left here.", ["Continue."]);
	game.dialogs["coffee_shop_manager_dialog_3"] = new Dialog ("coffee_shop_manager_dialog_3", game.partner_name, "Let's go talk to the victims, " + game.player_name + ".", ["Okay."]);
	game.dialogs["coffee_shop_manager_dialog_4"] = new Dialog ("coffee_shop_manager_dialog_4", manager_name, "Do you know who did it?", ["Yes.", "Not yet."]);
	game.dialogs["coffee_shop_manager_dialog_5"] = new Dialog ("coffee_shop_manager_dialog_5", "", "Click on the person responsible for these crimes!", ["Okay."]);
	game.dialogs["coffee_shop_manager_dialog_6"] = new Dialog ("coffee_shop_manager_dialog_6", manager_name, "You said you knew who did it. Who was it?", ["Yes, I know, it was...", "It was YOU!", "I'm not so sure anymore."]);
	game.dialogs["coffee_shop_manager_dialog_7"] = new Dialog ("coffee_shop_manager_dialog_7", manager_name, "Okay, I'll contact the police.", ["Continue."]);
	
	game.dialogs["coffee_shop_customer_1_dialog"] = new Dialog ("coffee_shop_customer_1_dialog", game.player_name, "Hello, I'm a detective investigating the robberies here. Do you know anything about them?", ["Continue."]);
	game.dialogs["coffee_shop_customer_1_dialog_2"] = new Dialog ("coffee_shop_customer_1_dialog_2", customer_1_name, "I have not been robbed. I've never used the internet in here before, so I think that the robberies have something to do with people's computers.", ["Okay."]);
	
	game.dialogs["coffee_shop_customer_2_dialog"] = new Dialog ("coffee_shop_customer_2_dialog", game.player_name, "Good morning. I'm a detective investigating the robberies that have been occurring here. What can you tell me?", ["Continue."]);
	game.dialogs["coffee_shop_customer_2_dialog_2"] = new Dialog ("coffee_shop_customer_2_dialog_2", customer_2_name, "I ordered Halloween decorations for my house online through amazon.com, using a credit card, last week while sitting in this cafe. The tracking on the package said that the decorations had indeed shipped, " +
		"and are in a warehouse in Clarksville, Maryland, and probably will be delivered in one or two days. I used my card once in the grocery store since then, but on my credit card bill I noticed that there was also a charge " +
		"for a pair of computer headphones on it as well. I just found out today and I'll contact the credit card company once the customer service line opens up.", ["Okay."]);
	
	game.dialogs["coffee_shop_customer_3_dialog"] = new Dialog ("coffee_shop_customer_3_dialog", game.player_name, "Hello, sir. I'm a detective investigating the robberies that happened here. Can you tell me anything about what happened to you?", ["Continue."]);
	game.dialogs["coffee_shop_customer_3_dialog_2"] = new Dialog ("coffee_shop_customer_3_dialog_2", customer_3_name, "Two days ago, I was here, browsing the internet on my laptop looking for top hats, because I need one for my role as Abraham Lincoln in the theatre production I am a part of. I purchased one online from" +
			" amazon.com, using a credit card. The purchase itself was not a scam, for the top hat did arrive as promised. I'm wearing it now. I haven't made any other purchases with the card since, so I am pretty sure my card" +
			" information was stolen here. Whoever has my card number used it to purchase a USB mouse. I cancelled that card but I couldn't remove my liability from the mouse purchase.", ["Okay."]);
			
	game.dialogs["coffee_shop_customer_4_dialog"] = new Dialog ("coffee_shop_customer_4_dialog", game.player_name, "Hello. I'm a detective investigating the robberies that happened here. Do you have any information that could help me?", ["Continue."]);
	game.dialogs["coffee_shop_customer_4_dialog_2"] = new Dialog ("coffee_shop_customer_4_dialog_2", customer_4_name, "I was in a hurry coming into work yesterday and did not have time to pay my credit card bill at my house. Since I cannot live without my morning coffee, I came here and paid my bill online. The " +
			"payment was successfully received, but that afternoon, when I went to the ATM to withdraw some cash, I found that my bank account balance, which should have been $342, was 0. I then went to the bank for a statement " +
			"to see if there had been a mistake. The statement showed someone electronically withdrew the $342 I had, and transferred the money to a Capital One bank account.", ["Okay."]);
			
	game.dialogs["coffee_shop_customer_5_dialog"] = new Dialog ("coffee_shop_customer_5_dialog", game.player_name, "Good morning, I'm a detective on the case of the robberies here. Do you know anything that could help me?", ["Continue."]);
	game.dialogs["coffee_shop_customer_5_dialog_2"] = new Dialog ("coffee_shop_customer_5_dialog_2", customer_5_name, "No. I don't usually come here. I didn't realize there was criminal activity going on here. Maybe I should leave.", ["Okay."]);

	game.dialogs["coffee_shop_culprit_1_dialog"] = new Dialog ("coffee_shop_culprit_1_dialog", game.player_name, "Hello, I'm investigating robberies that have been occurring here recently. Have you heard anything about them?", ["Continue."]);
	game.dialogs["coffee_shop_culprit_1_dialog_2"] = new Dialog ("coffee_shop_culprit_1_dialog_2", culprit_1_name, "No, I've never been robbed here. I'm not using the Wi-Fi. I've come here for inspiration to attempt to start writing a book.", ["Okay."]);
	
	game.dialogs["coffee_shop_culprit_2_dialog"] = new Dialog ("coffee_shop_culprit_2_dialog", game.player_name, "I'm investigating the robberies here. Do you have any information about them?", ["Continue."]);
	game.dialogs["coffee_shop_culprit_2_dialog_2"] = new Dialog ("coffee_shop_culprit_2_dialog_2", culprit_2_name, "No. I'm just looking at cat pictures on the internet. Isn't this the cutest cat you ever saw?", ["Yes.", "No.", "Maybe."]);
	game.dialogs["coffee_shop_culprit_2_dialog_3"] = new Dialog ("coffee_shop_culprit_2_dialog_3", culprit_2_name, "You might be an insightful investigator, but you don't know anything when it comes to cute cats.", ["Okay."]);
	game.dialogs["coffee_shop_culprit_2_dialog_4"] = new Dialog ("coffee_shop_culprit_2_dialog_4", culprit_2_name, "Good, I'm glad you agree with me.", ["Okay."]);
	
	game.dialogs["coffee_shop_culprit_3_dialog"] = new Dialog ("coffee_shop_culprit_3_dialog", game.player_name, "Hello, sir. I'm working on a case involving robberies at this cafe. Do you know anything pertinent to that matter?", ["Continue."]);
	game.dialogs["coffee_shop_culprit_3_dialog_2"] = new Dialog ("coffee_shop_culprit_3_dialog_2", culprit_3_name, "No, I don't. I've never been robbed here. I just lost my job in Cincinnati, and I came here. I'm playing Words with Friends while I wait for job application responses.", ["Okay."]);
	
	game.dialogs["coffee_shop_partner_dialog"] = new Dialog ("coffee_shop_partner_dialog", game.partner_name, "Let's speak to the manager and let him know we are here. He's behind the counter.", ["Okay."]);
	game.dialogs["coffee_shop_partner_dialog_2"] = new Dialog ("coffee_shop_partner_dialog_2", game.partner_name, "Let's interview everyone else in here we haven't yet, they might have information or be the one responsible for these robberies.", ["Okay."]);
	game.dialogs["coffee_shop_partner_dialog_3"] = new Dialog ("coffee_shop_partner_dialog_3", game.partner_name, "Let's talk to the manager and tell her who did it.", ["Okay."]);
	
	game.dialogs["coffee_shop_player_dialog"] = new Dialog ("coffee_shop_player_dialog", game.player_name, ERROR_STRING, ["Continue."]);
	
	game.dialogs["coffee_shop_police_dialog"] = new Dialog ("coffee_shop_police_dialog", "Police", "We have reasonable suspicion to believe that you are the one responsible for the robberies at this cafe!", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_2"] = new Dialog ("coffee_shop_police_dialog_2", "Police", "Hmm. I don't see anything malicious. Looks like you got the wrong guy.", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_3"] = new Dialog ("coffee_shop_police_dialog_3", "Police", "Man, this " + game.player_name + " is the worst detective ever!", ["Okay."]);
	game.dialogs["coffee_shop_police_dialog_4"] = new Dialog ("coffee_shop_police_dialog_4", "Police", "Well the processes on your PC say otherwise! You're downloading all the Wi-Fi traffic onto your computer! You're under arrest for fraud and robbery. You have the right to remain silent. Anything you say can be used against you in a court of law. You have the right to an attorney. If you cannot afford one, one will be provided for you.", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_5"] = new Dialog ("coffee_shop_police_dialog_5", manager_name, "Why'd you do it?! I hope you learn your lesson in jail.", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_6"] = new Dialog ("coffee_shop_police_dialog_6", "Police", "We've got all the evidence we need. We'll handle it from here, Detective " + game.player_name + ".", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_7"] = new Dialog ("coffee_shop_police_dialog_7", manager_name, "Thank you for your help, " + game.player_name + " and " + game.partner_name + ". With the robber in custody, I'll be able to resume business as usual again. I'll post a notice regarding the risk of using my public network for financial transactions.", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_8"] = new Dialog ("coffee_shop_police_dialog_8", customer_2_name, "Yeah, thanks guys! I had no idea that wireless network connections could be easily intercepted, even if the website itself is secure. I won't buy anything on a public network again.", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_9"] = new Dialog ("coffee_shop_police_dialog_9", game.partner_name, "No problem, we're glad to help.", ["Continue."]);
	game.dialogs["coffee_shop_police_dialog_10"] = new Dialog ("coffee_shop_police_dialog_10", manager_name, "Well I owe you one. Stop by another time and I'll give you some free coffee.", ["Okay."]);
	
	game.dialogs["coffee_shop_accused_dialog"] = new Dialog ("coffee_shop_accused_dialog", ERROR_STRING, "I swear I'm innocent!", ["Continue."]);
	
	game.coffee_shop_variables = {
		spoken_to_manager:false,
		spoken_to_customer_1:false,
		spoken_to_customer_2:false,
		spoken_to_customer_3:false,
		spoken_to_customer_4:false,
		spoken_to_customer_5:false,
		spoken_to_culprit_1:false,
		spoken_to_culprit_2:false,
		spoken_to_culprit_3:false,
		entry_message_shown:false,
		partner_dialog_2_shown:false,
		partner_dialog_3_shown:false,
		picking_culprit:false,
		names_of_people:{coffee_shop_manager:manager_name, coffee_shop_customer_1:customer_1_name, coffee_shop_customer_2:customer_2_name, coffee_shop_customer_3:customer_3_name, coffee_shop_customer_4:customer_4_name, coffee_shop_customer_5:customer_5_name, coffee_shop_culprit_1:culprit_1_name, coffee_shop_culprit_2:culprit_2_name, coffee_shop_culprit_3:culprit_3_name},
		after_accused_speaks_show:"coffee_shop_police_dialog_2",
		cat_shown:"sunshine",
		cat_vote:0,
		cat_display_element:new Image("image/sunshine", 448, 237, 1000),
		background_music_audio_id:"audio/mall",
		times_reset:0,
		score:0,
		wifi_sniffing_video_played:false,
		on_completion_trigger_email_hack:false
	};
	
	coffeeShopSetRandomCulprit(game.coffee_shop_variables, game, addElementToScreen, removeElementFromScreen);
}

function coffeeShopSetRandomCulprit (vars, game, addElementToScreen, removeElementFromScreen) {
	var random_num = 1 + Math.floor(Math.random() * 3); // An integer from 1 to 3, inclusive
	var second_random_num = Math.floor(Math.random() * 2); // Either 0 or 1 with equal probability
	
	var culprit_1_mouse = new Image ("image/electronics-02", 807, 382, 1, 0.01); // scale: 1%
	var culprit_1_headset = new Image ("image/electronics-03", 790, 381, 1, 0.01); // scale: 1%
	
	var culprit_2_mouse = new Image ("image/electronics-02", 886, 388, 1, 0.01); // scale: 1%
	var culprit_2_headset = new Image ("image/electronics-03", 949, 393, 1, 0.01); // scale: 1%
	
	var culprit_3_mouse = new Image ("image/electronics-01", 992, 472, 1, 0.01); // scale: 1%
	var culprit_3_headset = new Image ("image/electronics-03", 900, 472, 1, 0.015); // scale: 1.5% 
	
	for (var i = 0; game.screens["coffee_shop"].extras.length; i++) {
		if (game.screens["coffee_shop"].extras[i].type == 'image' && game.screens["coffee_shop"].extras[i].id.indexOf("image/electronics") == 0) {
			removeElementFromScreen(game.screens["coffee_shop"], game.screens["coffee_shop"].extras[i]);
			i--;
		}
	}
	
	if (random_num == 1) {
		vars.culprit = "coffee_shop_culprit_1"
		
		addElementToScreen(game.screens["coffee_shop"], culprit_1_mouse);
		addElementToScreen(game.screens["coffee_shop"], culprit_1_headset);
		if (second_random_num == 0) {
			addElementToScreen(game.screens["coffee_shop"], culprit_2_mouse);
			addElementToScreen(game.screens["coffee_shop"], culprit_3_headset);
		} else {
			addElementToScreen(game.screens["coffee_shop"], culprit_3_mouse);
			addElementToScreen(game.screens["coffee_shop"], culprit_2_headset);
		}
	} else if (random_num == 2) {
		vars.culprit = "coffee_shop_culprit_2"
		
		addElementToScreen(game.screens["coffee_shop"], culprit_2_mouse);
		addElementToScreen(game.screens["coffee_shop"], culprit_2_headset);
		if (second_random_num == 0) {
			addElementToScreen(game.screens["coffee_shop"], culprit_1_mouse);
			addElementToScreen(game.screens["coffee_shop"], culprit_3_headset);
		} else {
			addElementToScreen(game.screens["coffee_shop"], culprit_3_mouse);
			addElementToScreen(game.screens["coffee_shop"], culprit_1_headset);
		}
	} else {
		vars.culprit = "coffee_shop_culprit_3"
		
		addElementToScreen(game.screens["coffee_shop"], culprit_3_mouse);
		addElementToScreen(game.screens["coffee_shop"], culprit_3_headset);
		if (second_random_num == 0) {
			addElementToScreen(game.screens["coffee_shop"], culprit_1_mouse);
			addElementToScreen(game.screens["coffee_shop"], culprit_2_headset);
		} else {
			addElementToScreen(game.screens["coffee_shop"], culprit_2_mouse);
			addElementToScreen(game.screens["coffee_shop"], culprit_1_headset);
		}
	}
}

function resetCoffeeShopVariables (vars, game, addElementToScreen, removeElementFromScreen, removeAllAtLocationFromTodoList) {
	vars.spoken_to_manager = false;
	vars.spoken_to_customer_1 = false;
	vars.spoken_to_customer_2 = false;
	vars.spoken_to_customer_3 = false;
	vars.spoken_to_customer_4 = false;
	vars.spoken_to_customer_5 = false;
	vars.spoken_to_culprit_1 = false;
	vars.spoken_to_culprit_2 = false;
	vars.spoken_to_culprit_3 = false;
	vars.entry_message_shown = false;
	vars.partner_dialog_2_shown = false;
	vars.partner_dialog_3_shown = false;
	vars.picking_culprit = false;
	vars.times_reset++;
	
	coffeeShopSetRandomCulprit(vars, game, addElementToScreen, removeElementFromScreen);
	removeAllAtLocationFromTodoList("Coffee Shop");
}

function coffeeShopPickCulprit (accused, showDialog, closeDialog, vars, game) {
	game.dialogs["coffee_shop_player_dialog"].text = vars.names_of_people[accused] + " is the one responsible.";
	game.dialogs["coffee_shop_accused_dialog"].title = vars.names_of_people[accused]
	if (accused == vars.culprit) {
		vars.after_accused_speaks_show = "coffee_shop_police_dialog_4";
	} else {
		vars.after_accused_speaks_show = "coffee_shop_police_dialog_2";
	}		
	showDialog("coffee_shop_player_dialog");
}

function coffeeShopShowPartnerDialog (showDialog, closeDialog, vars) {
	if (!vars.partner_dialog_3_shown && vars.spoken_to_manager && vars.spoken_to_customer_1 && vars.spoken_to_customer_2 && vars.spoken_to_customer_3 && vars.spoken_to_customer_4 && vars.spoken_to_customer_5 && vars.spoken_to_culprit_1 && vars.spoken_to_culprit_2 && vars.spoken_to_culprit_3) {
		vars_partner_dialog_2_shown = true;	
		showDialog("coffee_shop_partner_dialog_3");
	} else if (!vars.partner_dialog_2_shown && vars.spoken_to_customer_2 && vars.spoken_to_customer_3 && vars.spoken_to_customer_4) {
		showDialog("coffee_shop_partner_dialog_2");		
	}
}

function coffeeShopCheckCompletionOfSpeakToWitnessesTask(markAsComplete, vars) {
	if (vars.spoken_to_customer_2 && vars.spoken_to_customer_3 && vars.spoken_to_customer_4) {
		markAsComplete("coffee_shop_task_speak_to_witnesses", "Coffee Shop", true);
	}
}

function enterCoffeeShop (resizeCanvas, changeMainScreen, showDialog, addToTodoList, vars) {
	changeMainScreen("coffee_shop");
	resizeCanvas(1223, 674);
	if (!vars.entry_message_shown) {
		showDialog("coffee_shop_partner_dialog");
		addToTodoList(new TodoTask("coffee_shop_task_speak_to_manager", "Coffee Shop", "Speak with Manager"));
	}
}

// Returns true if the input event is consumed by this function, false if it does not.
// Takes the name of the button and whatever other arguments it needs from the server.js in order to work.
// Here vars is game.coffee_shop_variables as assigned above.
function coffee_shop_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, removeElementFromScreen, playVideo, addToTodoList, removeFromTodoList, removeAllAtLocationFromTodoList, markAsComplete, checkForGameCompletion, triggerEmailHack, returnToPlayerOffice, vars, game) {
	if (button == "coffee_shop_manager") {
		if (!vars.spoken_to_manager) {			
			showDialog("coffee_shop_manager_dialog");
			markAsComplete("coffee_shop_task_speak_to_manager", "Coffee Shop", true);
			addToTodoList(new TodoTask("coffee_shop_task_speak_to_witnesses", "Coffee Shop", "Talk to witnesses (man wearing a top hat, woman wearing a red shirt, woman reading the newspaper)."));
			addToTodoList(new TodoTask("coffee_shop_task_speak_to_manager_2", "Coffee Shop", "When you've identified the culprit, speak with the manager again."));
		} else if (vars.picking_culprit) {
			showDialog("coffee_shop_manager_dialog_6");
		} else {
			showDialog("coffee_shop_manager_dialog_4");
		}
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_manager_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_2_Continue." ) {
		closeDialog();
		showDialog("coffee_shop_manager_dialog_3");
		return true;
	} else if (button =="dialog_coffee_shop_manager_dialog_3_Okay." ) {
		closeDialog();
		vars.spoken_to_manager = true;
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_4_Yes.") {
		closeDialog();
		showDialog("coffee_shop_manager_dialog_5");	
		markAsComplete("coffee_shop_task_speak_to_manager_2", "Coffee Shop", true);
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_4_Not yet.") {
		closeDialog();
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_5_Okay.") {
		vars.picking_culprit = true;
		addToTodoList(new TodoTask ("coffee_shop_task_select_culprit", "Coffee Shop", "Select the culprit."));
		closeDialog();
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_6_Yes, I know, it was...") {
		closeDialog();
		showDialog("coffee_shop_manager_dialog_5");
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_6_It was YOU!") {
		closeDialog();
		coffeeShopPickCulprit("coffee_shop_manager", showDialog, closeDialog, vars, game);
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_6_I'm not so sure anymore.") {
		vars.picking_culprit = false;
		closeDialog();
		markAsComplete('coffee_shop_task_speak_to_manager_2', 'Coffee Shop', false);
		removeFromTodoList('coffee_shop_task_select_culprit', 'Coffee Shop');
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_7_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog");
		return true;
	} else if (button == "coffee_shop_customer_1") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_customer_1_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_customer_1_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_1_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_1_dialog_2_Okay.") {
		vars.spoken_to_customer_1 = true;
		closeDialog();
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		return true;
	} else if (button == "coffee_shop_customer_2") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_customer_2_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_customer_2_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_2_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_2_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_2 = true;
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		coffeeShopCheckCompletionOfSpeakToWitnessesTask(markAsComplete, vars);
		return true;
	} else if (button == "coffee_shop_customer_3") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_customer_3_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_customer_3_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_3_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_3_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_3 = true;
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		coffeeShopCheckCompletionOfSpeakToWitnessesTask(markAsComplete, vars);
		return true;
	} else if (button == "coffee_shop_customer_4") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_customer_4_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_customer_4_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_4_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_4_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_4 = true;
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		coffeeShopCheckCompletionOfSpeakToWitnessesTask(markAsComplete, vars);
		return true;
	} else if (button == "coffee_shop_customer_5") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_customer_5_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_customer_5_dialog_Continue.") { 
		closeDialog();
		showDialog("coffee_shop_customer_5_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_5_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_5 = true;
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		return true;
	} else if (button == "coffee_shop_culprit_1") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_culprit_1_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_culprit_1_dialog_Continue.") { 
		closeDialog();
		showDialog("coffee_shop_culprit_1_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_culprit_1_dialog_2_Okay.") { 
		closeDialog();
		vars.spoken_to_culprit_1 = true;
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		return true;
	} else if (button == "coffee_shop_culprit_2") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_culprit_2_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_culprit_2_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_culprit_2_dialog_2");
		addElementToScreen(game.dialogs["coffee_shop_culprit_2_dialog_2"].screen, vars.cat_display_element);
		return true;
	} else if (button == "dialog_coffee_shop_culprit_2_dialog_2_Yes.") {
		closeDialog();
		showDialog("coffee_shop_culprit_2_dialog_4");
		vars.cat_vote = 1;
		return true;
	} else if (button == "dialog_coffee_shop_culprit_2_dialog_2_No.") {
		closeDialog();
		showDialog("coffee_shop_culprit_2_dialog_3");
		vars.cat_vote = -1;
		return true;
	} else if (button == "dialog_coffee_shop_culprit_2_dialog_2_Maybe.") {
		closeDialog();
		showDialog("coffee_shop_culprit_2_dialog_3");
		vars.cat_vote = 0;
		return true;
	} else if (button == "dialog_coffee_shop_culprit_2_dialog_3_Okay.") {
		vars.spoken_to_culprit_2 = true;
		closeDialog();
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		return true;
	} else if (button == "dialog_coffee_shop_culprit_2_dialog_4_Okay.") {
		vars.spoken_to_culprit_2 = true;
		closeDialog();
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		return true;
	} else if (button == "coffee_shop_culprit_3") {
		if (vars.picking_culprit) {
			coffeeShopPickCulprit(button, showDialog, closeDialog, vars, game);
		} else {
			showDialog("coffee_shop_culprit_3_dialog");
		}
		return true;
	} else if (button == "dialog_coffee_shop_culprit_3_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_culprit_3_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_culprit_3_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_culprit_3 = true;
		coffeeShopShowPartnerDialog(showDialog, closeDialog, vars);
		return true;
	} else if (button == "dialog_coffee_shop_partner_dialog_Okay.") {
		closeDialog();
		vars.entry_message_shown = true;
		return true;
	} else if (button == "dialog_coffee_shop_partner_dialog_2_Okay.") {
		closeDialog();
		vars.partner_dialog_2_shown = true;
		return true;
	} else if (button == "dialog_coffee_shop_partner_dialog_3_Okay.") {
		closeDialog();
		vars.partner_dialog_3_shown = true;
		return true;
	} else if (button == "dialog_coffee_shop_player_dialog_Continue.") {
		closeDialog();
		markAsComplete("coffee_shop_task_select_culprit", "Coffee Shop", true);
		showDialog("coffee_shop_manager_dialog_7");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_accused_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_2_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog_3");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_3_Okay.") {
		closeDialog();
		resizeCanvas(1152, 648);
		resetCoffeeShopVariables(vars, game, addElementToScreen, removeElementFromScreen, removeAllAtLocationFromTodoList);
		changeMainScreen("coffee_shop_failed");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_4_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog_5");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_5_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog_6");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_6_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog_7");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_7_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog_8");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_8_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog_9");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_9_Continue.") {
		closeDialog();
		showDialog("coffee_shop_police_dialog_10");
		return true;
	} else if (button == "dialog_coffee_shop_police_dialog_10_Okay.") {
		closeDialog();
		resizeCanvas(1152, 648);
		var score = Math.floor(30/(vars.times_reset+1));
		if (score <= 0) score = 1;
		if (vars.score < score)
			vars.score = score;
		// Finds the score element puts the score in it.
		for (var i = 0; i < game.screens["coffee_shop_success"].extras.length; i++)
			if (game.screens["coffee_shop_success"].extras[i].name == "coffee_shop_success_score")
				game.screens["coffee_shop_success"].extras[i].text = "You Scored " + vars.score + " Points (out of 30)!";
		resetCoffeeShopVariables(vars, game, addElementToScreen, removeElementFromScreen, removeAllAtLocationFromTodoList);
		changeMainScreen("coffee_shop_success");
		checkForGameCompletion();
		if (!vars.wifi_sniffing_video_played) {
			vars.wifi_sniffing_video_played = true;
			playVideo("video/wifiSniffing");
		}
		if (vars.on_completion_trigger_email_hack) {
			triggerEmailHack();
		}
		return true;
	} else if (button == "dialog_coffee_shop_accused_dialog_Continue.") {
		closeDialog();
		showDialog(vars.after_accused_speaks_show);
		return true;
	} else if (button == "go_to_coffee_shop") { // Button on the phone's map app.
		enterCoffeeShop(resizeCanvas, changeMainScreen, showDialog, addToTodoList, vars);
		return false; // Allow the main file to handle this event as well.
	} else if (button == "coffee_shop_failed_restart") {
		enterCoffeeShop(resizeCanvas, changeMainScreen, showDialog, addToTodoList, vars);
		return true; // This may need to be modified in the future.
	} else if (button == "coffee_shop_failed_quit") {
		returnToPlayerOffice();
		return true;
	} else
		return false;
}