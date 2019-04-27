const bookshelf = require('../lib/bookshelf');

const NAME = 'Media';

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	constructor: function() {
		bookshelf.Model.apply(this, arguments);

		this.on('saving', (model, attrs, options) => {
			if (model.get('date_added') == null) {
				model.set('date_added', Date.now());
			}
		});
	},
	info: function() {
		return this.hasOne('MediaInfo', 'id', 'info_id');
	},
	series: function() {
		return this.hasOne('Series', 'media_id', 'id');
	},
	files: function() {
		return this.hasMany('File', 'media_id', 'id');
	}
});

