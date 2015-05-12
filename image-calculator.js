var imageService = require('./imageService'),
	scanner = require('./scan');

function calculate(tree, alpha) {
	console.log ('Calculating average');
	
	calculateAverage(tree, alpha);	
}

function calculateAverage(tree, alpha) {

	function calculate() {
//		var image = [];
//		
//		for (var y = 0; y < maxHeight; ++y) {
//			image.push([]);
//			for (var x = 0; x < maxWidth; ++x) {
//				image[y].push(new imageService.pixel(0, 0, 0, 0));
//			}	
//		}
//		
//		for (var i = 0; i < images.length; ++i) {
//			var img = images[i];
//			for (var y = 0; y < img.length; ++y) {
//				for (var x = 0; x < img[y].length; ++x) {
//					image[y][x].add(img[y][x]);
//					
//					if (image[y][x].n === undefined) {
//						image[y][x].n = 0;	
//					} else {
//						image[y][x].n++;	
//					}
//				}
//			}
//		}
		
		for (var y = 0; y < maxHeight; ++y) {
			for (var x = 0; x < maxWidth; ++x) {
				image[y][x].divide(image[y][x].n);
				if (!alpha) {
					image[y][x].a = 1;	
				}
			}
		}
		
		imageService.save(image, 'generated.png');
	}
	
	function addImage(img) {
		if (img.length > image.length) {
			image.length = img.length;	
		}
		
		for (var y = 0; y < img.length; ++y) {
			if (image[y] === undefined) {
				image[y] = [];	
			}
			
			if (image[y].length < img[y].length) {
				image[y].length = img[y].length;	
			}
			
			for (var x = 0; x < img[y].length; ++x) {
				if (image[y][x] === undefined) {
					image[y][x] = new imageService.pixel(0, 0, 0, 0);	
				}
				
				try {
					image[y][x].add(img[y][x]);
				} catch (e) {
					console.log(img[y][x]);	
				}
				
				if (image[y][x].n === undefined) {
					image[y][x].n = 0;
				} else {
					image[y][x].n++;	
				}
			}
		}
	}
	
	var files = scanner.findFiles(tree, ['.png', '.jpg']);
	var image = [];
	
	var maxWidth = 0;
	var maxHeight = 0;
	
	var counter = 0;
	
	var images = [];
	for (var i = 0; i < files.length; ++i) {
		console.log('Loading Image: ', files[i]);
		imageService.load(files[i].replace(/\\/g, '/'), function(p) {
			if (p !== null) {
				addImage(p);
//				images.push(p);
//
//				var w = p[0].length;
//				var h = p.length;
//
//				maxWidth = w > maxWidth ? w : maxWidth;
//				maxHeight = h > maxHeight ? h : maxHeight;
			}
			
			counter++;
			
			if (counter === files.length) {
				calculate();
			}
		});
	}
}

var ImageCalculator = {
	calculate: calculate
};

module.exports = ImageCalculator;