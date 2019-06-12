const fs = require('fs')
const path = require('path');

function walkDir(dir, callback) {
	fs.readdirSync(dir).forEach( f => {
		let dirPath = path.join(dir, f);
		fs.statSync(dirPath).isDirectory() ?
			walkDir(dirPath, callback) : callback(path.join(dir, f));
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

const argv = process.argv.slice(2);

argv.forEach(directory => {
	walkDir(directory, foundPath => {
		if (!endsWithFromArr(foundPath, allowedExtensions)
		&&  !endsWithFromArr(foundPath, ignoredExtensions)) {
			console.log(foundPath);
		}
	})
})