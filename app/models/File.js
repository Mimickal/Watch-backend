const bookshelf = require('../lib/bookshelf');

const NAME = 'File';

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	constructor: function() {
		bookshelf.Model.apply(this, arguments);

		this.on('fetched', (model, response, options) => {
			// SQLite3 returns booleans as 0/1, so convert to false/true
			response.verified = !!response.verified;
		});
	},
	media: function() {
		return this.belongsTo('Media', 'media_id', 'id');
	}
});

