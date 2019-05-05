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
	search: async function(args) {
		if (!args.search) {
			throw Error('Missing search parameter');
		}

		let query;
		if (args.field === 'title_normalized') {
			query = this.whereLike(args.field, `%${args.search}%`);
		}
		else if (args.field === 'date_release') {
			let search = args.search;
			if (!search.from || !search.to) {
				throw Error('from and to must be defined');
			}
			query = this.whereIn('info_id', q => q
				.select('id')
				.from('MediaInfo')
				.whereBetween('date_release',  [search.from, search.to])
			);
		}
		else {
			throw Error(`Invalid search field [${args.field}]`);
		}

		let results = await query.fetchAll({withRelated: ['info', 'series']});
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

