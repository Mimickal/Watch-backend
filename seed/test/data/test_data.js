const mediaInfo1 = {
	id: 1,
	imdb_id: 'imdbid001',
	score_imdb: 5.7,
	score_meta: 1.2,
	date_release: '',
	plot_short: 'Short description of media 1',
	plot_full: 'Blah blah blah'
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


module.exports = {
	mediaInfo: [
		mediaInfo1
	],
	media: [
		media1
	]
}

