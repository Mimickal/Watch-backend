const bookshelf = require('../lib/bookshelf');

const Media = require('./Media');

module.exports = bookshelf.Model.extend({
	tableName: 'Series',
	media: function() {
		return this.hasOne(Media, 'id', 'media_id');
	}
});

