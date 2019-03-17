const bookshelf = require('../lib/bookshelf');

const NAME = 'Media';

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	info: function() {
		return this.hasOne('MediaInfo', 'id', 'info_id');
	},
	files: function() {
		return this.hasMany('File', 'media_id', 'id');
	}
});

