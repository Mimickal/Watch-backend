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

