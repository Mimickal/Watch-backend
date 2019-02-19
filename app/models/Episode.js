const bookshelf = require('../lib/bookshelf');

const Media  = require('./Media');
const Series = require('./Series');

module.exports = bookshelf.Model.extend({
	tableName: 'Episode',
	media: function() {
		return this.hasOne(Media, 'id', 'media_id');
	}
});

