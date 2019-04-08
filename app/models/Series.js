const bookshelf = require('../lib/bookshelf');

const NAME = 'Series';

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	media: function() {
		return this.hasOne('Media', 'id', 'media_id');
	},
	episodes: function() {
		return this.hasMany('Episode', 'series_id', 'id');
	}
});

