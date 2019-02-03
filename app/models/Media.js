const bookshelf = require('../lib/bookshelf');

module.exports = bookshelf.Model.extend({
	tableName: 'Media',
	info: () => this.hasOne('MediaInfo', 'info_id')
});

