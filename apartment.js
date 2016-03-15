// DO NOT declare variables at the Top level scope in this file.
// Put them into the game object in the load_apartment() method instead.

function load_apartment (game) {
	game.screens["apartment"] = new Screen (0, 0, 0, new Image ("image/hallway", 0, 0, 0), [
		new Button ("apartment_manager", 268, 313, 328, 396),
		new Button ("madeline_door", 120, 360, 200, 400), //billy
		new Button ("billy_door", 788, 325, 812, 385), //jacob
		new Button ("jacob_door", 444, 330, 474, 375), //emily
		new Button ("emily_door", 582, 321, 627, 383) //madeline
	], [], []);

	game.screens["billy_room"] = new Screen (0, 0, 0, new Image ("image/billya", 0, 0, 0), [
		new Button ("door", 75, 355, 135, 385),
		new Button ("bill", 650, 108, 780, 430)
	], [], []);

	game.screens["jacob_room"] = new Screen (0, 0, 0, new Image ("image/jacoba", 0, 0, 0), [
		new Button ("door1", 571, 169, 684, 429),
		new Button ("jac", 455, 158, 510, 444)
	], [], []);

	game.screens["emily_room"] = new Screen (0, 0, 0, new Image ("image/emilya", 0, 0, 0), [
		new Button ("door2", 792, 190, 850, 290),
		new Button ("em", 338, 135, 477, 425)
	], [], []);

	game.screens["madeline_room"] = new Screen (0, 0, 0, new Image ("image/madelinea", 0, 0, 0), [
		new Button ("door3", 106, 379, 140, 397),
		new Button ("mad_laptop", 930, 410, 1090, 550),
		new Button ("mad", 643, 155, 780, 455)
	], [], []);

	game.screens["router"] = new Screen(0, 0, 0, new Image ("image/browser/blank", 0, 0, 0), [
		new Button ("x", 768, 25, 790, 48)
	], [], []);

	game.screens["apartment_success"] = new Screen (0, 0, 0, new Image ("image/mission/complete", 0, 0, 0), [
		new Button ("apartment_failed_quit", 404, 427, 714, 515, "Select Another Mission", "24px Arial", "rgba(255,255,255,1)", 2)
	], [], [
		new Text ("apartment_success_score", 404, 535, 714, 600, 2, ERROR_STRING, "24px Arial", "rgba(255,255,0,1)"),
		new Rectangle ("apartment_success_quit_backing_rectangle", 404, 427, 714, 515, 1, "rgba(255,255,255,0.5)")
	]);

	var resident_1_name = "Billy";
	var resident_2_name = "Jacob";
	var resident_3_name = "Emily";
	var resident_4_name = "Madeline";

	var ERROR_STRING = "If you see this message, Jonathan Hansford wrote code that didn't work and should be ashamed of it.";


//manage later if they leave Madeline's room, so introduction dialog doesn't pop again
	game.dialogs["apartment_partner_dialog"] = new Dialog ("apartment_partner_dialog", game.partner_name, "A student named Madeline sent us that email. She said to come by her room - first door on the left.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_2"] = new Dialog ("apartment_partner_dialog_2", game.partner_name, "Madeline's room is the first door on the left.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_4"] = new Dialog ("apartment_partner_dialog_4", game.partner_name, "We should check her router history to see if anyone else has been using it. Let's try" +
	" going to http://192.168.0.1 on her laptop.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_5"] = new Dialog ("apartment_partner_dialog_5", game.partner_name, "Madeline, have you changed any of these settings in the past?", ["Continue."]);
	game.dialogs["apartment_partner_dialog_6"] = new Dialog ("apartment_partner_dialog_6", game.partner_name, "Let's see if we can get anymore information from the router history and then do some investigating.", ["Okay."]);
	game.dialogs["apartment_partner_dialog_7"] = new Dialog ("apartment_partner_dialog_7", game.partner_name, "We've talked to all possible suspects. Let's check in on Madeline.", ["Okay."]);

	game.dialogs["madeline_dialog"] = new Dialog ("madeline_dialog", game.player_name, "Hello Madeline. We're the detectives you contacted about this music piracy problem. How can we help?", ["Continue."]);
	game.dialogs["madeline_dialog_2"] = new Dialog ("madeline_dialog_2", resident_4_name, "Thank you so much for coming. I'm incredibly stressed right now, since I know they've got this all wrong. You could even look" +
	" at my computer and see that there aren't any downloaded music files on it. Please help!", ["Okay."]);
	game.dialogs["madeline_dialog_3"] = new Dialog ("madeline_dialog_3", resident_4_name, "I definitely haven't. I don't even know how to get to this screen", ["Okay."]);
	game.dialogs["madeline_dialog_4"] = new Dialog ("madeline_dialog_4", game.player_name, "It looks like Jacob and Emily have used your Wi-Fi network in the past 48 hours.", ["Continue."]);
	game.dialogs["madeline_dialog_5"] = new Dialog ("madeline_dialog_5", resident_4_name, "Wow, I would have never known that. Could you help me ask some of the people who live here? I know Jacob lives to my left, Emily lives down the hall, and" +
	" my friend Billy lives across from me.", ["Okay."]);

	game.dialogs["madeline_dialog_6"] = new Dialog ("madeline_dialog_6", resident_4_name, "Like I said, Jacob lives to my left, Emily lives down the hall, and Billy lives somewhere across from me.", ["Okay."]);

	game.dialogs["madeline_dialog_7"] = new Dialog ("madeline_dialog_7", resident_4_name, "Perfect timing! The Music Protection Association just emailed me saying all the illegally downloaded files were songs by country artists.", ["Continue."]);
	game.dialogs["madeline_dialog_8"] = new Dialog ("madeline_dialog_8", game.player_name, "Thanks Madeline. With that, I believe our investigation lets us conclude that our culprit is ", ["Emily.", "Jacob.", "Billy."]);
	game.dialogs["madeline_dialog_9"] = new Dialog ("madeline_dialog_9", game.player_name, "Actually, the culprit is ", ["Emily.", "Jacob.", "Billy."]);

	game.dialogs["jacob_dialog"] = new Dialog ("jacob_dialog", game.player_name, "Hello Jacob. How are you doing today?", ["Continue."]);
	game.dialogs["jacob_dialog_2"] = new Dialog ("jacob_dialog_2", resident_2_name, "I'm listening to some old-fashioned country music, so I couldn't be better. Wait, but how do you know my name? Who are you?", ["Continue."]);
	game.dialogs["jacob_dialog_3"] = new Dialog ("jacob_dialog_3", game.player_name, "We're just a couple of detectives doing a case here. Quite a few files have been illegally downloaded recently, and we wanted to know if you" +
	" knew anything about that. So just one question: have you been on Madeline's Wi-Fi network at all the past few days?", ["Continue."]);
	game.dialogs["jacob_dialog_4"] = new Dialog ("jacob_dialog_4", resident_2_name, "All I know is that I use a wired connection for my computer. As for my phone, it automatically connects to to any" +
	" remembered networks, so I don't know if that helps you.", ["Okay. Thanks."]);
	game.dialogs["jacob_dialog_5"] = new Dialog ("jacob_dialog_5", resident_2_name, "I'm just listening to my country music.", ["Okay."]);

	game.dialogs["emily_dialog"] = new Dialog ("emily_dialog", game.player_name, "Emily? Hi. We were called in by Madline down the hall, and we recently discovered that you might have used your tablet on her Wi-Fi Network. Is this true?", ["Continue."]);
	game.dialogs["emily_dialog_2"] = new Dialog ("emily_dialog_2", resident_3_name, "I knew I should have just waited for the campus Wi-Fi to connect.. All I did was download some homework off of Canvas! Please tell Madeline I'm sorry!", ["Okay."]);
	game.dialogs["emily_dialog_3"] = new Dialog ("emily_dialog_3", resident_3_name, "Sorry, I really need to get some homework done!", ["Okay."]);

	game.dialogs["billy_dialog"] = new Dialog ("billy_dialog", game.player_name, "Hello there. Your friend Madeline called us in saying the Music Protection Association found many files being illegally downloaded on" +
	" her Wi-Fi network. Have you been using it?", ["Continue."]);
	game.dialogs["billy_dialog_2"] = new Dialog ("billy_dialog_2", resident_1_name, "Alright, I don't want to start too much trouble. I don't have a network of my own, and I've been hijacking on my neighbors' networks for years. I thought" +
	"this was a good way to save some money on my rent and to stream my favorite Rock songs.", ["Okay."]);
	game.dialogs["billy_dialog_3"] = new Dialog ("billy_dialog_3", resident_1_name, "Could you let this one slide? I can't afford these expenses.", ["Maybe."]); //ethical decision probably

	game.apartment_variables = {
		metMadeline:false,  //added
		metEmily:false,
		metJacob:false,
		metBilly:false,
		metAll:false,
		routerchecked:false,
		piracy_video_played:false,
		background_music_audio_id:"audio/mall",
		names_of_people:{billy:resident_1_name, jacob:resident_2_name, emily:resident_3_name, madeline:resident_4_name}
	};
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
function apartment_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, vars) {
	if (button == "go_to_apartment") { // Button on the phone's map app.
		resizeCanvas(1188, 681);
		changeMainScreen("apartment");
		if (!vars.entry_message_shown) {
			showDialog("apartment_partner_dialog");
		}
		return false; // Allow the main file to handle this event as well.
	} else if (button == "dialog_apartment_partner_dialog_Okay.") {
		closeDialog();
		return true;
	} else if (button == "madeline_door" && !vars.metAll) {
		if (vars.picking_culprit) {
			pickCulprit(button, showDialog, closeDialog, vars);
		} else {
			changeMainScreen("madeline_room");
			showDialog("madeline_dialog");
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
	} else if (button == "mad_laptop") {
		resizeCanvas(800, 600);
		changeMainScreen("router");
		if (!vars.routerchecked) {
			showDialog("apartment_partner_dialog_5");
		}
		return true;
	} else if (button == "dialog_apartment_partner_dialog_5_Continue."){
		closeDialog();
		showDialog("madeline_dialog_3");
		return true;
	} else if (button == "dialog_madeline_dialog_3_Okay.") {
		closeDialog();
		return true;
	} else if (button == "x" && !vars.routerchecked) {
		vars.routerchecked = true;
		resizeCanvas(1188, 681);
		changeMainScreen("madeline_room");
		showDialog("madeline_dialog_4");
		return true;
	} else if (button == "x" && vars.routerchecked) {
		resizeCanvas(1188, 681);
		changeMainScreen("madeline_room");
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
		return true;
	} else if (button == "mad" && vars.metMadeline) {
		showDialog("madeline_dialog_6");
		return true;
	} else if (button == "mad" && !vars.metMadeline) {
		showDialog("apartment_partner_dialog_4");
		return true;
	} else if (button == "dialog_madeline_dialog_6_Okay.") {
		closeDialog();
		return true;
	} else if (button == "door3") {
		changeMainScreen("apartment");
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
	} else if (button == "bill" && vars.metBilly) {
		showDialog("billy_dialog_3");
		return true;
	} else if (button == "dialog_billy_dialog_3_Maybe.") {
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
		changeMainScreen("madeline_room");
		showDialog("madeline_dialog_7");
		return true;
	} else if (button == "dialog_madeline_dialog_7_Continue.") {
		closeDialog();
		showDialog("madeline_dialog_8");
		return true;
	} else if (button == "dialog_madeline_dialog_8_Emily." || button == "dialog_madeline_dialog_8_Billy.") {
		closeDialog();
		showDialog("madeline_dialog_9");
		return true;
	} else if (button == "dialog_madeline_dialog_8_Jacob." || button == "dialog_madeline_dialog_9_Jacob.") {
		closeDialog();
		resizeCanvas(1152, 648);
		console.log("test");
		//if (!vars.piracy_video_played) {
		//	vars.piracy_video_played = true;
			playVideo("video/piracy");
		//}
		return true;
	}
	else {
		return false;
	}
}
