var path = require('path'),
	fs = require('fs');

var scan = function scan(dir, alias) {
	return {
		name: alias,
		type: 'folder',
		path: alias,
		items: walk(dir, alias)
	};
};

function walk(dir, prefix) {
	prefix = prefix || '';
	
	if (!fs.existsSync(dir)) {
		return [];	
	}
	
	function readDirFilter(file) {
		return file && file[0] != '.';	
	}
	
	function readDirMap(file) {
		var p = path.join(dir, file),
			stat = fs.statSync(p);
		
		if (stat.isDirectory()) {
			return {
				name: file,
				type: 'folder',
				path: path.join(prefix, p),
				items: walk(p, prefix)
			};
		}
		
		return {
			name: file,
			type: 'file',
			path: path.join(prefix, p),
			size: stat.size
		};
	}
	
	return fs.readdirSync(dir)
		.filter(readDirFilter)
		.map(readDirMap);
};

function findFiles(tree, extensions) {
	var files = [];
	
	if (tree.type === 'folder') {
		for (var i = 0; i < tree.items.length; ++i) {
			files = files.concat(findFiles(tree.items[i], extensions));	
		}
	} else if (tree.type === 'file') {
		for (var i = 0; i < extensions.length; ++i) {
			if (tree.name.toLowerCase().indexOf(extensions[i].toLowerCase()) !== -1) {
				files.push(tree.path);
			}	
		}
	}
	
	return files;
}

var scanner = {
	scan: scan,
	findFiles: findFiles
};

module.exports = scanner;