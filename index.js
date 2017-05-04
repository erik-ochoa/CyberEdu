var SERVER_HOSTNAME = 'http://localhost:8011';
var CANVAS_ELEMENT = document.getElementById('view');
var g = CANVAS_ELEMENT.getContext('2d');
var MAX_X = 1280;
var MAX_Y = 630;
var CANVAS_X = CANVAS_ELEMENT.getBoundingClientRect().left;
var CANVAS_Y = CANVAS_ELEMENT.getBoundingClientRect().top;

var SETTINGS_PAGE = document.getElementById('settings');
var SETTINGS_BUTTON = document.getElementById('open_settings_button');

// Draw CyberEdu logo while the game is loading
g.drawImage(document.getElementById("logo"), 45, 138);

/* Map of HTML id -> GIF object.
 * Contains all GIFs that will be used by the game.
 */
var animatedGIFs = {};

var background_loading_supported = background_loading_supported();

/* Web Workers allow multi-threading to occur in the browser. Here I use them to load 
 * the animated GIFs in the background.
 * If they are not supported, we'll have to just load the GIFs in the main thread.
 */
if (!background_loading_supported) {
	console.log("Background GIF Parsing unsupported. Loading animations on the main thread. Expect a long load time.");
	animatedGIFs["animation/dorm_room/transition"] = load_gif_from_url(SERVER_HOSTNAME + "/images/transition_to_cyberworld.gif");
} else {
	var loadTransitionToCyberworld = new Worker('gifParser.js');
	
	loadTransitionToCyberworld.onmessage = function (message) {
		animatedGIFs["animation/dorm_room/transition"] = message.data;
		console.log("Received animated GIF object for /images/transition_to_cyberworld.gif");
	};
	
	loadTransitionToCyberworld.postMessage(SERVER_HOSTNAME + "/images/transition_to_cyberworld.gif");
}

/* Helper function to test whether or not it is possible to load
 * animated GIFs in a background thread.
 */
 function background_loading_supported() {
	var background_loading_supported = true;
	if (typeof Worker === 'undefined')
		background_loading_supported = false;
	try {
		new ImageData(1, 1);
	} catch (e) {
		background_loading_supported = false;
	}
	return background_loading_supported;
 }
 
// true if the game is currently waiting on an animation to load.
var game_paused_for_loading = false;

var socket = io(SERVER_HOSTNAME);

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
		if (element.scale == 1) {

			g.drawImage(element.image, element.x, element.y);
		} else {
			g.save();
			g.scale(element.scale, element.scale);
			g.drawImage(element.image, element.x / element.scale, element.y / element.scale);
			g.restore();
		}
	} else if (element.type == 'text' || element.type == 'button_text') {
		g.font = element.font;
		g.fillStyle = element.font_color;
		// The active text field has a cursor
		if (activeTextInputField != null && element.type == 'button_text' && activeTextInputField.name == element.button_name) {
			drawText(element.text + '|', element.x, element.y, element.x2, element.y2);
		} else if (element.type == 'button_text' && (typeof element.help_text !== 'undefined' && element.help_text != null) && element.text == '' && (activeTextInputField == null || activeTextInputField.name != element.button_name)) {
			// Draws help text on an empty text field that has help text and is not selected.
			drawText(element.help_text, element.x, element.y, element.x2, element.y2);
		} else {
			drawText(element.text, element.x, element.y, element.x2, element.y2);		
		}
	} else if (element.type == 'rectangle') {
		g.fillStyle = element.font_color;
		g.fillRect(element.x, element.y, element.x2 - element.x, element.y2 - element.y);
	} else if (element.type == 'animation') {
		// Draw the current frame
		if (background_loading_supported) {
			// Creating a temporary canvas off-screen seems to avoid white flashes between frames.
			var tempCanvas = document.createElement('canvas');
			tempCanvas.width = animatedGIFs[element.id].width;
			tempCanvas.height = animatedGIFs[element.id].height;
			tempCanvas.getContext('2d').putImageData(animatedGIFs[element.id].frames[element.frame_no], 0, 0);
			g.drawImage(tempCanvas, element.x, element.y);
		} else {
			g.drawImage(animatedGIFs[element.id].frames[element.frame_no], element.x, element.y);
		}
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

/* Helper function to redraw the entire display. 
 */
 function redrawAll () {
	//g.fillStyle = 'rgba(255,255,255,1)'
	//g.fillRect(0, 0, MAX_X, MAX_Y);
	g.clearRect(0, 0, MAX_X, MAX_Y);
	
	for (var j = 0; j < display.length; j++)
		drawDisplayElement(display[j]);
 }
 
 /* Helper function to redraw all display elements at or above a certain layer.
  * Relies on the fact that the display array is sorted by layer.
  */  
function redrawAtOrAboveLayer (layer) {
	var j = 0;
	
	while (j < display.length && display[j].layer < layer)
		j++;
	
	while (j < display.length) {
		drawDisplayElement(display[j])
		j++;
	}
}

// Helper function that creates an animation display object, and starts the animation timer.
function createAnimationElement (id, x1, y1, layer, request_end_notification) {
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
	while (j < display.length && display[j].layer <= layer) {
		j++;
	}
	
	display.splice(j, 0, animation);
	
	// Draw the 1st frame of the animation, along anything above it.
	// This is permissible because a GIF image can never be partially transparent.
	redrawAtOrAboveLayer(animation.layer);
	
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
		
		// Draw the next frame along with anything above it.
		redrawAtOrAboveLayer(animation.layer);
		
		// Setup the next timer.
		animation.timer_id = setTimeout(advanceAnimation, animatedGIFs[animation.id].delays[animation.frame_no] * 10);
	}
	
	// Start animation.
	animation.timer_id = setTimeout(advanceAnimation, animatedGIFs[animation.id].delays[animation.frame_no] * 10); /* The *10 converts from 1/100ths of a second to milliseconds. */
}
 
/* The buttons that are currently active. Buttons are objects with the following fields:
	name: A unique name for this button (provided by the server, must be unique among buttons and text input fields)
	x1: Left edge
	y1: Top edge
	x2: Right edge
	y2: Bottom edge
	layer: The layer the button is in.
	hasText: boolean, true if this button has an associated text element.
*/
var buttons = [];

/* A list of text input fields that are currently active. Text input fields are objects with the following fields:
	name: A unique name for this text input field (provided by the server, must be unique among text input fields and buttons)
	x1: left edge
	y1: top edge
	x2: right edge
	y2: bottom edge
	layer: The layer the text input field is in
	The text in these fields is maintained in their associated button_text display objects.
*/
var textInputFields = [];

// The currently active text input field, or null if no field is active.
var activeTextInputField = null;

// True if the user is currently holding down the shift key.
var shiftHeld = false;

// A structure (containing the elements x and y) which is the last known position of the mouse.
var lastKnownMousePosition = {x:0.0, y:0.0}

/* Groups of commands arrive as an array, to be executed in sequence. 
 * An individual command is an array: the first element is the name, following elements (if any) are the arguments. 
   The following commands are valid:
	drawImage: (id, x1, y1, layer) - draws an image at the position (x1, y1) in the specified layer
	drawImage: (id, x1, y1, layer, scale) - draws an image at the position (x1, y1) in the specified layer, and with the specified scale.
	drawRectangle: (name, x1, y1, x2, y2, layer, fillStyle) - draws a solid Rectangle.
	drawText: (name, x1, y1, x2, y2, layer, text, font, font_color) - draws text
	clearImage: () - clears all the images, rectangles, and text (except text associated with buttons) from the display
	clearImage: (id, x1, y1, layer) - clears a specific image from the display.
	clearRectangle: (name) - clears a rectangle.
	clearText: (name) - clears text.
	addButton: (name, x1, y1, x2, y2, layer) - adds an invisible rectangular button
	addButton: (name, x1, y1, x2, y2, layer, text, font, font_color) - adds a button with the specified text.
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
	console.log("array.length = " + array.length);
	for (var i = 0; i < array.length; i++) {
		console.log("array[" + i + "] = " + array[i]);
		var command_name = array[i][0];
		if (command_name == 'drawImage') {
			var id = array[i][1];
			var x1 = array[i][2];
			var y1 = array[i][3];
			var layer = array[i][4];
			var scale = (array[i].length > 5 ? array[i][5] : 1);
			
			var image = document.getElementById(id);

			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			display.splice(j, 0, {type:'image', id: id, x:x1, y:y1, layer:layer, scale:scale, image:image});
			redrawAll();
			
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
				
				redrawAll();
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
				
				redrawAll();
			}
			
		} else if (command_name == 'addButton') {
			if (array[i].length == 7) {
			// Invisible button (with no text)
				var name = array[i][1];
				var x1 = array[i][2];
				var y1 = array[i][3];
				var x2 = array[i][4];
				var y2 = array[i][5];
				var layer = array[i][6];		
				if (typeof layer === 'undefined') {
					console.log('Warning: Button ' + name + ' has no layer!');
				}
				
				buttons[buttons.length] = {name:name, x1:x1, y1:y1, x2:x2, y2:y2, layer:layer, hasText:false};
			} else if (array[i].length == 10) {
			// Button with text
				var name = array[i][1];
				var x1 = array[i][2];
				var y1 = array[i][3];
				var x2 = array[i][4];
				var y2 = array[i][5];
				var layer = array[i][6];
				var text = array[i][7];
				var font = array[i][8];
				var font_color = array[i][9];
				if (typeof layer === 'undefined') {
					console.log('Warning: Button ' + name + ' has no layer!');
				}

				buttons[buttons.length] = {name:name, x1:x1, y1:y1, x2:x2, y2:y2, layer:layer, hasText:true};
				var j = 0;
				while (j < display.length && display[j].layer <= layer) {
					j++;
				}
				display.splice(j, 0, {type:'button_text', x:x1, y:y1, x2:x2, y2:y2, layer:layer, text:text, font:font, font_color:font_color, button_name:name});
				
				redrawAll();
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
						
						redrawAll();
					}
					buttons.splice(j, 1);
					j--;
				}				
			}	
		} else if (command_name == 'playSound') {
			var id = array[i][1];
			var sound_element = document.getElementById(id);
			
			if (sound_element.readyState == 4) {
				sound_element.play();
			} else {
				sound_element.oncanplaythrough = sound_element.play;
			}
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
			
			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			display.splice(j, 0, {type:'rectangle', name:name, x:x1, y:y1, x2:x2, y2:y2, layer:layer, font_color:style});
			
			redrawAll();
		} else if (command_name == 'clearRectangle') {
			var name = array[i][1];
			
			for (var j = 0; j < display.length; j++) {
				if (display[j].name == name && display[j].type == 'rectangle') {
					display.splice(j, 1);
					j--;
				}
			}
			
			redrawAll();
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
			
			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			display.splice(j, 0, {type:'text', name:name, x:x1, y:y1, x2:x2, y2:y2, layer:layer, text:text, font:font, font_color:font_color});
		
			redrawAll();
		} else if (command_name == 'clearText') {
			var name = array[i][1];
			
			for (var j = 0; j < display.length; j++) {
				if (display[j].name == name && display[j].type == 'text') {
					display.splice(j, 1);
					j--;
				}
			}
			
			/* Redraw the display */
			redrawAll();
		} else if (command_name == 'playVideo') {
			var id = array[i][1];
			
			var video_element = document.getElementById(id);
			CANVAS_ELEMENT.width = 0;
			CANVAS_ELEMENT.height = 0;
		
			var audio_elements = document.getElementsByTagName("audio");
			for (var j = 0; j < audio_elements.length; j++) {
				audio_elements[j].volume = 0.0;
			}
		
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
				
				var audio_elements = document.getElementsByTagName("audio");
				for (var j = 0; j < audio_elements.length; j++) {
					audio_elements[j].volume = music_volume / 100.0
				}
			}
			
			video_element.width = 960;
			video_element.height = 540;
			video_element.onended = returnToGame;
			video_element.onabort = function () { returnToGame(); alert('Video download was aborted for an unknown reason.'); }
			video_element.onerror = function (error_event) { returnToGame(); alert('An error occurred playing the video: ' + JSON.stringify(error_event)); }
						
			if (video_element.readyState == 4) {
				video_element.play();
			} else {
				video_element.oncanplaythrough = video_element.play;
			}
			
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
			var layer = array[i][6];
			var text = array[i][7];
			var font = array[i][8];
			var font_color = array[i][9];
			var help_text = array[i][10];

			// Add to the text input fields list.
			textInputFields.push({name:name, x1:x1, y1:y1, x2:x2, y2:y2, layer:layer});
		
			var j = 0;
			while (j < display.length && display[j].layer <= layer) {
				j++;
			}
			display.splice(j, 0, {type:'button_text', x:x1, y:y1, x2:x2, y2:y2, layer:layer, text:text, help_text:help_text, font:font, font_color:font_color, button_name:name});
			
			redrawAll();
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
			redrawAll();
		} else if (command_name == 'drawAnimation') {
			var id = array[i][1];
			var x1 = array[i][2];
			var y1 = array[i][3];
			var layer = array[i][4];
			var request_end_notification = array[i][5];
			
			if (!(background_loading_supported && typeof animatedGIFs[id] === 'undefined')) {
				createAnimationElement(id, x1, y1, layer, request_end_notification);
			} else {
				game_paused_for_loading = true;
			
				var j = 0;
				while (j < display.length && display[j].layer <= layer) {
					j++;
				}
				
				var loading_text_element = {type:'text', name:"loadingAnimation" + id, x:x1, y:y1, x2:MAX_X, y2:MAX_Y, layer:layer, text:"Game paused. Loading animation. Please wait.", font:'24px Arial', font_color:'rgba(128, 128, 128, 255)'};
				
				display.splice(j, 0, loading_text_element);
				redrawAtOrAboveLayer(layer);
				
				function tryAgain () {
					if (typeof animatedGIFs[id] === 'undefined') {
						loading_text_element.timer_id = setTimeout(tryAgain, 100);
					} else {
						// Must delete the "loadingAnimation" text element
						for (var j = 0; j < display.length; j++) {
							if (display[j].type == 'text' && display[j].name == "loadingAnimation" + id) {
								display.splice(j, 1);
								j--;
							}
						}
						game_paused_for_loading = false;
						createAnimationElement(id, x1, y1, layer, request_end_notification);
					}
				}
				
				loading_text_element.timer_id = setTimeout(tryAgain, 100);
			}
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
					display.splice(j, 1);
					j--;
				} else if (display[j].type == 'text' && display[j].name == "loadingAnimation" + id) {
					if (typeof display[j].timer_id !== 'undefined')
						clearTimeout(display[j].timer_id);
				
					game_paused_for_loading = false;
				
					display.splice(j, 1);
					j--;
				}
			}
			
			redrawAll();
		} else if (command_name == 'changeWebpage') {
			var address = array[i][1];
			
			window.location.href = address;
		} else {
			console.log("Received unknown command: " + command_name);
		}
	} // End command processing loop.
	
	// Update the mouse pointer.
	setMousePointer();
});

socket.on('server-error', function (error_message) {
	alert(error_message);
});
 
document.onkeydown = function (e) {
	var key = e.keycode ? e.keycode : e.which;
	
	if (key == 16) { // Shift key
		shiftHeld = true;
	}
	
	if (game_paused_for_loading) return;
	
	if (key == 27) { // Escape key
		displaySettingsPage();
	}
		
	if (activeTextInputField != null) {
		// Update the active text field and then redraw all the display elements.
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
				} else if (96 <= key && key <= 107) { // Numpad keys
					display[i].text += '0123456789*+'.charAt(key-96);
				} else if (109 <= key && key <= 111) { // More numpad keys
					display[i].text += '-./'.charAt(key-109);
				} else if (186 <= key && key <= 192) { // Various special character keys
					if (shiftHeld)
						display[i].text += ':+<_>?~'.charAt(key-186);
					else
						display[i].text += ';=,-./`'.charAt(key-186);
				} else if (219 <= key && key <= 222) { // More special character keys
					if (shiftHeld)
						display[i].text += '{|}"'.charAt(key-219);
					else	
						display[i].text += "[\\]'".charAt(key-219);
				}
			}
		}
		
		if (found) {
			redrawAll();
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
/*	var e = event || window.event;
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
	posy -= CANVAS_Y; */
	// End compatibility code, posx & posy contain the clicked position
	
	// This code seems to work. Tested in Firefox and IE10
	var e = event || window.event;
	var posx = e.offsetX;
	var posy = e.offsetY;
	
	if (game_paused_for_loading) return;
	
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
				redrawAll();
				socket.emit('text-field-edit', previousActiveField.name, display[i].text);
			}
		}
	}
	else if (previousActiveField == null && activeTextInputField != null) {
		// Need to draw the new pipe character.
		redrawAll();
	}
	
	// Click the button that is in the highest layer.
	var highest_layer = -999;
	var button_to_click = [];

	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].x1 <= posx && posx <= buttons[i].x2 && buttons[i].y1 <= posy && posy <= buttons[i].y2) {
			if (buttons[i].layer == highest_layer) {
				button_to_click << buttons[i].name;
			} else if (buttons[i].layer > highest_layer) {
				highest_layer = buttons[i].layer;
				button_to_click = [buttons[i].name];
			}
		}
	}
	for (var i = 0; i < button_to_click.length; i++) {
		socket.emit('click', button_to_click[i]);
	}
	
	if (button_to_click.length > 1) 
		console.log ("Warning: Overlapping buttons in the same layer: " + JSON.stringify(button_to_click));
}

function rollover_position(event) {
	// Compatibility Code taken from http://www.quirksmode.org/js/events_properties.html
	/*var e = typeof event === 'undefined' ? window.event : event;
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
	posy -= CANVAS_Y; */
	// End compatibility code, posx & posy contain the clicked position
	
	var e = event || window.event;
	var posx = e.offsetX;
	var posy = e.offsetY;
	
	setMousePointer(posx, posy);
	
	document.getElementById("text").innerHTML = "X: " + posx + ", Y: " + posy;
	
	// Update last known mouse position.
	lastKnownMousePosition.x = posx;
	lastKnownMousePosition.y = posy;
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

	if (found && !game_paused_for_loading)
		CANVAS_ELEMENT.style.cursor = "pointer";
	else
		CANVAS_ELEMENT.style.cursor = "auto";
}

function displaySettingsPage () {
	// Avoid swapping if a video is currently playing!
	if (CANVAS_ELEMENT.width != 0) {
		
		CANVAS_ELEMENT.width = 0;
		CANVAS_ELEMENT.height = 0;
		SETTINGS_PAGE.style.display = 'block';
		SETTINGS_BUTTON.style.display = 'none';
		
		// Ensure that the values displayed are correct.
		music_volume_input_field.value = music_volume;
		speech_volume_input_field.value = speech_volume;
	}
}

function exitSettingsPage () {
	SETTINGS_PAGE.style.display = 'none';
	CANVAS_ELEMENT.width = MAX_X;
	CANVAS_ELEMENT.height = MAX_Y;
	CANVAS_X = CANVAS_ELEMENT.getBoundingClientRect().left;
	CANVAS_Y = CANVAS_ELEMENT.getBoundingClientRect().top;
	SETTINGS_BUTTON.style.display = 'block';
	for (var j = 0; j < display.length; j++) {
		drawDisplayElement(display[j]);
	}
}

function setVideoVolume (newVolume) {
	var video_elements = document.getElementsByTagName("video");
	
	for (var i = 0; i < video_elements.length; i++) {
		video_elements[i].volume = newVolume;
	}
}

var music_volume_input_field = document.getElementById("settings/music_volume");
var music_volume = 100;
function setMusicVolume () { 
	var newVolume = parseFloat(music_volume_input_field.value);
	
	if (0 <= newVolume && newVolume <= 100) {
		music_volume = newVolume;
		console.log("changing music volume to " + music_volume);
		var audio_elements = document.getElementsByTagName("audio");

		for (var i = 0; i < audio_elements.length; i++) {
			audio_elements[i].volume = music_volume / 100.0;
		}
	} 
}

function hardReset () {
	display = [];
	buttons = [];
	textInputFields = [];
	socket.emit('hard-reset');
}