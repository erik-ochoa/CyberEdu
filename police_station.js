function load_police_station (game, addToFileSystem) {
	game.screens["office_lobby"] = new Screen(0, 0, 0, new Image("image/police_station/office_lobby", 0, 0, 0), [
		new Button ("police_station_door1", 25, 210, 143, 451, 1),
		new Button ("police_station_door2", 173, 210, 289, 451, 1),
		new Button ("police_station_door3", 317, 210, 436, 451, 1),
		new Button ("police_station_receptionist", 806, 293, 869, 421, 1),
		new Button ("police_station_victim", 474, 334, 566, 488, 1)
	], [], [
		new Text ("police_station_nameplate1", 44, 233, 123, 253, 2, "P.D. Chief", "16px Arial", "rgba(0, 0, 0, 1)"),
		new Text ("police_station_nameplate2", 190, 233, 266, 253, 2, game.partner_name, "16px Arial", "rgba(0, 0, 0, 1)"),
		new Text ("police_station_nameplate3", 334, 233, 411, 253, 2, game.player_name, "16px Arial", "rgba(0, 0, 0, 1)")//,
		//new Image ("image/police_station/office_lobby/glass_wall", 0, 0, 3)
	]);

	game.screens["office_lobby_no_victim"] = new Screen(0, 0, 0, new Image("image/police_station/office_lobby_no_victim", 0, 0, 0), [
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

	game.screens["player_office_victim"] = new Screen(0, 0, 0, new Image("image/police_station/player_office_victim", 0, 0, 0, 1.7), [
		new Button ("player_office_exit_door", 887, 260, 1000, 648, 1)
	], [] ,[]);
	
	game.screens["player_office"] = new Screen(0, 0, 0, new Image("image/police_station/player_office", 0, 0, 0), [
		new Button ("player_office_exit_door", 727, 168, 820, 475, 1)
	], [] ,[]);
	
	game.screens["other_office"] = new Screen(0, 0, 0, new Image("image/police_station/other_office", 0, 0, 0, 0.70), [
		new Button ("other_office_exit_door", 689, 182, 788, 508, 1)
	], [] ,[]);

	game.screens["ads_broswer"] = new Screen(0, 0, 0, new Image("image/police_station/ads", 0, 0, 0, 0.37), [
		new Button("close_ads", 0, 0, 1224, 688, 0)], [], []);

	var victim_name = "Michael";

	game.browsers["police_station_browser"] = new Browser();
	
	game.dialogs["police_station_receptionist_dialog_1"] = new Dialog ("police_station_receptionist_dialog_1", "Receptionist", "Hello, " + game.player_name + ". Welcome to the UMD Division of IT Headquarters. Here's your employee badge, access to the intern office. Your new office is the door on the right and Michael from the email you received is waiting outside of your office. From here on out, You'll receive notifications of missions to complete via email on your phone.", ["Got it."]);
	game.dialogs["police_station_receptionist_dialog_2"] = new Dialog ("police_station_receptionist_dialog_2", "Receptionist", "How are you doing, " + game.player_name + "? Remember, you get notifications of missions to complete via email. Once you get a mission, use the map to travel to the location and solve the case.", ["Got it."]);

	game.dialogs["police_station_victim_name_dialog_1"] = new Dialog("police_station_victim_name_dialog_1", victim_name, "Hello, my name is " + victim_name + " I'm here because my internet browser is acting very strange and I am wondering if anyone could offer any assistance.", ["Help."]);
	game.dialogs["police_station_victim_name_dialog_2"] = new Dialog("police_station_victim_name_dialog_2", game.player_name, "I might be able to help you out. Follow me into my office. What seems to be the problem?", ["Next."]);
	game.dialogs["police_station_victim_name_dialog_3"] = new Dialog("police_station_victim_name_dialog_3", victim_name, "Thanks for your help. Everytime I open my internet broswer, a ton of pop ads cover the screen. Then when I manage to close enough of them, I noticed that my browser's homepage has been changed.", ["Next."]);
	game.dialogs["police_station_victim_name_dialog_4"] = new Dialog("police_station_victim_name_dialog_4", game.player_name, "Sounds like you might have a nasty case of malware. Have you downloaded anything from or browsed any risky or shady sites recently?", ["Next."]);
	game.dialogs["police_station_victim_name_dialog_5"] = new Dialog("police_station_victim_name_dialog_5", victim_name, "Being a college student, I tried to see if I can find a version of ArithmeticLab software for free. I found the program online but it was a torrent download, I think. I just thought it was a different form of download. Do you think that may be the cause?", ["Next."]);
	game.dialogs["police_station_victim_name_dialog_6"] = new Dialog("police_station_victim_name_dialog_6", game.player_name, "I would bet my bottom dollar that is more than likely the problem. Do you remember approximately when you dowloaded the file?", ["Next."]);
	game.dialogs["police_station_victim_name_dialog_7"] = new Dialog("police_station_victim_name_dialog_7", victim_name, "I think I downloaded it no later than a week ago. I can take you to the site and show you what I did.", ["Next."]);
	game.dialogs["police_station_victim_name_dialog_8"] = new Dialog("police_station_victim_name_dialog_8", victim_name, "That should do it. I have restored your computer to a state before you downloaded that malicious program. Be careful where you donwload items.", ["Next."]);

	game.dialogs["police_partner_dialog"] = new Dialog ("police_partner_dialog", game.partner_name, "What do you suggest we do to fix this issue?", ["Look for malicious code.", "Throw it away.", "Restore from a backup.", "Wipe the computer and run a factory reset."]);
	game.dialogs["police_partner_dialog_2"] = new Dialog ("police_partner_dialog_2", game.partner_name, "I'm sure you're really skilled, but that could take a while and we might not even be able to get rid of it all to really know it's clean.", ["Okay."]);
	game.dialogs["police_partner_dialog_3"] = new Dialog ("police_partner_dialog_3", game.partner_name, "Great idea. Let's ask if any backups were kept.", ["Okay."]);
	game.dialogs["police_partner_dialog_4"] = new Dialog ("police_partner_dialog_4", game.partner_name, "Hold on. Did you include all those add-in downloads? They might have been the cause of all this. What should we do?", ["Okay."]);
	game.dialogs["police_partner_dialog_5"] = new Dialog ("police_partner_dialog_5", game.partner_name, "Would you mind taking us to your online backup?", ["Next."]);
	game.dialogs["police_partner_dialog_6"] = new Dialog ("police_partner_dialog_6", game.partner_name, "I think restoring this back-up would put the malware back onto the computer. Remember " + victim_name + " said he downloaded the software no later than a week ago. Maybe another one?", ["Okay."]);


	//modify victim_name's dialog i.e. why he'd know to keep backups but not think to perform one
	//game.dialogs["victim_name_dialog"] = new Dialog ("victim_name_dialog", victim_name, "Please, I really need your help.", ["Okay."]);
	game.dialogs["victim_name_dialog_2"] = new Dialog ("victim_name_dialog_2", victim_name, "I'm pretty low on cash right now and I have a lot of important files on here. Could you possibly think of some other way to fix this issue?", ["Alright."]);
	game.dialogs["victim_name_dialog_3"] = new Dialog ("victim_name_dialog_3", victim_name, "If I didn't have any important files on here, I would definitely be fine with that option.", ["Okay."]);
	game.dialogs["victim_name_dialog_4"] = new Dialog ("victim_name_dialog_4", victim_name, "I actually just recently made an online account with CloudBackupsInTheSky last week. ", ["Okay."]);
	game.dialogs["victim_name_dialog_5"] = new Dialog ("victim_name_dialog_5", victim_name, "Sure.", ["Next."]);
	game.dialogs["victim_name_dialog_6"] = new Dialog ("victim_name_dialog_6", victim_name, "Thanks you so much. I will never trust that website again!", ["Next."]);


	game.webpages["http://arithmeticlab.com/downloads"] = new Screen (0, 70, 0, new Rectangle ("backup_background", 0, 0, 1224, 688, 0, "rgba(102,255,178,0.3)"),
	[new Button ("bad_download", 230, 250, 630, 285, 3, "Download Firmware Now!! (423MBs)", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("good_download", 350, 450, 830, 485, 2, "Continue to Download ArithmeticLab (98MBs)", "20px Arial", "rgba(0,0,0,1)")],
	[],
	[new Text ("site_title", 65, 25, 200, 75, 2, "ArithmeticLab", "28px Courier", "rgba(0,0,0,1)"),
	new Text ("site_about", 550, 35, 650, 85, 2, "About Us", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("site_download", 670, 35, 770, 85, 2, "Downloads", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("line", 65, 50, 450, 85, 2, "---------------------", "28px Courier", "rgba(0,0,0,1)"),
	new Text ("desc1", 65, 100, 500, 135, 2, "ArithmeticLab is your solution to", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("desc2", 65, 125, 600, 160, 2, "visualizing and analyzing high-level expressions.", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("desc3", 65, 165, 600, 200, 2, "Download Version 8.0.1 today!", "18px Courier", "rgba(0,0,0,1)"),
	new Rectangle ("bad_background", 230, 250, 630, 285, 2, "rgba(102,255,178,1)")]);

	game.webpages["http://arithmeticlab.com/downloadAL"] = new Screen (0, 70, 0, new Rectangle ("backup_background", 0, 0, 1224, 688, 0, "rgba(102,255,178,0.3)"),
	[new Button ("include_AL", 270, 200, 550, 235, 3, "Include ArithmeticLab", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("select_all", 200, 150, 600, 185, 3, "Click here to Select/Deselect All", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("download_select", 200, 330, 600, 360, 3, "Click here to Download Selected Items", "24px Arial", "rgba(0,0,0,1)")],
	[],
	[new Text ("site_title", 65, 25, 200, 75, 2, "ArithmeticLab", "28px Courier", "rgba(0,0,0,1)"),
	new Text ("site_about", 550, 35, 650, 85, 2, "About Us", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("site_download", 670, 35, 770, 85, 2, "Downloads", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("line", 65, 50, 450, 85, 2, "---------------------", "28px Courier", "rgpa(0,0,0,1)"),
	new Text ("include_bar", 270, 240, 600, 275, 2, "Include Free Browser Toolbar", "24px Arial", "rgba(0,0,0,1)"),
	new Text ("include_tri", 270, 280, 650, 315, 2, "Include Free Assistant Package", "24px", "rgba(0,0,0,1)")]);

	game.webpages["http://arithmeticlab.com/downloadALL"] = new Screen (0, 70, 0, new Rectangle ("backup_background", 0, 0, 1224, 688, 0, "rgba(102,255,178,0.3)"),
	[new Button ("include_AL", 270, 200, 550, 235, 3, "Include ArithmeticLab", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("select_all", 200, 150, 600, 185, 3, "Click here to Select/Deselect All", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("download_select", 200, 330, 600, 360, 3, "Click here to Download Selected Items", "24px Arial", "rgba(0,0,0,1)")],
	[],
	[new Text ("site_title", 65, 25, 200, 75, 2, "ArithmeticLab", "28px Courier", "rgba(0,0,0,1)"),
	new Text ("site_about", 550, 35, 650, 85, 2, "About Us", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("site_download", 670, 35, 770, 85, 2, "Downloads", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("line", 65, 50, 450, 85, 2, "---------------------", "28px Courier", "rgpa(0,0,0,1)"),
	new Text ("include_bar", 270, 240, 600, 275, 3, "Include Free Browser Toolbar", "24px Arial", "rgba(0,0,0,1)"),
	new Text ("include_tri", 270, 280, 650, 315, 3, "Include Free Assistant Package", "24px", "rgba(0,0,0,1)"),
	new Rectangle ("al_background", 270, 200, 500, 235, 2, "rgba(102,255,178,1)"),
	new Rectangle ("tool_background", 270, 240, 600, 275, 2, "rgba(102,255,178,1)"),
	new Rectangle ("pkg_background", 270, 280, 620, 315, 2, "rgba(102,255,178,1)")]);

	game.webpages["http://arithmeticlab.com/downloadAL1"] = new Screen (0, 70, 0, new Rectangle ("backup_background", 0, 0, 1224, 688, 0, "rgba(102,255,178,0.3)"),
	[new Button ("include_AL", 270, 200, 550, 235, 3, "Include ArithmeticLab", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("select_all", 200, 150, 600, 185, 3, "Click here to Select/Deselect All", "24px Arial", "rgba(0,0,0,1)"),
	new Button ("download_select", 200, 330, 600, 360, 3, "Click here to Download Selected Items", "24px Arial", "rgba(0,0,0,1)")],
	[],
	[new Text ("site_title", 65, 25, 200, 75, 2, "ArithmeticLab", "28px Courier", "rgba(0,0,0,1)"),
	new Text ("site_about", 550, 35, 650, 85, 2, "About Us", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("site_download", 670, 35, 770, 85, 2, "Downloads", "18px Courier", "rgba(0,0,0,1)"),
	new Text ("line", 65, 50, 450, 85, 2, "---------------------", "28px Courier", "rgpa(0,0,0,1)"),
	new Text ("include_bar", 270, 240, 600, 275, 2, "Include Free Browser Toolbar", "24px Arial", "rgba(0,0,0,1)"),
	new Text ("include_tri", 270, 280, 650, 315, 2, "Include Free Assistant Package", "24px", "rgba(0,0,0,1)"),
	new Rectangle ("al_background", 270, 200, 500, 235, 2, "rgba(102,255,178,1)")]);

	game.webpages["http://cloudbackupsinthesky.com/user"] = new Screen (0, 70, 0, new Rectangle ("cloud_background", 0, 0, 1224, 688, 0, "rgba(153,255,255,0.3)"),
	[new Button ("backup_1",  85, 185, 100, 215, 2, "1", "20px Courier", "rgba(0,0,0,1)"),
	new Button ("backup_2", 85, 250, 100, 280, 2, "2", "20px Courier", "rgba(0,0,0,1)"),
	new Button ("backup_3",  85, 315, 100, 345, 2, "3", "20px Courier", "rgba(0,0,0,1)")], [],
	[new Text ("site_title", 230, 25, 615, 75, 2, "Cloud Backups in the Sky", "28px Verdana", "rgba(0,0,0,1)"),
	new Text ("site_about", 85, 35, 185, 85, 2, "About", "18px Verdana", "rgba(0,0,0,1)"),
	new Text ("site_backup", 655, 35, 755, 85, 2, "Backups", "18px Verdana", "rgba(0,0,0,1)"),
	new Text ("stars", 230, 50, 615, 85, 2, "*********************", "28px Courier", "rgba(0,0,0,1)"),
	new Text ("site_list", 85, 100, 500, 150, 2, "Backups for " + victim_name + " as of Jan 28", "22px Verdana", "rgba(0,0,0,1)"),
	new Text ("num", 85, 150, 205, 200, 3, "Number", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("date", 385, 150, 435, 200, 3, "Date", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("date1", 385, 185, 460, 215, 2, "Jan 20", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("date2", 385, 250, 460, 280, 2, "Jan 24", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("date3", 385, 315, 460, 345, 2, "Jan 27", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("time", 655, 150, 755, 200, 3, "Time", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("time1", 655, 185, 785, 215, 2, "10:03AM", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("time2", 655, 250, 785, 280, 2, "12:50PM", "20px Courier", "rgba(0,0,0,1)"),
	new Text ("time3", 655, 315, 785, 345, 2, "11:12AM", "20px Courier", "rgba(0,0,0,1)"),
	new Rectangle ("column", 85, 150, 755, 180, 2, "rgba(102,255,178,1)")]);


	
	game.dialogs["police_station_error_dialog"] = new Dialog ("police_station_error_dialog", "Notice", "This area is still under construction, and isn't in the game yet. Sorry.", ["Okay."]);
	
	game.police_station_variables = {
		spoken_to_receptionist_once:false,
		only_arithmeticLab:false,
		included_all:false,
		module_complete: false,
		backups_video_shown:false
	};
}

function police_station_onclick (button, changeMainScreen, resizeCanvas, sendMissionEmail, showDialog, closeDialog, displayFileSystem, closeFileSystem, existsInFileSystem, displayBrowser, changeBrowserWebPage, closeBrowser, playVideo, checkForGameCompletion, browser, vars) {
	if (button == "go_to_office_lobby") {
		resizeCanvas(1152, 648);
		if (vars.module_complete) {
			changeMainScreen("office_lobby_no_victim");
		} else {
			changeMainScreen("office_lobby");
		}
		return false; // Allow server.js to also handle this event, if desired.
	}
	if (button == "police_station_door3") {
		changeMainScreen("player_office");
		resizeCanvas(1099, 549);
		return true;
	} else if(button == "player_office_exit_door" && vars.module_complete == true) {
		changeMainScreen("office_lobby_no_victim");
		resizeCanvas(1152, 648);
		return true;
	} else if (button == "player_office_exit_door") {
		changeMainScreen("office_lobby");
		resizeCanvas(1152, 648);
		return true;
	} else if (button == "other_office_exit_door") {
		if (vars.module_complete) {
			changeMainScreen("office_lobby_no_victim");
		} else {
			changeMainScreen("office_lobby");
		}
		resizeCanvas(1152, 648);
		return true;
	} else if (button == "police_station_receptionist") {
		if (vars.spoken_to_receptionist_once) {
			showDialog("police_station_receptionist_dialog_2");
		} else {
			showDialog("police_station_receptionist_dialog_1");
		}
		return true;
	} else if (button =="police_station_victim") {
		showDialog("police_station_victim_name_dialog_1");
		return true;
	}
	 else if (button == "dialog_police_station_receptionist_dialog_1_Got it.") {
		vars.spoken_to_receptionist_once = true;
		sendMissionEmail("coffee_shop");
		sendMissionEmail("apartment");
		sendMissionEmail("library");
		closeDialog();
		return true;
	} else if (button == "dialog_police_station_receptionist_dialog_2_I'm doing fine.") {
		closeDialog();
		return true;
	}  else if (button == "police_station_door1" || button == "police_station_door2") {
		changeMainScreen("other_office");
		resizeCanvas(914, 585);
		return true;
	} else if(button == "police_station_door3" && vars.module_complete == false) {
		showDialog("police_station_victim_name_dialog_1");
		return true;
	}
	else if (button == "dialog_police_station_victim_name_dialog_1_Help.") {
		closeDialog();
		showDialog("police_station_victim_name_dialog_2");
		return true;
	} else if (button == "dialog_police_station_victim_name_dialog_2_Next.") {
		closeDialog();
		changeMainScreen("player_office_victim");
		showDialog("police_station_victim_name_dialog_3");
		return true;
	} else if(button == "dialog_police_station_victim_name_dialog_3_Next.") {
		closeDialog();
		changeMainScreen("ads_broswer");
		return true;
	} else if(button == "dialog_police_station_victim_name_dialog_4_Next.") {
		closeDialog();
		showDialog("police_station_victim_name_dialog_5");
		return true;
	} else if(button == "dialog_police_station_victim_name_dialog_5_Next.") {
		closeDialog();
		showDialog("police_station_victim_name_dialog_6");
		return true;
	} else if (button == "dialog_police_station_victim_name_dialog_6_Next.") {
		closeDialog();
		showDialog("police_station_victim_name_dialog_7");
		return true;
	} else if(button == "dialog_police_station_victim_name_dialog_7_Next.") {
		closeDialog();
		changeBrowserWebPage(browser, "http://arithmeticlab.com/downloads");
		displayBrowser("police_station_browser");
		return true;
	} else if(button == "dialog_police_partner_dialog_Look for malicious code.") {
		closeDialog();
		showDialog("police_partner_dialog_2");
		return true;
	} else if (button == "dialog_police_partner_dialog_Throw it away.") {
		closeDialog();
		showDialog("victim_name_dialog_2");
		return true;
	} else if (button == "dialog_police_partner_dialog_Restore from a backup.") {
		closeDialog();
		showDialog("police_partner_dialog_3");
		return true;
	} else if(button == "dialog_police_partner_dialog_Wipe the computer and run a factory reset.") {
		closeDialog();
		showDialog("victim_name_dialog_3");
		return true;
	} else if (button == "dialog_police_partner_dialog_2_Okay.") {
		closeDialog();
		showDialog("police_partner_dialog");
		return true;
	} else if(button == "dialog_victim_name_dialog_2_Alright.") {
		closeDialog();
		showDialog("police_partner_dialog");
		return true;
	} else if(button == "dialog_victim_name_dialog_3_Okay.") {
		closeDialog();
		showDialog("police_partner_dialog");
		return true;
	} else if (button == "dialog_police_partner_dialog_3_Okay.") {
		closeDialog();
		showDialog("victim_name_dialog_4");
		return true;
	} else if (button == "dialog_victim_name_dialog_4_Okay.") {
		closeDialog();
		showDialog("police_partner_dialog_5");
		return true;
	} else if (button == "bad_download") {
		changeBrowserWebPage(browser, "http://arithmeticlab.com/downloadAL");
		displayBrowser("police_station_browser");
		return true;
	} else if (button == "include_AL") {
		changeBrowserWebPage(browser, "http://arithmeticlab.com/downloadAL1");
		displayBrowser("police_station_browser");
		return true;
	} else if(button == "select_all") {
		changeBrowserWebPage(browser, "http://arithmeticlab.com/downloadALL");
		displayBrowser("police_station_browser");
		return true;
	} else if(button == "download_select") {
		closeBrowser(true);
		showDialog("police_partner_dialog_4");
		return true;
	} else if(button == "dialog_police_partner_dialog_5_Next.") {
		closeDialog();
		showDialog("victim_name_dialog_5");
		return true;
	} else if(button == "dialog_police_partner_dialog_4_Okay.") {
		closeDialog();
		showDialog("police_partner_dialog");
		return true;
	} else if(button == "dialog_police_partner_dialog_5_Next.") {
		closeDialog();
		showDialog("victim_name_dialog_5");
		return true;
	} else if(button == "dialog_victim_name_dialog_5_Next.") {
		closeDialog();
		changeBrowserWebPage(browser, "http://cloudbackupsinthesky.com/user");
		displayBrowser("police_station_browser");
		return true;
	} else if (button == "backup_2" || button == "backup_3") {
		showDialog("police_partner_dialog_6");
		return true;
	} else if (button == "dialog_police_partner_dialog_6_Okay.") {
		closeDialog();
		return true;
	} else if (button == "backup_1") {
		closeBrowser(true);
		showDialog("police_station_victim_name_dialog_8");
		return true;
	} else if (button == "dialog_police_station_victim_name_dialog_8_Next.") {
		closeDialog();
		showDialog("victim_name_dialog_6");
		return true;
	} else if(button == "dialog_victim_name_dialog_6_Next.") {
		closeDialog();
		vars.module_complete = true;
		checkForGameCompletion();
		if (!vars.backups_video_shown) {
			playVideo("video/backups");
			vars.backups_video_shown = true;
		}
		return true;
	} else if(button == "close_ads") {
		changeMainScreen("player_office_victim");
		showDialog("police_station_victim_name_dialog_4");
		return true;
	} else if (button == "dialog_police_station_receptionist_dialog_2_Got it.") {
		closeDialog();
		return true;
	} else {
		return false;
	}
}