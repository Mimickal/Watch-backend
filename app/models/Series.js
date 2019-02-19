const bookshelf = require('../lib/bookshelf');

const Media   = require('./Media');
const Episode = require('./Episode');

module.exports = bookshelf.Model.extend({
	tableName: 'Series',
	media: function() {
		return this.hasOne(Media, 'id', 'media_id');
	},
	episodes: function() {
		return this.hasMany(Episode, 'series_id', 'id');
	}
});

