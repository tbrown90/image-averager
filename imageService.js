var getPixels = require('get-pixels'),
	nPng = require('node-png').PNG,
	buffer = require('buffer'),
	fs = require('fs');

function Pixel(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}

Pixel.prototype.add = function addPixels(px2) {
	this.r += px2.r;
	this.g += px2.g;
	this.b += px2.b;
	this.a += px2.a;
	
	return this;
}

Pixel.prototype.divide = function addPixels(n) {
	this.r /= n;
	this.g /= n;
	this.b /= n;
	this.a /= n;
	
	return this;
}

var loadImage = function loadImage(file, cb) {		
	function gpCallback(err, data) {
		if (err) {
			console.log('Bad Image Path: ', file);
			cb(null);
			return;
		}
		
		var shape = data.shape;
		var width = shape[0],
			height = shape[1],
			channels = shape[2];
		
		if (channels < 3) {
			cb(null);	
			return;
		}
		
		var counter = 0;
		var pixels = [];
		for (var y = 0; y < height; ++y) {
			pixels.push([]);
			for (var x = 0; x < width; ++x) {
				var p = new Pixel();
				
				p.r = data.data[counter];
				counter++;
				p.g = data.data[counter];
				counter++;
				p.b = data.data[counter];
				counter++;
				p.a = 1;
				
				if (channels == 4) {
					p.a = data.data[counter];
					counter++;
				}
				
				pixels[y].push(p);
			}
		}
		
		cb(pixels);
	}
	
	getPixels(file, gpCallback);
};

var saveImage = function saveImage(imageData, fileName) {
	console.log('Saving image');
	function rgbaToBuffer(data) {
		var rgba_data = new Buffer(width * height * 4);
		
		for (var y = 0; y < height; ++y) {
			for (var x = 0; x < width; ++x) {
				var p = y * width * 4 + x * 4
				rgba_data[p + 0] = data[y][x].r;
				rgba_data[p + 1] = data[y][x].g;
				rgba_data[p + 2] = data[y][x].b;
				rgba_data[p + 3] = data[y][x].a;
			}
		}
		
		return rgba_data;
	}
	
	var width = imageData[0].length;
	var height = imageData.length;
	
	var image = new nPng({ width: width, height: height });
	image.data = rgbaToBuffer(imageData);
	
	image.pack().pipe(fs.createWriteStream(fileName));
}

var imageService = {
	load: loadImage,
	save: saveImage,
	pixel: Pixel
}

module.exports = imageService;
