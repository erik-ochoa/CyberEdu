// Class definition for rectangular button
	// List of all buttons listening for events. A button is actively listening when it is created.
	var all_buttons = [];
	
	// Constructor
	var Button = function(topLeftX, topLeftY, bottomRightX, bottomRightY, fun) {
		this.x1 = topLeftX;
		this.y1 = topLeftY;
		this.x2 = bottomRightX;
		this.y2 = bottomRightY;
		this.action = fun;
		all_buttons[all_buttons.length] = this;
	};
	
	// returns true if a point is within the bounds of the button
	Button.prototype.isWithinBounds = function(x, y) {
		return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
	};
	
	// calls the function given as the event for this button
	Button.prototype.doAction = function() {
		this.action();
	};
	
	Button.prototype.reactToClickAt = function(x, y) {
		if (this.isWithinBounds(x, y)) {
			this.doAction();
		}
	};
	
	Button.prototype.setEnabled = function(b) {
		if (b) {
			var found = false;
			for (var i = 0; i < all_buttons.length; i++) {
				if (all_buttons[i] == this) {
					found = true;
				}
			}
			if (!found) {
				all_buttons[all_buttons.length] = this;
			}
		}
		else {
			for (var i = 0; i < all_buttons.length; i++) {
				if (all_buttons[i] == this) {
					all_buttons.splice(i, 1);
				}
			}
		}
	};
	
	function click_position(event) {
		// Compatibility Code taken from http://www.quirksmode.org/js/events_properties.html
		var e = event || window.event
		var posx = 0;
		var posy = 0;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		// End compatibility code, posx & posy contain the clicked position
		
		// Cause event(s) to occur based on the location of the mouse click.
		for (var i = 0; i < all_buttons.length; i++) {
			all_buttons[i].reactToClickAt(posx, posy);
		}
	}
	
	function rollover_position(event) {
		// Compatibility Code taken from http://www.quirksmode.org/js/events_properties.html
		var e = event || window.event
		var posx = 0;
		var posy = 0;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		// End compatibility code, posx & posy contain the clicked position
		
		var found = false;
		for (var i = 0; i < all_buttons.length; i++) {
			if (all_buttons[i].isWithinBounds(posx, posy)) {
				found = true;
			}
		}
		
		if (found)
			document.getElementById("view").style.cursor = "pointer";
		else
			document.getElementById("view").style.cursor = "auto";
	}
