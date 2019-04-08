const bookshelf = require('../lib/bookshelf');

const NAME = 'File';
const MD5_HASH_LENGTH = 32;
const MAX_PATH_LENGTH = 4096;

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	constructor: function() {
		bookshelf.Model.apply(this, arguments);

		this.on('saving', (model, attrs, options) => {
			if (model.get('verified') == null) {
				model.set('verified', false);
			}

			if (model.get('path').length > MAX_PATH_LENGTH) {
				throw new Error(`File path longer than ${MAX_PATH_LENGTH} chars`);
			}

			if (model.get('hash_md5').length != MD5_HASH_LENGTH) {
				throw new Error(`hash_md5 must have length ${MD5_HASH_LENGTH}`);
			}
		});

		this.on('fetched', (model, response, options) => {
			// SQLite3 returns booleans as 0/1, so convert to false/true
			response.verified = !!response.verified;
		});
	},
	media: function() {
		return this.belongsTo('Media', 'media_id', 'id');
	}
});

