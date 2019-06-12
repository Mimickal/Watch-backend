const fs = require('fs')
const path = require('path');
const argParser = require('argparse').ArgumentParser;

function walkDir(dir, recursively, callback) {
	fs.readdirSync(dir).forEach( f => {
		let dirPath = path.join(dir, f);
		let stats = fs.statSync(dirPath);
		if (stats.isDirectory() && recursively) {
			walkDir(dirPath, true, callback);
		} else if (stats.isFile()) {
			callback(path.join(dir, f));
		}
	});
};

function endsWithFromArr(theString, suffixes) {
	for (i = 0; i < suffixes.length; i++) {
		if (theString.endsWith(suffixes[i])) return true;
	}
	return false;
}

const allowedExtensions = [
	".mp4"
];

// Currently just has an example extension.
// Essentially does the same as the prior array,
// but it helps to be more clear.
const ignoredExtensions = [
	".txt"
];

// Actual script execution starts here

var parser = new argParser({
  version: '0.0.0',
  addHelp: true,
  description: "Find files that don't have the .mp4 extension at the end of their name."
});
parser.addArgument([ "-r", "--recursive" ],
	{ help: "Scan directories recursively.",
	action: "storeConst", constant: true, defaultValue: false });
parser.addArgument([ "top_directory" ],
	{ help: "The directory to scan." });

const args = parser.parseArgs();

walkDir(args.top_directory, args.recursive, foundPath => {
	if (!endsWithFromArr(foundPath, allowedExtensions)
	&&  !endsWithFromArr(foundPath, ignoredExtensions)) {
		console.log(foundPath);
	}
})
