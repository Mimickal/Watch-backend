module.exports.flattenMedia = function(media) {
	let flat = Object.assign({}, media);
	delete flat.info.id;

	Object.assign(flat, flat.info);
	delete flat.info;
	delete flat.files;
	return flat;
};

module.exports.convertDates = function(body) {
	return Array.isArray(body) ?
		body.map(convertDatesHelper) :
		convertDatesHelper(body);
};

function convertDatesHelper(model) {
	if (model.date_added) {
		model.date_added = new Date(model.date_added);
	}
	if (model.date_release) {
		model.date_release = new Date(model.date_release);
	}
	if (model.date_end) {
		model.date_end = new Date(model.date_end);
	}
	return model;
}

