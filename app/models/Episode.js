const bookshelf = require('../lib/bookshelf');

const NAME = 'Episode';

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	media: function() {
		return this.hasOne('Media', 'id', 'media_id');
	}
});

