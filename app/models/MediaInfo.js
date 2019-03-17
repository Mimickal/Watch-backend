const bookshelf = require('../lib/bookshelf');

const NAME = 'MediaInfo';

module.exports = bookshelf.model(NAME, {
	tableName: NAME
});

