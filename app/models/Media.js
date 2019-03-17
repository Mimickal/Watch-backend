const bookshelf = require('../lib/bookshelf');

const MediaInfo = require('./MediaInfo');
const File = require('./File');

module.exports = bookshelf.Model.extend({
	tableName: 'Media',
	info: function() {
		return this.hasOne(MediaInfo, 'id', 'info_id');
	},
	files: function() {
		return this.hasMany(File, 'media_id', 'id');
	}
});

