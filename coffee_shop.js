// DO NOT declare variables at the Top level scope in this file.
// Put them into the game object in the load_coffee_shop() method instead.

function load_coffee_shop (game) {
	game.screens["coffee_shop"] = new Screen (0, 0, 0, new Image ("image/coffeeshop", 0, 0, 0), [
		new Button ("coffee_shop_manager", 268, 313, 328, 396), 
		new Button ("coffee_shop_customer_1", 342, 321, 398, 530)
	], [], []);
	
	game.dialogs["coffee_shop_customer_1_dialog"] = new Dialog ("coffee_shop_customer_1_dialog", game.player_name, "Hello, I'm a detective investigating the robberies here. Do you know anything about them?", ["Continue."]);
	game.dialogs["coffee_shop_customer_1_dialog_2"] = new Dialog ("coffee_shop_customer_1_dialog_2", "Black Jeans", "I have not been robbed. I've never used a computer in here before, so I think that the robberies have something to do with people's computers.", ["Okay."]);
	
	game.coffee_shop_variables = {};
}

// Returns true if the input event is consumed by this function, false if it does not.
// Takes the name of the button and whatever other arguments it needs from the server.js in order to work.
function coffee_shop_onclick (button, showDialog, closeDialog) {
	if (button == "coffee_shop_manager") {
		return true;
	} else if (button == "coffee_shop_customer_1") {
		showDialog("coffee_shop_customer_1_dialog");
		return true;
	} else if (button == "dialog_coffee_shop_customer_1_dialog_Continue.") {
		closeDialog();
		showDialog("coffee_shop_customer_1_dialog_2");
		return true;
	} else if (button == "dialog_coffee_shop_customer_1_dialog_2_Okay.") {
		closeDialog();
		return true;
	} else
		return false;
}