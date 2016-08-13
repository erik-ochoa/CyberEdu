/* GIF parser created out of libgif-js library. 
 * 
 * Note that this code is used on the client side, not the server side.
 */
 
 var inBackground = false; // Whether or not the GIF parser is running in the background or on the main thread.
  
/* An object representing an animated GIF. Has the following fields:
 *  - frames: an array of canvases (although they can be drawn using the drawImage method), that are the frames in order.
 *		(Note: when inBackground is true, frames is an array of ImageData objects instead, because the canvas is not available.)
 *  - delays: an array of positive integers, representing how long to display a given frame before switching to the next.
 *  - loops: an non-negative integer, indicating how many times the animation should loop. If the value is 0, it should loop forever.
 *  - width: The with of the animated GIF.
 *  - height: The height of the animated GIF.
 */
var GIF = function (frames, delays, loops, width, height) {
	this.frames = frames;
	this.delays = delays;
	this.loops = loops;
	this.width = width;
	this.height = height;
}

/* The Stream class is a data stream. 
 * The constructor takes one argument, data, which is an array of bytes to use as the stream.
 */
var Stream = function (data) {
	this.data = data;
	this.position = 0;
}

// Reads and returns one byte from the Stream
Stream.prototype.readByte = function () {
	if (this.position >= this.data.length) {
		console.log("Error: read past end of stream");
		throw new Error();
	}
	
	if (this.data instanceof Uint8Array)
		return this.data[this.position++];
	else
		return this.data.charCodeAt(this.position++) & 0xFF;
}

// Reads and returns n bytes from the stream, in an array.
Stream.prototype.readBytes = function (n) {
	var result = []
	for (var i = 0; i < n; i++)
		result[i] = this.readByte();
	return result;
}

// Reads and returns n bytes into a String
Stream.prototype.read = function (n) {
	var result = "";
	for (var i = 0; i < n; i++)
		result += String.fromCharCode(this.readByte());
	return result;
}

// Reads a 16-bit unsigned integer from the stream. (The stream uses Little-Endian).
Stream.prototype.readUnsigned = function () {
	return this.readByte() + (this.readByte() << 8);
}
// End of Stream class

/* This function performs decompression of the GIF.
 * It is copied directly from the libgif.js with the libgif library.
 * The data argument is a string.
 */
function lzwDecode (minCodeSize, data) {
	var pos = 0;
	var readCode = function (size) {
		var code = 0;
		for (var i = 0; i < size; i++) {
			if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
				code |= 1 << i;
			}
			pos++;
		}
		return code;
	};

	var output = [];

	var clearCode = 1 << minCodeSize;
	var eoiCode = clearCode + 1;

	var codeSize = minCodeSize + 1;

	var dict = [];

	var clear = function () {
		dict = [];
		codeSize = minCodeSize + 1;
		for (var i = 0; i < clearCode; i++) {
			dict[i] = [i];
		}
		dict[clearCode] = [];
		dict[eoiCode] = null;

	};

	var code;
	var last;

	while (true) {
		last = code;
		code = readCode(codeSize);

		if (code === clearCode) {
			clear();
			continue;
		}
		if (code === eoiCode) break;

		if (code < dict.length) {
			if (last !== clearCode) {
				dict.push(dict[last].concat(dict[code][0]));
			}
		}
		else {
			if (code !== dict.length) throw new Error('Invalid LZW code.');
			dict.push(dict[last].concat(dict[last][0]));
		}
		output.push.apply(output, dict[code]);

		if (dict.length === (1 << codeSize) && codeSize < 12) {
			// If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
			codeSize++;
		}
	}

	return output;
}

var ColorTable = function (stream, size) {
	this.red = [];
	this.green = [];
	this.blue = [];
	this.alpha = [];
	
	for (var i = 0; i < size; i++) {
		this.red.push(stream.readByte());
		this.green.push(stream.readByte());
		this.blue.push(stream.readByte());
		this.alpha.push(0xFF); // Opaque unless otherwise specified.
	}
}

var ImageDescriptor = function (stream) {
	this.left = stream.readUnsigned();
	this.top = stream.readUnsigned();
	this.width = stream.readUnsigned();
	this.height = stream.readUnsigned();
	
	var b = stream.readByte();
	this.local_color_table_flag = (b & 0x80) == 1 << 7;
	this.interlace_flag = (b & 0x40) == 1 << 6;
	this.local_color_table_size = Math.pow(2, (b & 0x07) + 1);
	
	if (this.interlace_flag) {
		console.log("Warning: just parsed a GIF with the interlace flag turned on. It's going to be garbled.");
	}
	
	if (this.local_color_table_flag) {
		this.local_color_table = ColorTable(stream, this.local_color_table_size);
	}
}

var GraphicsControlExtension = function (stream) {
	var length = stream.readByte();
	
	var b = stream.readByte();
	this.disposal_method = (b & 0x1C) >>> 2;
	this.user_input_flag = (b & 0x02) == 1 << 1; // Going to ignore this, since the game can't handle it.
	this.transparent_color_flag = (b & 0x01) == 1;
	
	this.delay_time = stream.readUnsigned(); // In 1/100ths of a second.
	this.transparent_color_index = stream.readByte();
	
	if (stream.readByte() != 0x00)
		console.log("Warning: parser error in GraphicsControlExtension: did not end with 0x00.");
}

var Netscape2Extension = function (stream) {
	var length = stream.readByte();
	if (length != 0x03)
		console.log("Warning: parser error in Netscape2Extension: length was not 3.");
	if (stream.readByte() != 0x01)
		console.log("Warning: parser error in Netscape2Extension: first byte was not 1.");
	
	this.n_loops = stream.readUnsigned(); // If this is 0, it means Infinite (loop forever).
	
	if (stream.readByte() != 0x00)
		console.log("Warning: parser error in Netscape2Extension: did not end with 0x00.");
}

function readSubBlocks (stream) {
	var subBlockSize = stream.readByte();
	var data = ""
	while (subBlockSize != 0) {
		data += stream.read(subBlockSize);
		subBlockSize = stream.readByte();
	}
	return data;
}

/* To understand this function, visit http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp
 * Return value is a GIF object.
 */
function parseGIF (stream) {
	var b;
	
	var frames = [];
	var delays = [];
	var loops;
	
	var transparent_color_index = -1;
	var disposal_of_previous_frame = 2; // Initialized to 2 so that the first frame's background is set to the background color.
	var disposal_of_current_frame;
	
	// First, read the header bytes.
	if (stream.read(6) != "GIF89a") {
		console.log("Warning: file is not a GIF version 89a. Parser is going to fail.");
	}	
	
	// Read Logical Screen Descriptor
	var width = stream.readUnsigned();
	var height = stream.readUnsigned();
	
	// Note: need the ">>>" instead of ">>" operator for an unsigned right shift!
	b = stream.readByte();
	var global_color_table_flag = (b & 0x80) == (1 << 7); // if true, a global color table follows
	var bits_per_primary_color = (b & 0x70 >>> 4) + 1;
	var sort_flag = (b & 0x08 >>> 3) == 1;
	var global_color_table_size = Math.pow(2, (b & 0x07) + 1);
	
	var background_color_index = stream.readByte(); // Specifies the index in the global color table should be used for any unspecified pixels.
	var pixel_aspect_ratio = stream.readByte();
	
	var global_color_table;
	if (global_color_table_flag) {
		global_color_table = new ColorTable (stream, global_color_table_size);
	}
	
	var indicator = stream.readByte();
	while (indicator != 0x3B) { // 0x3B is the end of file marker.
		if (indicator == 0x2C) {
			var imageDescriptor = new ImageDescriptor(stream);
			// Next step is to read a bunch of pixel information.
			var minimum_code_size = stream.readByte();
			var indicies = lzwDecode(minimum_code_size, readSubBlocks(stream));
			var x = 0; // index into the indicies array
			
			/* This code works slightly differently if it is running in the background,
			* since the canvas is not available, the ImageData object must be created
			* via its constructor.
			*/ 
			if (!inBackground) {
				// Actually create the frame.
				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				var g = canvas.getContext('2d');
			}
			
			// Use the local color table if one exists, otherwise use global. If neither exists, an error will occur.
			var color_table = imageDescriptor.local_color_table_flag ? imageDescriptor.local_color_table : global_color_table;
			// Add the transparent pixel.
			if (transparent_color_index >= 0) {
				color_table.alpha[transparent_color_index] = 0x00;
			}
			
			var imageData;
			if (disposal_of_previous_frame == 1) {
				// Disposal method 1 means to start from previous frame.
				if (!inBackground) {
					imageData = frames[frames.length - 1].getContext('2d').getImageData(0, 0, width, height);
				} else {
					// Note: frames[frames.length - 1].data must be deep copied to avoid aliasing issues.
					imageData = new ImageData (new Uint8ClampedArray(frames[frames.length - 1].data), width, height);
				}
			} else if (disposal_of_previous_frame == 2) {
				// Disposal method 2 means to start from the background color
				if (!inBackground) {
					imageData = g.createImageData(width, height);
				} else {
					imageData = new ImageData(width, height);
				}
				for (var i = 0; i < imageData.data.length; i += 4) {
					imageData.data[i+0] = global_color_table.red[background_color_index];
					imageData.data[i+1] = global_color_table.green[background_color_index];
					imageData.data[i+2] = global_color_table.blue[background_color_index];
					imageData.data[i+3] = global_color_table.alpha[background_color_index];
				}	
			} else {
				console.log("(GIF Parser) Disposal method not supported: " + disposal_of_previous_frame);
			}
			
			for (var i = imageDescriptor.top; i < imageDescriptor.top + imageDescriptor.height; i++) {
				for (var j = imageDescriptor.left; j < imageDescriptor.left + imageDescriptor.width; j++) {
					imageData.data[4*(i * width + j) + 0] = color_table.red[indicies[x]];
					imageData.data[4*(i * width + j) + 1] = color_table.green[indicies[x]];
					imageData.data[4*(i * width + j) + 2] = color_table.blue[indicies[x]];
					imageData.data[4*(i * width + j) + 3] = color_table.alpha[indicies[x]];
					x++;
				}
			}
			
			// Change the transparent pixel back.
			if (transparent_color_index >= 0) {
				color_table.alpha[transparent_color_index] = 0xFF;
			}
			
			disposal_of_previous_frame = disposal_of_current_frame;
			
			if (!inBackground) {
				g.putImageData(imageData, 0, 0);
				frames.push(canvas);
			} else {
				frames.push(imageData);
			}
			
		} else if (indicator == 0x21) {
			var extension_type = stream.readByte();
			if (extension_type == 0xF9) {
				var graphicsControl = new GraphicsControlExtension(stream);
				delays.push(graphicsControl.delay_time);
				if (graphicsControl.transparent_color_flag)
					transparent_color_index = graphicsControl.transparent_color_index;
				else 
					transparent_color_index = -1;
					
				disposal_of_current_frame = graphicsControl.disposal_method;
			} else if (extension_type == 0x01) {
				// This is a plain text extension. I am ignoring it, because we aren't using them.
				readSubBlocks(stream); 
			} else if (extension_type == 0xFF) {
				// Application Extension
				var extension_header_length = stream.readByte();
				var application_extension_name = stream.read(extension_header_length);
				if (application_extension_name == "NETSCAPE2.0") {
					var netscape2 = new Netscape2Extension(stream);
					loops = netscape2.n_loops;
				} else {
					// Some other application extension. I'm not dealing with it. 
					readSubBlocks(stream);
				}
			} else if (extension_type == 0xFE) {
				// Comment, ignore it.
				readSubBlocks(stream);
			}
		}
		indicator = stream.readByte();
	}
	
	return new GIF (frames, delays, loops, width, height);
}

/* This function takes a URL and uses an XHLHttpRequest to
 * get the raw data from the target GIF image, then parses
 * the object and returns the result.
 */
function load_gif_from_url (url) {
	var request = new XMLHttpRequest();
	request.open("GET", url, false); // False indicates this is a synchronous request. This means this method will block at request.send() until a response is received.
	
	// Some compatibility code, taking from libgif.js.
	if ('overrideMimeType' in request) {
		request.overrideMimeType('text/plain; charset=x-user-defined');
	} else if ('responseType' in request) {
		request.responseType = 'arraybuffer';
	} else { // Internet Explorer 9
		request.setRequestHeader('Accept-Charset', 'x-user-defined');
	}
	
	request.send();
		
	// Handling response.
	if (request.status != 200) 
		console.log("XMLHttpRequest error. Status code: " + this.statusText);
	
	// More compatibility code.
	if (!('response' in request)) { // For Internet Explorer 9
		request.response = new VBArray(request.responseText).toArray().map(String.fromCharCode).join('');
	}
	
	var data = request.response;
	if (data.toString().indexOf("ArrayBuffer") > 0) {
		data = new Uint8Array(data);
	}

	return parseGIF(new Stream(data));
}

// This code turns this file into a web worker 
onmessage = function (message) {
	inBackground = true;
	console.log("Web Worker began loading: " + message.data);
	postMessage(load_gif_from_url(message.data));
}