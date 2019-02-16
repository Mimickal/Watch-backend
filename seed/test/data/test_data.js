const mediaInfo1 = {
	id: 1,
	imdb_id: 'imdbid001',
	score_imdb: 5.7,
	score_meta: 1.2,
	date_release: '',
	plot_short: 'Short description of media 1',
	plot_full: 'Blah blah blah'
};

const mediaInfo2 = {
	id: 2,
	imdb_id: null,
	score_imdb: null,
	score_meta: null,
	date_release: null,
	plot_short: 'Info about series 1',
	plot_full: null
};

const media1 = {
	id: 1,
	info_id: mediaInfo1.id,
	type: 1,
	title: 'Test Media 1',
	title_normalized: 'Test Media 1',
	runtime: 20,
	date_added: ''
};

const media2 = {
	id: 2,
	info_id: mediaInfo2.id,
	type: 2,
	title: 'Media for Series 1',
	title_normalized: 'Media for Series 1',
	runtime: null,
	date_added: ''
};

const series1 = {
	id: 1,
	media_id: media2.id,
	date_end: ''
};


module.exports = {
	mediaInfo: [
		mediaInfo1,
		mediaInfo2
	],
	media: [
		media1,
		media2
	],
	series: [
		series1
	]
}

