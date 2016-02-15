// DO NOT declare variables at the Top level scope in this file.
// Put them into the game object in the load_coffee_shop() method instead.

function load_coffee_shop (game) {
	game.screens["coffee_shop"] = new Screen (0, 0, 0, new Image ("image/coffeeshop", 0, 0, 0), [
		new Button ("coffee_shop_manager", 268, 313, 328, 396), 
		new Button ("coffee_shop_customer_1", 342, 321, 398, 530),
		new Button ("coffee_shop_customer_2", 173, 440, 314, 596),
		new Button ("coffee_shop_customer_3", 582, 321, 627, 383),
		new Button ("coffee_shop_customer_4", 534, 381, 577, 500),
		new Button ("coffee_shop_customer_5", 979, 353, 1021, 418),
		new Button ("coffee_shop_culprit_1", 823, 363, 868, 405),
		new Button ("coffee_shop_culprit_2", 894, 354, 947, 411),
		new Button ("coffee_shop_culprit_3", 1049, 391, 1106, 527)
	], [], []);
	
	var customer_1_name = "Black Jeans";
	var customer_2_name = "Newspaper";
	var customer_3_name = "Top Hat";
	var customer_4_name = "Red Shirt";
	var customer_5_name = "Pink Shirt";
	var culprit_1_name = "Gray Hair";
	var culprit_2_name = "Black Suit";
	var culprit_3_name = "Plaid shirt";
	
	game.dialogs["coffee_shop_manager_dialog"] = new Dialog ("coffee_shop_manager_dialog", game.player_name, "Hello ma'am. We're the detectives you called for. Do you have any leads?", ["Continue."]);
	game.dialogs["coffee_shop_manager_dialog_2"] = new Dialog ("coffee_shop_manager_dialog_2", "Manager", "The guy in the top hat, the woman in the red shirt, and the woman in a gray shirt reading the newspaper all told me that they got robbed sometime after they left here.", ["Continue."]);
	game.dialogs["coffee_shop_manager_dialog_3"] = new Dialog ("coffee_shop_manager_dialog_3", game.partner_name, "Let's go talk to the victims, " + game.player_name, ["Okay."]);
	game.dialogs["coffee_shop_manager_dialog_4"] = new Dialog ("coffee_shop_manager_dialog_4", "Manager", "Do you know who did it?", ["Yes.", "Not yet."]);
	game.dialogs["coffee_shop_manager_dialog_5"] = new Dialog ("coffee_shop_manager_dialog_5", "", "Click on the person responsible for these crimes!", ["Okay."]);
	
	game.dialogs["coffee_shop_customer_1_dialog"] = new Dialog ("coffee_shop_customer_1_dialog", game.player_name, "Hello, I'm a detective investigating the robberies here. Do you know anything about them?", ["Continue."]);
	game.dialogs["coffee_shop_customer_1_dialog_2"] = new Dialog ("coffee_shop_customer_1_dialog_2", customer_1_name, "I have not been robbed. I've never used a computer in here before, so I think that the robberies have something to do with people's computers.", ["Okay."]);
	
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
	game.dialogs["coffee_shop_culprit_1_dialog_2"] = new Dialog ("coffee_shop_culprit_1_dialog_2", culprit_1_name, "No, I've never been robbed here. I'm not using the internet. I've come here for inspiration to attempt to start writing a book.", ["Okay."]);
	
	game.dialogs["coffee_shop_culprit_2_dialog"] = new Dialog ("coffee_shop_culprit_2_dialog", game.player_name, "I'm investigating the robberies here. Do you have any information about them?", ["Continue."]);
	game.dialogs["coffee_shop_culprit_2_dialog_2"] = new Dialog ("coffee_shop_culprit_2_dialog_2", culprit_2_name, "No. I'm just looking at cat pictures on the internet. Isn't this the cutest cat you ever saw?", ["Continue."]);
	
	game.dialogs["coffee_shop_culprit_3_dialog"] = new Dialog ("coffee_shop_culprit_3_dialog", game.player_name, "Hello, sir. I'm working on a case involving robberies at this cafe. Do you know anything pertinent to that matter?", ["Continue."]);
	game.dialogs["coffee_shop_culprit_3_dialog"] = new Dialog ("coffee_shop_culprit_3_dialog_2", culprit_3_name, "No, I don't. I've never been robbed here. I just lost my job in Cincinnati, and I came here. I'm playing Words with Friends while I wait for job application responses.", ["Okay."]);
	
	game.dialogs["coffee_shop_partner_dialog"] = new Dialog ("coffee_shop_partner_dialog", game.partner_name, "Let's speak to the manager and let her know we are here. She's behind the counter.", ["Okay."]);
	game.dialogs["coffee_shop_partner_dialog_2"] = new Dialog ("coffee_shop_partner_dialog_2", game.partner_name, "Let's interview everyone else in here we haven't yet, they might have information or be the one responsible for these robberies.", ["Okay."]);
	game.dialogs["coffee_shop_partner_dialog_3"] = new Dialog ("coffee_shop_partner_dialog_3", game.partner_name, "Let's talk to the manager and tell her who did it.", ["Okay."]);
	
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
		picking_culprit:false
	};
}

// Returns true if the input event is consumed by this function, false if it does not.
// Takes the name of the button and whatever other arguments it needs from the server.js in order to work.
// Here vars is game.coffee_shop_variables as assigned above.
function coffee_shop_onclick (button, showDialog, closeDialog, vars) {
	if (button == "coffee_shop_manager") {
		if (!vars.spoken_to_manager) {
			showDialog("coffee_shop_manager_dialog");
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
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_4_Yes.") {
		closeDialog();
		showDialog("dialog_coffee_shop_manager_dialog_5");	
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_4_Not yet.") {
		closeDialog();
		return true;
	} else if (button == "dialog_coffee_shop_manager_dialog_5_Okay.") {
		vars.picking_culprit = true;
		closeDialog();
		return true;
	} else if (button == "coffee_shop_customer_1") {
		showDialog("coffee_shop_customer_1_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_customer_1_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_1_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_1_dialog_2_Okay.") {
		vars.spoken_to_customer_1 = true;
		closeDialog();
		return true;
	} else if (button == "coffee_shop_customer_2") {
		showDialog("coffee_shop_customer_2_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_customer_2_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_2_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_2_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_2 = true;
		return true;
	} else if (button == "coffee_shop_customer_3") {
		showDialog("coffee_shop_customer_3_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_customer_3_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_3_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_3_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_3 = true;
		return true;
	} else if (button == "coffee_shop_customer_4") {
		showDialog("coffee_shop_customer_4_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_customer_4_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_4_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_4_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_4 = true;
		return true;
	} else if (button == "coffee_shop_customer_5") {
		showDialog("coffee_shop_customer_5_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_customer_5_dialog_Continue.") { 
		closeDialog();
		showDialog("coffee_shop_customer_5_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_5_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_customer_5 = true;
		return true;
	} else if (button == "coffee_shop_culprit_1") {
		showDialog("coffee_shop_culprit_1_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_culprit_1_dialog_Continue.") { 
		closeDialog();
		showDialog("coffee_shop_culprit_1_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_culprit_1_dialog_2_Okay.") { 
		closeDialog();
		vars.spoken_to_culprit_1 = true;
		return true;
	} else if (button == "coffee_shop_culprit_3") {
		showDialog("coffee_shop_culprit_3_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_culprit_3_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_culprit_3_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_3_dialog_2_Okay.") {
		closeDialog();
		vars.spoken_to_culprit_3 = true;
		return true;
	} else
		return false;
}