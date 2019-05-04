const bookshelf = require('../lib/bookshelf');

const NAME = 'Media';


module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	constructor: function() {
		bookshelf.Model.apply(this, arguments);
		//TODO Model.defaults
		this.on('saving', (model, attrs, options) => {
			if (model.get('date_added') == null) {
				model.set('date_added', Date.now());
			}
		});

		// We only care about the first parameter, model.
		this.on('fetched', convertDates);
		this.on('fetched:collection', coll => coll.forEach(convertDates));
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
}, {
	search: async function(field, search) {
		let results = await this
			.query(qb => {
				if (field === 'title_normalized') {
					qb.where(field, 'LIKE', `%${search}%`);
				}
			})
			.fetchAll({withRelated: ['info', 'series']});

		return results.map(flatten);
	}
});

/**
 * Convert the UNIX timestamps from SQLite3 to Javascript Dates
 */
function convertDates(model) {
	let dateAdded = model.get('date_added');
	if (dateAdded) {
		model.set('date_added', new Date(dateAdded));
	}
}

/**
 * Flattens info and series fields onto the top-level of the model.
 * Returns the model as JSON (instead of bookshelf model, because bookshelf
 * has no good way to remove the fetched relation data from the model)
 */
function flatten(model) {
	let info = model.related('info');
	info.unset('id');
	info.keys().forEach(key => model.set(key, info.get(key)));

	model.set('date_end', model.related('series').get('date_end'));

	let json = model.toJSON();
	delete json.info;
	delete json.series;
	return json;
}
