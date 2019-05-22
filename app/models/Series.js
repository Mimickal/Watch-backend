const bookshelf = require('../lib/bookshelf');

const NAME = 'Series';

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	constructor: function() {
		bookshelf.Model.apply(this, arguments);
		this.on('fetched', convertDates);
		this.on('fetched:collection', coll => coll.forEach(convertDates));
	},
	media: function() {
		return this.hasOne('Media', 'id', 'media_id');
	},
	episodes: function() {
		return this.hasMany('Episode', 'series_id', 'id');
	}
});

function convertDates(model) {
	let dateEnd = model.get('date_end');
	if (dateEnd) {
		model.set('date_end', new Date(dateEnd));
	}
}

