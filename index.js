var SERVER_HOSTNAME = 'http://localhost:8011';
var CANVAS_ELEMENT = document.getElementById('view');
var g = CANVAS_ELEMENT.getContext('2d');
var MAX_X = 1280;
var MAX_Y = 630;
var CANVAS_X = CANVAS_ELEMENT.getBoundingClientRect().left;
var CANVAS_Y = CANVAS_ELEMENT.getBoundingClientRect().top;

var socket = io(SERVER_HOSTNAME);

/* Map of HTML id -> GIF object.
 * Contains all GIFs that will be used by the game.
 */
var animatedGIFs = {};
animatedGIFs["animation/dorm_room/transition"] = load_gif_from_url(SERVER_HOSTNAME + "/images/transition_to_cyberworld.gif");

/* The objects currently being displayed. Contains objects with the following fields:
	type: Either 'image', 'text', 'rectangle', 'animation', or 'button_text'
	x: The x-value of the top left corner
	y: The y-value of the top left corner
	layer: The layer this image should be drawn in. Images with higher layers are drawn ontop of the lower layers.
	
   Images have the following additional fields:
	id: The ID of the image in the HTML document
	image: The actual image element.
	
   Animations have the following additional fields
    id: The ID of the animated GIF in the HTML document
	gif: The GIF object associated with this animation
	frame_no: The index of the current frame being displayed
	loops_remaining: The # of loops of the animation left to run, or -1 if the animation should run forever.
	timer_id: The id of the timer that is responsible for advancing this animation to the next frame.
  	
   Text objects have the following additional fields:
	text: the text to draw
	x2: Right
	y2: Bottom
	font: the font to use to draw the text
	font_color: the font color to use to draw the text
	name: the name of the text

   Button text objects have the following additional fields
	text: the text to draw
	x2: Right
	y2: Bottom
	font: the font to use to draw the text
	font_color: the font color to use to draw the text
	button_name: the name of the button associated with this text

   Rectangle objects have the following additional fields:
    name: A name for the rectangle
	x2: The x-value of the bottom right corner
	y2: The y-value of the bottom right corner
	font_color: The style to fill the rectangle with
	
 * The objects are stored in increasing order, according to their layer.
*/
var display = [];

/* Draws the specified display element */
function drawDisplayElement (element) {
	if (element.type == 'image') {
		g.drawImage(element.image, element.x, element.y);
	} else if (element.type == 'text' || element.type == 'button_text') {
		g.font = element.font;
		g.fillStyle = element.font_color;
		// The active text field has a cursor
		if (activeTextInputField != null && element.type == 'button_text' && activeTextInputField.name == element.button_name) {
			drawText(element.text + '|', element.x, element.y, element.x2, element.y2);
		} else {
			drawText(element.text, element.x, element.y, element.x2, element.y2);		
		}
	} else if (element.type == 'rectangle') {
		g.fillStyle = element.font_color;
		g.fillRect(element.x, element.y, element.x2 - element.x, element.y2 - element.y);
	} else if (element.type == 'animation') {
		// Draw the current frame
		g.drawImage(animatedGIFs[element.id].frames[element.frame_no], element.x, element.y);
	} else {
		console.log("Bad display element: " + element);
	}
}

/* Helper function to draw text within a specified box. 
 * A minimum of one word is placed on each line, even if the size of that word exceeds the size of the box.
 * The bottom edge of the text will be respected, possibly causing no text to be drawn if the box was too small.
 */
function drawText(text, x1, y1, x2, y2) {
	var textHeight = parseInt(g.font);
	var yPosition = y1 + textHeight;
	var words = text.split(' ');
	var i = 0;
	while (i < words.length && yPosition <= y2) {
		// Put one word on each line, even if the line overflows.
		var line = words[i];
		i++;
		// Put additional words on the line, as space permits.
		while (i < words.length && g.measureText(line + ' ' + words[i]).width <= x2 - x1) {
			line += ' ' + words[i];
			i++;
		}
		g.fillText(line, x1, yPosition);
		yPosition += textHeight;
	}
}

/* The buttons that are currently active. Buttons are objects with the following fields:
	name: A unique name for this button (provided by the server, must be unique among buttons and text input fields)
	x1: Left edge
	y1: Top edge
	x2: Right edge
	y2: Bottom edge
	hasText: boolean, true if this button has an associated text element.
*/
var buttons = [];

/* A list of text input fields that are currently active. Text input fields are objects with the following fields:
	name: A unique name for this text input field (provided by the server, must be unique among text input fields and buttons)
	x1: left edge
	y1: top edge
	x2: right edge
	y2: bottom edge
	The text in these fields is maintained in their associated button_text display objects.
*/
var textInputFields = [];

// The currently active text input field, or null if no field is active.
var activeTextInputField = null;

// True if the user is currently holding down the shift key.
var shiftHeld = false;

// Volume (ranging from 0.0 to 1.0) of the text-to-speech elements
var textToSpeechVolume = 1.0;

// A structure (containing the elements x and y) which is the last known position of the mouse.
var lastKnownMousePosition = {x:0.0, y:0.0}

/* Groups of commands arrive as an array, to be executed in sequence. 
 * An individual command is an array: the first element is the name, following elements (if any) are the arguments. 
   The following commands are valid:
	drawImage: (id, x1, y1, layer) - draws an image at the position (x1, y1) in the specified layer.
	drawRectangle: (name, x1, y1, x2, y2, layer, fillStyle) - draws a solid Rectangle.
	drawText: (name, x1, y1, x2, y2, layer, text, font, font_color) - draws text
	clearImage: () - clears all the images, rectangles, and text (except text associated with buttons) from the display
	clearImage: (id, x1, y1, layer) - clears a specific image from the display.
	clearRectangle: (name) - clears a rectangle.
	clearText: (name) - clears text.
	addButton: (name, x1, y1, x2, y2) - adds an invisible rectangular button
	addButton: (name, x1, y1, x2, y2, text, font, font_color, layer) - adds a button with the specified text.
	deleteButton: (name) - deletes the button with the specified name, and its associated text (if any) in the display
	playSound: (id) - plays the specified sound
	stopSound: (id) - stops the specified sound
	playVideo: (id) - plays the specified video through, then returns to the game
	resizeCanvas: (x, y) - resizes the canvas to the specified width and height
	speakText: (text) - speaks the specified text using the Text-to-Speech engine's default voice
	speakText: (text, voice) - speaks the text using the Text-to-Speech engine with the specified voice
	drawAnimatedGif: (id, x1, y1, layer, request_end_notification) - draws the animated GIF at the position (x1, y1) in the specified layer.
	clearAnimatedGif: (id) - clears a specific animated GIF from the display.
 */
socket.on('command', function (array) {
	for (var i = 0; i < array.length; i++) {
		console.log("array[" + i + "] = " + array[i]);
		var command_name = array[i][0];
		if (command_name == 'drawImage') {
			var id = array[i][1];
			var x1 = array[i][2];
			var y1 = array[i][3];
			var layer = array[i][4];
			
			var image = document.getElementById(id);
			/* Draw the image */
			g.drawImage(image, x1, y1);
			/* Re-draw images which should be drawn over this one */
			for (var j = 0; j < display.length; j++) {
				if (display[j].layer > layer) {
					drawDisplayElement(display[j]);
				}				
			}
			
			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			// This call to splice inserts the element into the array, sliding elements behind it down one.
			display.splice(j, 0, {type:'image', id: id, x:x1, y:y1, layer:layer, image:image});
			
		} else if (command_name == 'clearImage') {
			if (array[i].length == 1) {
			// No arguments, clear all images, shapes, and unassociated text from display
				for (var j = 0; j < display.length; j++) {
					if (display[j].type == 'image' || display[j].type == 'rectangle' || display[j].type == 'text') {
						display.splice(j, 1);
						j--;
					}
				}
				g.putImageData(g.createImageData(), MAX_X, MAX_Y);
				
				g.fillStyle = 'rgba(255,255,255,1)'
				g.fillRect(0, 0, MAX_X, MAX_Y);
				
				
				for (var j = 0; j < display.length; j++) {
					drawDisplayElement(display[j]);
				}
			} else {
			// Arguments present, clear a specific image.
				var id = array[i][1];
				var x1 = array[i][2];
				var y1 = array[i][3];
				var layer = array[i][4];
				
				/* Delete the specified image */
				for (var j = 0; j < display.length; j++) {
					if (display[j].id == id && display[j].x == x1 && display[j].y == y1 && display[j].layer == layer) {
						display.splice(j, 1);
						j--;
					}
				}
				
				/* Redraws all other images. Relies on the fact that images are stored in increasing order with respect to layer */
				g.fillStyle = 'rgba(255,255,255,1)'
				g.fillRect(0, 0, MAX_X, MAX_Y);
				for (var j = 0; j < display.length; j++) {
					drawDisplayElement(display[j]);
				}
				
			}
			
		} else if (command_name == 'addButton') {
			if (array[i].length == 6) {
			// Invisible button (with no text)
				var name = array[i][1];
				var x1 = array[i][2];
				var y1 = array[i][3];
				var x2 = array[i][4];
				var y2 = array[i][5];
				
				buttons[buttons.length] = {name: name, x1:x1, y1:y1, x2:x2, y2:y2, hasText:false};
			} else if (array[i].length == 10) {
			// Button with text
				var name = array[i][1];
				var x1 = array[i][2];
				var y1 = array[i][3];
				var x2 = array[i][4];
				var y2 = array[i][5];
				var text = array[i][6];
				var font = array[i][7];
				var font_color = array[i][8];
				var layer = array[i][9];
				
				buttons[buttons.length] = {name:name, x1:x1, y1:y1, x2:x2, y2:y2, hasText:true};
				var j = 0;
				while (j < display.length && display[j].layer <= layer) {
					j++;
				}
				display.splice(j, 0, {type:'button_text', x:x1, y:y1, x2:x2, y2:y2, layer:layer, text:text, font:font, font_color:font_color, button_name:name});
				
				// Draw the new display element, and re-draw anything above it.
				while (j < display.length) {
					drawDisplayElement(display[j]);
					j++;
				}
				
			}
		} else if (command_name == 'deleteButton') {
			var name = array[i][1];
			
			for (var j = 0; j < buttons.length; j++) {
				if (buttons[j].name == name) {
					if (buttons[j].hasText) {
						/* Delete the text element */
						for (var k = 0; k < display.length; k++) {
							if (display[k].button_name == name) {
								display.splice(k, 1);
								k--;
							}							
						}
						
						/* Redraw the display */
						g.fillStyle = 'rgba(255,255,255,1)'
						g.fillRect(0, 0, MAX_X, MAX_Y);
						for (var k = 0; k < display.length; k++) {
							drawDisplayElement(display[k]);
						}
					}
					buttons.splice(j, 1);
					j--;
				}				
			}	
		} else if (command_name == 'playSound') {
			var id = array[i][1];
			document.getElementById(id).play();
		} else if (command_name == 'stopSound') {
			var id = array[i][1];
			document.getElementById(id).pause();
			document.getElementById(id).currentTime = 0;
		} else if (command_name == 'drawRectangle') {
			var name = array[i][1];
			var x1 = array[i][2];
			var y1 = array[i][3];
			var x2 = array[i][4];
			var y2 = array[i][5];
			var layer = array[i][6];
			var style = array[i][7];
			
			g.fillStyle = style;
			g.fillRect(x1, y1, x2 - x1, y2 - y1);
			
			for (var j = 0; j < display.length; j++) {
				if (display[j].layer > layer) {
					drawDisplayElement(display[j]);
				}
			}
			
			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			display.splice(j, 0, {type:'rectangle', name:name, x:x1, y:y1, x2:x2, y2:y2, layer:layer, font_color:style});
		} else if (command_name == 'clearRectangle') {
			var name = array[i][1];
			
			for (var j = 0; j < display.length; j++) {
				if (display[j].name == name && display[j].type == 'rectangle') {
					display.splice(j, 1);
					j--;
				}
			}
			
			/* Redraw the display */
			g.fillStyle = 'rgba(255,255,255,1)'
			g.fillRect(0, 0, MAX_X, MAX_Y);
			
			for (var j = 0; j < display.length; j++) {
				drawDisplayElement(display[j]);
			}
		} else if (command_name == 'drawText') {
			var name = array[i][1];
			var x1 = array[i][2];
			var y1 = array[i][3];
			var x2 = array[i][4];
			var y2 = array[i][5];
			var layer = array[i][6];
			var text = array[i][7];
			var font = array[i][8];
			var font_color = array[i][9];
			
			g.font = font;
			g.fillStyle = font_color;
			drawText(text, x1, y1, x2, y2);

			for (var j = 0; j < display.length; j++) {
				if (display[j].layer > layer) {
					drawDisplayElement(display[j]);
				}
			}
			
			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			display.splice(j, 0, {type:'text', name:name, x:x1, y:y1, x2:x2, y2:y2, layer:layer, text:text, font:font, font_color:font_color});
		
		} else if (command_name == 'clearText') {
			var name = array[i][1];
			
			for (var j = 0; j < display.length; j++) {
				if (display[j].name == name && display[j].type == 'text') {
					display.splice(j, 1);
					j--;
				}
			}
			
			/* Redraw the display */
			g.fillStyle = 'rgba(255,255,255,1)'
			g.fillRect(0, 0, MAX_X, MAX_Y);
			
			for (var j = 0; j < display.length; j++) {
				drawDisplayElement(display[j]);
			}
		} else if (command_name == 'playVideo') {
			var id = array[i][1];
			
			var video_element = document.getElementById(id);
			CANVAS_ELEMENT.width = 0;
			CANVAS_ELEMENT.height = 0;
			
			var returnToGame = function () {
				video_element.width = 0;
				video_element.height = 0;
				
				CANVAS_ELEMENT.width = MAX_X;
				CANVAS_ELEMENT.height = MAX_Y;
				CANVAS_X = CANVAS_ELEMENT.getBoundingClientRect().left;
				CANVAS_Y = CANVAS_ELEMENT.getBoundingClientRect().top;
				for (var j = 0; j < display.length; j++) {
					drawDisplayElement(display[j]);
				}
			}
			
			video_element.width = 960;
			video_element.height = 540;
			video_element.onended = returnToGame;
			video_element.onabort = returnToGame;
			video_element.onerror = returnToGame;
			video_element.play();
			
		} else if (command_name == 'resizeCanvas') {
			var x = array[i][1];
			var y = array[i][2];
			
			MAX_X = x;
			MAX_Y = y;
			
			/* Avoids showing the canvas if the canvas is currently hidden */
			if (CANVAS_ELEMENT.width != 0) {
				CANVAS_ELEMENT.width = MAX_X;
				CANVAS_ELEMENT.height = MAX_Y;
				CANVAS_X = CANVAS_ELEMENT.getBoundingClientRect().left;
				CANVAS_Y = CANVAS_ELEMENT.getBoundingClientRect().top;
			}
			
			for (var j = 0; j < display.length; j++) {
				drawDisplayElement(display[j]);
			}
		} else if (command_name == 'addTextInputField') {
			var name = array[i][1];
			var x1 = array[i][2];
			var y1 = array[i][3];
			var x2 = array[i][4];
			var y2 = array[i][5];
			var text = array[i][6];
			var font = array[i][7];
			var font_color = array[i][8];
			var layer = array[i][9];

			// Add to the text input fields list.
			textInputFields.push({name:name, x1:x1, y1:y1, x2:x2, y2:y2});
		
			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			display.splice(j, 0, {type:'button_text', x:x1, y:y1, x2:x2, y2:y2, layer:layer, text:text, font:font, font_color:font_color, button_name:name});
			
			while (j < display.length) {
				drawDisplayElement(display[j]);
				j++;
			}
			
		} else if (command_name == 'deleteTextInputField') {
			var name = array[i][1];
			
			// must delete the input field and its associated button_text display element.
			for (var j = 0; j < textInputFields.length; j++) {
				if (textInputFields[j].name == name) {
					for (var k = 0; k < display.length; k++) {
						if (display[k].type == 'button_text' && display[k].button_name == name) {
							display.splice(k, 1);
							k--;
						}
					}
					textInputFields.splice(j, 1);
					j--;
				}
			}
			
			// must redraw entire display
			g.fillStyle = 'rgba(255,255,255,1)';
			g.fillRect(0, 0, MAX_X, MAX_Y);
			for (var j = 0; j < display.length; j++) {
				drawDisplayElement(display[j]);
			}
		} else if (command_name == 'speakText') {
			if (array[i].length == 2) {
				var text = array[i][1];
				
				responsiveVoice.speak(text, "UK English Female", {volume:textToSpeechVolume});
			} else {
				var text = array[i][1];
				var voice = array[i][2];
				
				responsiveVoice.speak(text, voice, {volume:textToSpeechVolume});
			}
		} else if (command_name == 'stopSpeakingText') {
			responsiveVoice.cancel();
		} else if (command_name == 'drawAnimation') {
			var id = array[i][1];
			var x1 = array[i][2];
			var y1 = array[i][3];
			var layer = array[i][4];
			var request_end_notification = array[i][5];
			
			var animation = {frame_no:0,
				loops_remaining:animatedGIFs[id].loops - 1, // Because the 1st loop has started, there is one fewer loop remaining than the total amount of loops
				id:id, 
				x:x1, 
				y:y1, 
				layer:layer, 
				type:'animation',
				request_end_notification:request_end_notification
			};
			
			var j = 0;
			// Scan to where this element belongs and insert it.
			while (display[j].layer <= layer) {
				j++;
			}
			
			display.splice(j, 0, animation);
			
			// Draw the 1st frame of the animation, as well as any display elements above it.
			while (j < display.length) {
				drawDisplayElement(display[j]);
				j++;
			}
			
			/* Nested helper function that advances the animation by one frame. */
			function advanceAnimation () {
				var n_frames = animatedGIFs[animation.id].frames.length;
				
				if (animation.frame_no != n_frames - 1) {
					animation.frame_no++;
				} else {
					if (animation.loops_remaining == -1) {
						animation.frame_no = 0;
					} else if (animation.loops_remaining > 0) {
						animation.frame_no = 0;
						animation.loops_remaining--;
					} else {
						if (animation.request_end_notification)
							socket.emit('animation-ended', animation.id);
						return;
					}
				}
				
				for (var j = 0; j < display.length; j++) {
					if (display[j].layer >= animation.layer)
						drawDisplayElement(display[j]); // This will draw the next animation frame along with anything overtop of it.
				}
				
				// Setup the next timer.
				animation.timer_id = setTimeout(advanceAnimation, animatedGIFs[animation.id].delays[animation.frame_no] * 10);
			}
			
			// Start animation.
			animation.timer_id = setTimeout(advanceAnimation, animatedGIFs[animation.id].delays[animation.frame_no] * 10); /* The *10 converts from 1/100ths of a second to milliseconds. */
			
		} else if (command_name == 'clearAnimation') {
			var id = array[i][1];
			
			for (var j = 0; j < display.length; j++) {
				if (display[j].type == 'animation' && display[j].id == id) {
					// Stop the animation
					if (typeof display[j].timer_id !== 'undefined') 
						clearTimeout(display[j].timer_id);
					else
						console.log("Warning: clearAnimatedGIF tried to delete a GIF with no timer. Unless the GIF had already stopped, expect trouble.");
					
					// Delete the GIF.
					splice(j, 1);
					j--;
				}
			}
			
			/* Redraw the display */
			g.fillStyle = 'rgba(255,255,255,1)'
			g.fillRect(0, 0, MAX_X, MAX_Y);
			
			for (var j = 0; j < display.length; j++) {
				drawDisplayElement(display[j]);
			} 
		} else {
			console.log("Received unknown command: " + command_name);
		}
	} // End command processing loop.
	
	// Update the mouse pointer.
	setMousePointer();
});

 
document.onkeydown = function (e) {
	var key = e.keycode ? e.keycode : e.which;
	
	if (key == 16) { // Shift key
		shiftHeld = true;
	}
	
	if (activeTextInputField != null) {
		// Update the active text field and then redraw all display elements on top of it.
		var found = false;
		for (var i = 0; i < display.length; i++) {
			if (!found && display[i].type == 'button_text' && display[i].button_name == activeTextInputField.name) {
				found = true;
				if (65 <= key && key <= 90) { // A through Z keys.
					if (shiftHeld) 
						display[i].text += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(key-65);
					else 
						display[i].text += 'abcdefghijklmnopqrstuvwxyz'.charAt(key-65);
				} else if (48 <= key && key <= 57) { // 0 through 9 keys.
					if (shiftHeld)
						display[i].text += ')!@#$%^&*('.charAt(key-48);
					else
						display[i].text += '0123456789'.charAt(key-48);
				} else if (key == 8) { // Backspace key.
					e.preventDefault();
					display[i].text = display[i].text.substring(0, display[i].text.length - 1);
				} else if (key == 13) { // Enter key.
					socket.emit('text-field-enter', activeTextInputField.name, display[i].text);
				} else if (key == 32) { // Space bar.
					e.preventDefault();
					display[i].text += ' ';
				}
			}
		}
		
		if (found) {
			for (var i = 0; i < display.length; i++) {
				drawDisplayElement(display[i]);
			}
		}
	}
}

document.onkeyup = function (e) {
	var key = e.keycode ? e.keycode : e.which
	
	if (key == 16) { // Shift key
		shiftHeld = false;
	}
}

/* Called when the user clicks a position on the canvas. The server is sent an event for any buttons pressed. */
function click_position(event) {
	// Compatibility Code taken from http://www.quirksmode.org/js/events_properties.html
	var e = event || window.event;
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
	posx -= CANVAS_X;
	posy -= CANVAS_Y;
	// End compatibility code, posx & posy contain the clicked position
	
	var previousActiveField = activeTextInputField;
	var found = false;
	for (var i = 0; i < textInputFields.length; i++) {
		if (textInputFields[i].x1 <= posx && posx <= textInputFields[i].x2 && textInputFields[i].y1 <= posy && posy <= textInputFields[i].y2) {
			activeTextInputField = textInputFields[i];
			found = true;
		}
	}
	
	if (!found) activeTextInputField = null;
	
	if (previousActiveField != null && previousActiveField != activeTextInputField) {
		for (var i = 0; i < display.length; i++) {
			if (display[i].type == 'button_text' && display[i].button_name == previousActiveField.name) {
				// Necessary to redraw everything to get rid of the | character (the cursor), and add the new pipe character.
				for (var j = 0; j < display.length; j++) {
					drawDisplayElement(display[j]);
				}
				socket.emit('text-field-edit', previousActiveField.name, display[i].text);
			}
		}
	}
	else if (previousActiveField == null && activeTextInputField != null) {
		// Need to draw the new pipe character.
		for (var j = 0; j < display.length; j++) {
			drawDisplayElement(display[j]);
		}
	}
	
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].x1 <= posx && posx <= buttons[i].x2 && buttons[i].y1 <= posy && posy <= buttons[i].y2) {
			socket.emit('click', buttons[i].name);
		}
	}
}

function rollover_position(event) {
	// Compatibility Code taken from http://www.quirksmode.org/js/events_properties.html
	var e = event || window.event;
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
	posx -= CANVAS_X;
	posy -= CANVAS_Y;
	// End compatibility code, posx & posy contain the clicked position
	setMousePointer(posx, posy);
	
	document.getElementById("text").innerHTML = "X: " + posx + ", Y: " + posy;
	
	// Update last known mouse position.
	lastKnownMousePosition.x = posx;
	lastKnownMousePosition.y = posy;
}

function setVideoVolume (newVolume) {
	var video_elements = document.getElementsByTagName("video");
	
	for (var i = 0; i < video_elements.length; i++) {
		video_elements[i].volume = newVolume;
	}
}

function setMusicVolume (newVolume) { 
	var audio_elements = document.getElementsByTagName("audio");

	for (var i = 0; i < audio_elements.length; i++) {
		audio_elements[i].volume = newVolume;
	}
}

function setSpeechVolume (newVolume) {
	textToSpeechVolume = newVolume;
}
/* Sets the mouse to be either the regular pointer or the hand based on the current mouse position,
 * which is given by (posx, posy), or the last known mouse position if the mouse position is not specified. */
function setMousePointer (posx, posy) {
	if (typeof posx === 'undefined' && typeof posy === 'undefined') {
		posx = lastKnownMousePosition.x;
		posy = lastKnownMousePosition.y;
	}

	var found = false;
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].x1 <= posx && posx <= buttons[i].x2 && buttons[i].y1 <= posy && posy <= buttons[i].y2) {
			found = true;
		}
	}
	
	for (var i = 0; i < textInputFields.length; i++) {
		if (textInputFields[i].x1 <= posx && posx <= textInputFields[i].x2 && textInputFields[i].y1 <= posy && posy <= textInputFields[i].y2) {
			found = true;
		}
	}

	if (found)
		CANVAS_ELEMENT.style.cursor = "pointer";
	else
		CANVAS_ELEMENT.style.cursor = "auto";
}