const bookshelf = require('../lib/bookshelf');

const NAME = 'Media';

// TODO use enum here. This is kind of insane.
const VALID_TYPES = {
	MOVIE: 'movie',
	SERIES: 'series',
	EPISODE: 'episode'
};
const TYPE_ID_MAP = {
	movie: 1,
	series: 2,
	episode: 3
	// TODO shorts? Bumps?
};

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
	// Capital E here because there's also a field called "episode"
	Episode: function() {
		return this.hasOne('Episode', 'media_id', 'id');
	},
	files: function() {
		return this.hasMany('File', 'media_id', 'id');
	}
}, {
	Types: function() {
		return VALID_TYPES;
	},
	search: async function(args) {
		if (!args.search) {
			throw Error('Missing search parameter');
		}

		let query = this.select('*');

		if (args.type) {
			if (!Array.isArray(args.type)) {
				args.type = [args.type];
			}

			// FIXME lodash can almost certainly do this better
			args.type = args.type.map(type => {
				if (TYPE_ID_MAP[type] == null) {
					throw new Error(`Invalid type [${args.type}]`);
				}
				return TYPE_ID_MAP[type];
			});

			query.whereIn('type', args.type);
		}

		if (args.field === 'title_normalized') {
			query.whereLike(args.field, `%${args.search}%`);
		}
		else if (args.field === 'date_release') {
			let search = args.search;
			if (!search.from || !search.to) {
				throw Error('from and to must be defined');
			}
			query.whereIn('info_id', q => q
				.select('id')
				.from('MediaInfo')
				.whereBetween('date_release',  [search.from, search.to])
			);
		}
		/* TODO support searching by multiple fields? it's weird that 'plot'
		 * searches by two fields (and isn't a field itself)*/
		else if (args.field === 'plot') {
			let like = `%${args.search}%`;
			query.whereIn('info_id', q => q
				.select('id')
				.from('MediaInfo')
				.where('plot_short','LIKE', like) // Sadly can't use whereLike here
				.orWhere('plot_full', 'LIKE', like)
			);
		}
		else {
			throw Error(`Invalid search field [${args.field}]`);
		}

		let results = await query.fetchAll({withRelated: [
			'info', 'series', 'Episode'
		]});
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
 * Flattens info, series, and/or episode fields onto the top-level of the model.
 * Returns the model as JSON (instead of bookshelf model, because bookshelf
 * has no good way to remove the fetched relation data from the model)
 */
function flatten(model) {
	let info = model.related('info');
	info.unset('id');
	info.keys().forEach(key => model.set(key, info.get(key)));

	model.set('date_end', model.related('series').get('date_end'));

	model.set('season', model.related('Episode').get('season'));
	model.set('episode', model.related('Episode').get('episode'));

	let json = model.toJSON();
	delete json.info;
	delete json.series;
	delete json.Episode;
	delete json.info_id;
	return json;
}

