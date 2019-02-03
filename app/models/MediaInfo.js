const bookshelf = require('../lib/bookshelf');

module.exports = bookshelf.Model.extend({
	tableName: 'MediaInfo'
});

