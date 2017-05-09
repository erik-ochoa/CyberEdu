function load_library (game, addToFileSystem) {
  game.screens["library"] = new Screen (0, 0, 0, new Image ("image/library", 0, 0, 0), [
    new Button ("librarian", 1007, 220, 1062, 308, 0)
  ], [], []);
  game.screens["library2"] = new Screen (0, 0, 0, new Image ("image/library", 0, 0, 0), [
    new Button ("librarian", 1007, 220, 1062, 308, 0),
    new Button ("yellow_shirt", 768, 280, 807, 323, 0),
    new Button ("glasses", 689, 293, 767, 398, 0),
    new Button ("files", 502, 306, 639, 426, 0),
    new Button ("red", 378, 263, 458, 366, 0),
    new Button ("stripes", 10, 201, 101, 331, 0),
  ], [], []);
  game.screens["finish"] = new Screen (0, 0, 0, new Image ("image/library", 0, 0, 0), [
    new Button ("librarian2", 1007, 220, 1062, 308, 0),
    new Button ("yellow_shirt", 768, 280, 807, 323, 0),
    new Button ("glasses", 689, 293, 767, 398, 0),
    new Button ("files", 502, 306, 639, 426, 0),
    new Button ("red", 378, 263, 458, 366, 0),
    new Button ("stripes", 10, 201, 101, 331, 0),
  ], [], []);
  game.screens["librarian"] = new Screen (0, 0, 0, new Image ("image/librarian", 0, 0, 0), [
    new Button ("librarian", 1007, 220, 1062, 308, 0)
  ], [], []);
  game.screens["yellow_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp3", 0, 0, 0), [], [], []);
  game.screens["glasses_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp2", 0, 0, 0), [], [], []);
  game.screens["glasses2_gamescreen"] = new Screen (0, 0, 0, new Image ("image/infected", 0, 0, 0), [], [], []);
  game.screens["red_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp3", 0, 0, 0), [], [], []);
  game.screens["files_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp1", 0, 0, 0), [
    new Button ("usb", 227, 459, 302, 513, 0),
  ], [], []);
  game.screens["files3_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp1", 0, 0, 0), [
    new Button ("web", 477, 54, 600, 150, 0)
  ], [], []);
  game.screens["files2_gamescreen"] = new Screen (0, 0, 0, new Image ("image/infected2", 0, 0, 0), [
    new Button ("screen", 0, 0, 1151, 647, 0)
  ], [], []);

  game.dialogs["start_dialog"] = new Dialog ("start_dialog", game.partner_name, "Let's go talk to the librarian about the issues the library computers have been having.", ["Continue."]);
  game.dialogs["librarian_start_dialog"] = new Dialog ("librarian_start_dialog", "Librarian", "Thanks for coming. About a day ago, one of the computers in the computer lab stopped working normally, and instead, it got stuck on some strange website. Since then, it seems like every few hours, another computer is lost to this virus, and I don't know what is causing it or how to remove it. I need you to find the cause, and if you can, show me how to fix one of the computers, if you can find a solution.", ["Continue."]);
  game.dialogs["ashley_dialog"] = new Dialog ("ashley_dialog", game.partner_name, "We'll do our best ma'am.", ["Continue."]);

  
  
  game.dialogs["yellow1_dialog"] = new Dialog ("yellow1_dialog", game.player_name, "Do you know if there is anything wrong with this computer?", ["Continue."]);
  game.dialogs["yellow2_dialog"] = new Dialog ("yellow2_dialog", "Pale Yellow Shirt", "I'm pretty sure it's working fine. I haven't had any problems with it yet. I just got here though. I have a paper due tonight that I haven't started yet. But if something strange happens while you're here, I'll let you know", ["Continue."]);

  game.dialogs["glasses1_dialog"] = new Dialog ("glasses1_dialog", game.player_name, "Do you have any papers due today?", ["Continue."]);
  game.dialogs["glasses2_dialog"] = new Dialog ("glasses2_dialog", "Glasses", "No I'm just here to work on a programming project.", ["Continue."]);
  game.dialogs["glasses3_dialog"] = new Dialog ("glasses3_dialog", "Glasses", "What?! What the heck?! <Furious banging on keyboard>", ["Continue."]);
  game.dialogs["glasses4_dialog"] = new Dialog ("glasses4_dialog", "Glasses", "ARGH! It's totally locked up! I don't have time for this!", ["Continue."]);
  game.dialogs["glasses5_dialog"] = new Dialog ("glasses5_dialog", game.player_name, "What did you do to it?", ["Continue."]);
  game.dialogs["glasses6_dialog"] = new Dialog ("glasses6_dialog", "Glasses", "All I did was login and plugin a flashdrive. Someone else must have messed with it.", ["Continue."]);
  game.dialogs["glasses7_dialog"] = new Dialog ("glasses7_dialog", game.player_name, "Is the USB yours?", ["Continue."]);
  game.dialogs["glasses8_dialog"] = new Dialog ("glasses8_dialog", "Glasses", "No, I just found it here lying around. I figured I'd check what was on it to see whose it was.", ["Continue."]);
  game.dialogs["glasses9_dialog"] = new Dialog ("glasses9_dialog", game.partner_name, "Can I have that? It might have caused the virus that just infected the computer. It is possible the drive could have an autorun file setup to automatically execute malware files. It is even possible for the device to have malicious firmware.", ["Continue."]);
  game.dialogs["glasses10_dialog"] = new Dialog ("glasses10_dialog", "Glasses", "Sure, take it. I don't need it.", ["Continue."]);

  game.dialogs["red1_dialog"] = new Dialog ("red1_dialog", game.player_name, "Have you been experiencing any difficulty with these computers?", ["Continue."]);
  game.dialogs["red2_dialog"] = new Dialog ("red2_dialog", "Red Shirt", "I don't think so. I don't have time to check. I've been working all night on this paper! It's due at the start of class, in one hour.", ["Continue."]);
  game.dialogs["red3_dialog"] = new Dialog ("red3_dialog", game.player_name, "Well hurry up and finish so I can check this computer.", ["Continue."]);
  game.dialogs["red4_dialog"] = new Dialog ("red4_dialog", "Red Shirt", "Believe me, I am working as fast as I can!", ["Continue."]);

  game.dialogs["stripe_dialog"] = new Dialog ("stripe_dialog", "Striped Shirt", "What's the integral of sin^2(x)?", ["0.5x + 0.25cos(2x)", "0.5x - 0.25sin(2x)", "I don't know."]);
  game.dialogs["stripe2_dialog"] = new Dialog ("stripe2_dialog", "Striped Shirt", "I don't think that's right.", ["Okay."]);
  game.dialogs["stripe3_dialog"] = new Dialog ("stripe3_dialog", "Striped Shirt", "Yep, that's right. You really know your stuff, " + game.player_name + ".", ["Okay."]);

  game.dialogs["files1_dialog"] = new Dialog ("files1_dialog", "", "It's a red flash drive", ["Take it", "Plug it in the computer"]);
  game.dialogs["files2_dialog"] = new Dialog ("files2_dialog", game.partner_name, "We shouldn't leave suspicious flash drives lying around", ["Continue."]);
  game.dialogs["files3_dialog"] = new Dialog ("files3_dialog", game.partner_name, "I don't think that was good. Take a look at the web browser. It's on some sketchy looking website.", ["Continue."]);
  game.dialogs["files4_dialog"] = new Dialog ("files4_dialog", game.player_name, "(I don't think that worked... that probably isn't good.) ", ["Continue."]);
  game.dialogs["files5_dialog"] = new Dialog ("files5_dialog", "", "You take the red flash drive", ["Continue."]);

  game.dialogs["finish1_dialog"] = new Dialog ("finish1_dialog", "Librarian", "Do you know what's causing the problem?", ["These two flashdrives we found"]);
  game.dialogs["finish2_dialog"] = new Dialog ("finish2_dialog", game.player_name, "These two flashdrives seem to be infected with some kind of virus that is infecting the computer.", ["Continue."]);
  game.dialogs["finish3_dialog"] = new Dialog ("finish3_dialog", "Librarian", "Can you fix the computers?", ["No you should call the Division of IT to fix it.", "I'll take a shot at it."]);
  
  game.dialogs["librarian_dialog_2"] = new Dialog ("librarian_dialog_2", "Librarian", "Do you know what's causing the problem?", ["No, not yet."]);
  game.dialogs["librarian_dialog_3"] = new Dialog ("librarian_dialog_3", "Librarian", "Do you know what's causing the problem?", ["No, not yet.", "It's this flash drive we found."]);
  game.dialogs["finish_dialog_2b"] = new Dialog ("finish_dialog_2b", game.player_name, "This flash drive seems to be infected with some kind of virus that is infecting the computer.", ["Continue."]);

  
  var library_computer_virus_path = "Computer/Internet Explorer/Plugins";
  var library_computer_virus_file = "trojan.horse";
  
  var ERROR_STRING = "If you see this message, Jonathan Hansford messed up the code and should be ashamed of it.";

  
  game.filesystems["library_computer_filesystem"] = new FileSystem();
  addToFileSystem(game.filesystems["library_computer_filesystem"], "", new Folder ("Desktop", []));
  addToFileSystem(game.filesystems["library_computer_filesystem"], "", new Folder ("Documents", ["HIST201 Paper.docx"]));
  addToFileSystem(game.filesystems["library_computer_filesystem"], "", new Folder ("Downloads", ["vietnam_war_protest_poster.pdf", "lyndon_b_johnson_1964_campaign_speech.pdf"]));
  addToFileSystem(game.filesystems["library_computer_filesystem"], "", new Folder ("Music", [new Folder ("Sample Music", ["Themes from the Unfinished Symphony.wav"])]));
  addToFileSystem(game.filesystems["library_computer_filesystem"], "", new Folder ("Pictures", [new Folder ("Sample Pictures", ["horses.jpg", "lighthouse.jpg", "penguins.jpg", "tulips.jpg"]), "neon-cat.gif"]));
  addToFileSystem(game.filesystems["library_computer_filesystem"], "", new Folder ("Videos", [new Folder ("Sample Videos", ["wildlife.mpg"])]));
  addToFileSystem(game.filesystems["library_computer_filesystem"], "", new Folder ("Computer", [
	new Folder ("Microsoft Office", ["Word 2013.exe", "Excel 2013.exe", "Power Point 2013.exe", "One Note 2013.exe"]),
	new Folder ("Java", [new Folder ("jre7", ["COPYRIGHT", "LICENSE", "readme.txt", "javawr.jar", "tools.jar", "charsets.jar"])]),
	new Folder ("Internet Explorer", [new Folder ("Plugins", ["bingsearchbar.dll", "adobePDFLinkHelper.dll", "Java Plug-in SSV Helper.dll"]), "ie10.exe"])
  ]));
  
  addToFileSystem(game.filesystems["library_computer_filesystem"], library_computer_virus_path, library_computer_virus_file);
  
  game.dialogs["library_fixed_computer"] = new Dialog ("library_fixed_computer", "Librarian", "Great job, you fixed it. Looks like it was that " + library_computer_virus_file + ".", ["Continue."]);
  game.dialogs["library_still_fixing_computer"] = new Dialog ("library_still_fixing_computer", "Librarian", "Should I call in tech support or are you still working on it.", ["I can't figure it out. Call in the IT guys.", "I'm still working on it."]);
  
  game.screens["library_success"] = new Screen (0, 0, 0, new Image ("image/mission/complete", 0, 0, 0), [
	  new Button ("library_quit", 404, 427, 714, 515, 2, "Select Another Mission", "24px Arial", "rgba(255,255,255,1)")
	], [], [
	  new Rectangle ("library_success_quit_backing_rectangle", 404, 427, 714, 515, 1, "rgba(255,255,255,0.5)"),
	  new Text ("library_score",  404, 535, 714, 600, 2, ERROR_STRING, "24px Arial", "rgba(255,255,0,1)")
	]
  );
 
  game.library_variables = {
    usb1:false,
    usb2:false,
	entry_dialog_shown:false,
	librarian_start_dialog_shown:false,
	virus_path:library_computer_virus_path,
	virus_file:library_computer_virus_file,
	fixed_virus:false,
	score:0,
	on_completion_trigger_email_hack:false,
	video_shown:false
  };
}

function enterLibrary (resizeCanvas, changeMainScreen, showDialog, vars) {
  resizeCanvas(1152,648);
  changeMainScreen("library");
  if (!vars.entry_dialog_shown) {
	showDialog("start_dialog");  
  }
}

function finishLibrary (vars, score_text_element, resizeCanvas, changeMainScreen, playVideo, checkForGameCompletion, triggerEmailHack) {
	var score = (vars.usb1 ? 15 : 0) + (vars.usb2 ? 15 : 0) + (vars.fixed_virus ? 5 : 0);
	if (score > vars.score)
	  vars.score = score;
	score_text_element.text = "You Scored " + vars.score + " Points (out of 30)!";
	resizeCanvas(1152, 648);
	changeMainScreen("library_success");
	if (!vars.video_shown) {
	  playVideo("video/malware");
	  vars.video_shown = true;
	}
	if (vars.on_completion_trigger_email_hack) {
		triggerEmailHack();
	}
	checkForGameCompletion();
}

function library_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, displayFileSystem, closeFilesystem, existsInFileSystem, triggerEmailHack, checkForGameCompletion, returnToPlayerOffice, vars, score_text_element) {
  if (button == "librarian") {
    changeMainScreen("librarian");
	if (!vars.librarian_start_dialog_shown) {
      showDialog("librarian_start_dialog");
	}
	else {
	  if (vars.usb1 || vars.usb2) {
		showDialog("librarian_dialog_3");
	  } else {
		showDialog("librarian_dialog_2");
	  }
	}
    return true;
  }
  else if (button == "dialog_start_dialog_Continue.") {
	vars.entry_dialog_shown = true;
    closeDialog();
    return true;
  }
  else if (button == "dialog_librarian_start_dialog_Continue.") {
	closeDialog();
    showDialog("ashley_dialog");
    return true;
  }
  else if (button == "dialog_ashley_dialog_Continue.") {
	vars.librarian_start_dialog_shown = true;
    closeDialog();
    changeMainScreen("library2");
    return true;
  }

  else if (button == "yellow_shirt") {
    changeMainScreen("yellow_gamescreen");
    showDialog("yellow1_dialog");
    return true;
  }
  else if (button == "dialog_yellow1_dialog_Continue.") {
    closeDialog();
    showDialog("yellow2_dialog");
    return true;
  }
  else if (button == "dialog_yellow2_dialog_Continue.") {
    closeDialog();
    changeMainScreen("library2");
    return true;
  }
  else if (button == "glasses") {
    changeMainScreen("glasses_gamescreen");
    showDialog("glasses1_dialog");
    return true;
  }
  else if (button == "dialog_glasses1_dialog_Continue.") {
    closeDialog();
    showDialog("glasses2_dialog");
    return true;
  }
  else if (button == "dialog_glasses2_dialog_Continue.") {
    closeDialog();
    showDialog("glasses3_dialog");
    return true;
  }
  else if (button == "dialog_glasses3_dialog_Continue.") {
    closeDialog();
    changeMainScreen("glasses2_gamescreen");
    showDialog("glasses4_dialog");
    return true;
  }
  else if (button == "dialog_glasses4_dialog_Continue.") {
    closeDialog();
    showDialog("glasses5_dialog");
    return true;
  }
  else if (button == "dialog_glasses5_dialog_Continue.") {
    closeDialog();
    showDialog("glasses6_dialog");
    return true;
  }
  else if (button == "dialog_glasses6_dialog_Continue.") {
    closeDialog();
    showDialog("glasses7_dialog");
    return true;
  }
  else if (button == "dialog_glasses7_dialog_Continue.") {
    closeDialog();
    showDialog("glasses8_dialog");
    return true;
  }
  else if (button == "dialog_glasses8_dialog_Continue.") {
    closeDialog();
    showDialog("glasses9_dialog");
    return true;
  }
  else if (button == "dialog_glasses9_dialog_Continue.") {
    closeDialog();
    showDialog("glasses10_dialog");
    return true;
  }
  else if (button == "dialog_glasses10_dialog_Continue.") {
    closeDialog();
    vars.usb1 = true;
    if (vars.usb1 == true && vars.usb2 == true) {
      changeMainScreen("finish");
      return true;
    }
    else {
      changeMainScreen("library2");
      return true;
    }
  }
  else if (button == "red") {
    changeMainScreen("red_gamescreen");
    showDialog("red1_dialog");
    return true
  }
  else if (button == "dialog_red1_dialog_Continue.") {
    closeDialog();
    showDialog("red2_dialog");
    return true;
  }
  else if (button == "dialog_red2_dialog_Continue.") {
    closeDialog();
    showDialog("red3_dialog");
    return true;
  }
  else if (button == "dialog_red3_dialog_Continue.") {
    closeDialog();
    showDialog("red4_dialog");
    return true;
  }
  else if (button == "dialog_red4_dialog_Continue.") {
    closeDialog();
    changeMainScreen("library2")
    return true;
  }
  else if (button == "stripes") {
    showDialog("stripe_dialog");
    return true;
  }
  else if (button == "dialog_stripe_dialog_0.5x + 0.25cos(2x)") {
	closeDialog();
	showDialog("stripe2_dialog"); // Incorrect answer
	return true;
  }
  else if (button == "dialog_stripe_dialog_0.5x - 0.25sin(2x)") {
	closeDialog();
	showDialog("stripe3_dialog"); // Correct answer
	return true;
  }
  else if (button == "dialog_stripe_dialog_I don't know.") {
    closeDialog();
    return true;
  }
  else if (button == "dialog_stripe2_dialog_Okay.") {
	closeDialog();
	return true;
  } 
  else if (button == "dialog_stripe3_dialog_Okay.") {
	closeDialog();
	return true;
  }
  else if (button == "files") {
    changeMainScreen("files_gamescreen");
    return true;
  }
  else if (button == "usb") {
    showDialog("files1_dialog");
    return true;
  }
  else if (button == "dialog_files1_dialog_Take it") {
    closeDialog();
    vars.usb2 = true;
    showDialog("files2_dialog");
    return true;
  }
  else if (button == "dialog_files2_dialog_Continue.") {
    closeDialog();
    if (vars.usb1 == true && vars.usb2 == true) {
      changeMainScreen("finish");
      return true;
    }
    else {
      changeMainScreen("library2");
      return true;
    }
  }

  else if (button == "dialog_files1_dialog_Plug it in the computer") {
    closeDialog();
    showDialog("files3_dialog");
    return true;
  }
  else if (button == "dialog_files3_dialog_Continue.") {
    closeDialog();
    changeMainScreen("files3_gamescreen");
    return true;
  }
  else if (button == "web") {
    changeMainScreen("files2_gamescreen");
    return true;
  }
  else if (button == "screen") {
    changeMainScreen("files_gamescreen");
    showDialog("files4_dialog")
    return true;
  }
  else if (button == "dialog_files4_dialog_Continue.") {
    closeDialog();
    showDialog("files5_dialog");
    return true;
  }
  else if (button == "dialog_files5_dialog_Continue.") {
    closeDialog();
    changeMainScreen("library2");
    vars.usb2 = true;
    if (vars.usb1 == true && vars.usb2 == true) {
      changeMainScreen("finish");
      return true;
    }
    return true;
  }
  else if (button == "librarian2") {
    showDialog("finish1_dialog");
    return true;
  }
  else if (button == "dialog_finish1_dialog_These two flashdrives we found") {
    closeDialog();
    showDialog("finish2_dialog");
    return true;
  }
  else if (button == "dialog_finish2_dialog_Continue." || button == "dialog_finish_dialog_2b_Continue.") {
    closeDialog();
    showDialog("finish3_dialog");
    return true;
  }
  else if (button == "dialog_finish3_dialog_No you should call the Division of IT to fix it.") {
    closeDialog();
   
	finishLibrary(vars, score_text_element, resizeCanvas, changeMainScreen, playVideo, checkForGameCompletion, triggerEmailHack);
    return true;
  } else if (button == "dialog_librarian_dialog_2_No, not yet." || button == "dialog_librarian_dialog_3_No, not yet.") {
    closeDialog();
	changeMainScreen("library2");
	return true;
  } else if (button == "dialog_finish3_dialog_I'll take a shot at it.") {
	closeDialog();
	displayFileSystem("library_computer_filesystem");
	return true;
  } else if (button == "dialog_librarian_dialog_3_It's this flash drive we found.") {
	closeDialog();
	showDialog("finish_dialog_2b");
	return true;
  } else if (button == "filesystem_exit") {
	if (existsInFileSystem("library_computer_filesystem", vars.virus_path, vars.virus_file)) {
		showDialog("library_still_fixing_computer");
	} else {
		showDialog("library_fixed_computer");
	}
	return true;
  } else if (button == "dialog_library_fixed_computer_Continue.") {
	vars.fixed_virus = true;
	closeDialog();
	closeFilesystem();
	
	finishLibrary(vars, score_text_element, resizeCanvas, changeMainScreen, playVideo, checkForGameCompletion, triggerEmailHack);
	
	return true;
  } else if (button == "dialog_library_still_fixing_computer_I'm still working on it.") {
	closeDialog();
	return true;
  } else if (button == "dialog_library_still_fixing_computer_I can't figure it out. Call in the IT guys.") {
    closeDialog();
	closeFilesystem();
	
	finishLibrary(vars, score_text_element, resizeCanvas, changeMainScreen, playVideo, checkForGameCompletion, triggerEmailHack);

	return true;
  } else if (button == "library_quit") {
	returnToPlayerOffice();
	return true;
  }

  else if (button == "go_to_library") { // Button on the phone's map app.
		enterLibrary(resizeCanvas, changeMainScreen, showDialog, vars);
		return false; // Allow the main file to handle this event as well.
  } else {
    return false;
  } 

}
