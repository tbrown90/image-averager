var program = require('commander'),
	express = require('express'),
	path = require('path'),
	pkg = require('./package.json');

program.version(pkg.version)
	.option('-d, --directory <directory>', 'The working directory (defaults to the current directory)')
	.option('-a, --alpha <alpha>', 'Calculate the average of the images alpha channel (defaults to true)')
	.parse(process.argv);

var directory = program.directory || '.';
var alpha = true;

if (program.alpha && program.alpha === 'false') {
	alpha = false;
}

var scanner = require('./scan');
var tree = scanner.scan(directory, '');

var imageCalculator = require('./image-calculator');
imageCalculator.calculate(tree, alpha);

