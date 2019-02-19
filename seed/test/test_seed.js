const testdata = require('./data/test_data');

exports.seed = function(knex, Promise) {
	return Promise.all([
		knex('Episode').truncate(),
		knex('Series').truncate(),
		knex('Media').truncate(),
		knex('MediaInfo').truncate()
	]).then(() => Promise.all([
		...testdata.mediaInfo.map(info => knex('MediaInfo').insert(info.model())),
		...testdata.media.map(media => knex('Media').insert(media.model())),
		...testdata.series.map(series => knex('Series').insert(series.model())),
		...testdata.episode.map(episode => knex('Episode').insert(episode.model()))
	]));
};

