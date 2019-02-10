const testdata = require('./data/test_data');

exports.seed = function(knex, Promise) {
	return Promise.all([
		knex('Media').truncate(),
		knex('MediaInfo').truncate()
	]).then(() => Promise.all([
		...testdata.mediaInfo.map(info => knex('MediaInfo').insert(info)),
		...testdata.media.map(media => knex('Media').insert(media))
	]));
};