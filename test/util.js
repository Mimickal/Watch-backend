function flattenMedia(media) {
	let flat = Object.assign({}, media);

	if (flat.info) {
		let info = Object.assign({}, flat.info);
		delete info.id;
		Object.assign(flat, info);
	}
	delete flat.info_id;
	delete flat.info;
	delete flat.files;

	return flat;
};

function flattenSeries(series) {
	let flat = Object.assign({}, series);
	let media = flattenMedia(flat.media);

	// We want Media's id, NOT Series' id
	Object.assign(flat, media);
	delete flat.media;
	delete flat.episodes;
	delete flat.media_id;
	return flat;
}

function flattenEpisode(episode) {
	let flat = Object.assign({}, episode);

	// Take Media's id, not Episode id
	if (flat.media) {
		let media = flattenMedia(flat.media);
		Object.assign(flat, media);
		delete flat.media;
	}
	delete flat.media_id;
	delete flat.series_id;
	return flat;
}

function convertDates(body) {
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

module.exports = {
	flattenMedia: flattenMedia,
	flattenSeries: flattenSeries,
	flattenEpisode: flattenEpisode,
	convertDates: convertDates
};

