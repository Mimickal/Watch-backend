const crypto = require('crypto');

let ids = {};

module.exports.nextId = function(name) {
	if (!ids[name]) {
		ids[name] = 0;
	}
	return ++ids[name];
};

module.exports.randRating = function() {
	return parseFloat((Math.random() * 10).toFixed(1));
}

module.exports.randInt = function(min, max) {
	if (min == null && max == null) {
		min = 0;
		max = Number.MAX_SAFE_INTEGER;
	}
	else if (min != null && max == null) {
		max = min; // Treat as (0, max)
		min = 0;
	}
	return Math.floor(min + Math.floor(Math.random() * (max - min)));
}

module.exports.randString = function(length) {
	if (!length) {
		length = 50;
	}
	return crypto.randomBytes(length).toString();
}

module.exports.randHash = function(data) {
	return crypto
		.createHash('md5')
		.update(data || Math.random().toString())
		.digest('hex');
}

