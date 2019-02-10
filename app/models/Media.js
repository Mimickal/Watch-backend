const bookshelf = require('../lib/bookshelf');

const MediaInfo = require('./MediaInfo');

module.exports = bookshelf.Model.extend({
	tableName: 'Media',
	info: function() {
		return this.hasOne(MediaInfo, 'id', 'info_id');
	}
});

