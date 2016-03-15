function load_library (game) {
  game.screens["library"] = new Screen (0, 0, 0, new Image ("image/library", 0, 0, 0), [
    new Button ("librarian", 1007, 220, 1062, 308)
  ], [], []);
  game.screens["library2"] = new Screen (0, 0, 0, new Image ("image/library", 0, 0, 0), [
    new Button ("librarian", 1007, 220, 1062, 308),
    new Button ("yellow_shirt", 768, 280, 807, 323),
    new Button ("glasses", 689, 293, 767, 398),
    new Button ("files", 502, 306, 639, 426),
    new Button ("red", 378, 263, 458, 366),
    new Button ("stripes", 10, 201, 101, 331),
  ], [], []);
  game.screens["finish"] = new Screen (0, 0, 0, new Image ("image/library", 0, 0, 0), [
    new Button ("librarian2", 1007, 220, 1062, 308),
    new Button ("yellow_shirt", 768, 280, 807, 323),
    new Button ("glasses", 689, 293, 767, 398),
    new Button ("files", 502, 306, 639, 426),
    new Button ("red", 378, 263, 458, 366),
    new Button ("stripes", 10, 201, 101, 331),
  ], [], []);
  game.screens["librarian"] = new Screen (0, 0, 0, new Image ("image/librarian", 0, 0, 0), [
    new Button ("librarian", 1007, 220, 1062, 308)
  ], [], []);
  game.screens["yellow_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp3", 0, 0, 0), [], [], []);
  game.screens["glasses_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp2", 0, 0, 0), [], [], []);
  game.screens["glasses2_gamescreen"] = new Screen (0, 0, 0, new Image ("image/infected", 0, 0, 0), [], [], []);
  game.screens["red_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp3", 0, 0, 0), [], [], []);
  game.screens["files_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp1", 0, 0, 0), [
    new Button ("usb", 227, 459, 302, 513),
  ], [], []);
  game.screens["files3_gamescreen"] = new Screen (0, 0, 0, new Image ("image/comp1", 0, 0, 0), [
    new Button ("web", 477, 54, 600, 150)
  ], [], []);
  game.screens["files2_gamescreen"] = new Screen (0, 0, 0, new Image ("image/infected2", 0, 0, 0), [
    new Button ("screen", 0, 0, 1151, 647)
  ], [], []);

  game.dialogs["start_dialog"] = new Dialog ("start_dialog", "Ashley", "Let's go talk to the librarian about the issues the library computers have been having.", ["Continue."]);
  game.dialogs["librarian_start_dialog"] = new Dialog ("librarian_start_dialog", "Librarian", "Thanks for coming. About a day ago, one of the computers in the computer lab stopped working normally, and instead, it got stuck on some strange website. Since then, it seems like every few hours, another computer is lost to this virus, and I don't know what is causing it or how to remove it. I need you to find the cause, and if you can, show me how to fix one of the computers, if you can find a solution.", ["Continue."]);
  game.dialogs["ashley_dialog"] = new Dialog ("ashley_dialog", "Ashley", "We'll do our best ma'am.", ["Continue."]);

  game.dialogs["yellow1_dialog"] = new Dialog ("yellow1_dialog", game.player_name, "Do you know if there is anything wrong with this computer?", ["Continue."]);
  game.dialogs["yellow2_dialog"] = new Dialog ("yellow2_dialog", "Pale Yellow Shirt", "I'm pretty sure it's working fine. I haven't had any problems with it yet. I just got here though. I have a paper due tonight and I haven't started yet. But if something strange happens while you are here, I'll let you know", ["Continue."]);

  game.dialogs["glasses1_dialog"] = new Dialog ("glasses1_dialog", game.player_name, "Do you have any papers due today?", ["Continue."]);
  game.dialogs["glasses2_dialog"] = new Dialog ("glasses2_dialog", "Glasses", "No I'm just here to work on a programming project.", ["Continue."]);
  game.dialogs["glasses3_dialog"] = new Dialog ("glasses3_dialog", "Glasses", "What?! What the heck?! <Furious banging on keyboard>", ["Continue."]);
  game.dialogs["glasses4_dialog"] = new Dialog ("glasses4_dialog", "Glasses", "ARGH! It's totally locked up! I don't have time for this!", ["Continue."]);
  game.dialogs["glasses5_dialog"] = new Dialog ("glasses5_dialog", game.player_name, "What did you do to it?", ["Continue."]);
  game.dialogs["glasses6_dialog"] = new Dialog ("glasses6_dialog", "Glasses", "All I've done is login and plugin a flashdrive. Someone else must have messed with it.", ["Continue."]);
  game.dialogs["glasses7_dialog"] = new Dialog ("glasses7_dialog", game.player_name, "Is the USB yours?", ["Continue."]);
  game.dialogs["glasses8_dialog"] = new Dialog ("glasses8_dialog", "Glasses", "No I just found it here lying around. Figured I check what was on it to see whose it was.", ["Continue."]);
  game.dialogs["glasses9_dialog"] = new Dialog ("glasses9_dialog", "Ashley", "Can I have that? It might have caused the virus that just infected the computer. The autorun could be setup to automatically execute malware files.", ["Continue."]);
  game.dialogs["glasses10_dialog"] = new Dialog ("glasses10_dialog", "Glasses", "Sure, take it. I don't need it.", ["Continue."]);

  game.dialogs["red1_dialog"] = new Dialog ("red1_dialog", game.player_name, "Have you been experiencing any difficulty with these computers?", ["Continue."]);
  game.dialogs["red2_dialog"] = new Dialog ("red2_dialog", "Red Shirt", "I don't think so and I don't have time to check. I've been working all night on this paper! It's due at the start of class, in one hour.", ["Continue."]);
  game.dialogs["red3_dialog"] = new Dialog ("red3_dialog", game.player_name, "Well hurry up and finish then so I can check this computer.", ["Continue."]);
  game.dialogs["red4_dialog"] = new Dialog ("red4_dialog", "Red Shirt", "Beleive me I am working as fast as I can", ["Continue."]);

  game.dialogs["stripe_dialog"] = new Dialog ("stripe_dialog", "Striped Shirt", "What's the integral of sin^2(x)?", ["Continue."]);

  game.dialogs["files1_dialog"] = new Dialog ("files1_dialog", "", "It's a red flash drive", ["Take it", "Plug it in the computer"]);
  game.dialogs["files2_dialog"] = new Dialog ("files2_dialog", "Ashley", "We shouldn't leave suspicious flash drives lying around", ["Continue."]);
  game.dialogs["files3_dialog"] = new Dialog ("files3_dialog", "Ashley", "I don't think that was good. Take a look at the web browser. It's on some sketchy looking website.", ["Continue."]);
  game.dialogs["files4_dialog"] = new Dialog ("files4_dialog", game.player_name, "(I don't think that worked... that probably isn't good.) ", ["Continue."]);
  game.dialogs["files5_dialog"] = new Dialog ("files5_dialog", "", "You take the red flash drive", ["Continue."]);

  game.dialogs["finish1_dialog"] = new Dialog ("finish1_dialog", "Librarian", "Do you know what's causing the problem?", ["These two flashdrives we found"]);
  game.dialogs["finish2_dialog"] = new Dialog ("finish2_dialog", game.player_name, "These two flashdrives seem to be infected with some kind of virus that is infecting the computer.", ["Continue."]);
  game.dialogs["finish3_dialog"] = new Dialog ("finish3_dialog", "Librarian", "Can you fix the computers?", ["No you should call the Division of IT to fix it."]);

  game.library_variables = {
    usb1:false,
    usb2:false
  };
}

function enterLibrary (resizeCanvas, changeMainScreen, showDialog, vars) {
  resizeCanvas(1152,648);
  changeMainScreen("library");
  showDialog("start_dialog");
}

function library_onclick (button, showDialog, closeDialog, changeMainScreen, resizeCanvas, addElementToScreen, playVideo, vars) {
  if (button == "librarian") {
    changeMainScreen("librarian");
    showDialog("librarian_start_dialog");
    return true;
  }
  else if (button == "dialog_start_dialog_Continue.") {
    closeDialog();
    return true
  }
  else if (button == "dialog_librarian_start_dialog_Continue.") {
    closeDialog();
    showDialog("ashley_dialog");
    return true;
  }
  else if (button == "dialog_ashley_dialog_Continue.") {
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
  else if (button == "dialog_stripe_dialog_Continue.") {
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
  else if (button == "dialog_finish2_dialog_Continue.") {
    closeDialog();
    showDialog("finish3_dialog");
    return true;
  }
  else if (button == "dialog_finish3_dialog_No you should call the Division of IT to fix it.") {
    closeDialog();
    playVideo("video/malware");
    return true;
  }

  else if (button == "go_to_library") { // Button on the phone's map app.
		enterLibrary(resizeCanvas, changeMainScreen, showDialog, vars);
		return false; // Allow the main file to handle this event as well.
  } else {
    return false;
  }

}
