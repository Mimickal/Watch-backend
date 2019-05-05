const bookshelf = require('../lib/bookshelf');

const NAME = 'MediaInfo';
const IMDB_ID_LENGTH = 9;
const SCORE_MIN = 0;
const SCORE_MAX = 10;
const INVALID_SCORE_MESSAGE =
	`must be a number between ${SCORE_MIN} and ${SCORE_MAX}`;

module.exports = bookshelf.model(NAME, {
	tableName: NAME,
	constructor: function() {
		bookshelf.Model.apply(this, arguments);

		this.on('saving', (model, attrs, options) => {
			if (model.get('imdb_id').length != IMDB_ID_LENGTH) {
				throw new Error(`imdb_id must have length ${IMDB_ID_LENGTH}`);
			}

			let score_imdb = model.get('score_imdb');
			if (score_imdb != null &&
				(score_imdb < SCORE_MIN || SCORE_MAX < score_imdb)
			) {
				throw invalidScoreError('score_imdb', score_imdb);
			}

			let score_meta = model.get('score_meta');
			if (score_imdb != null &&
				(score_meta < SCORE_MIN || SCORE_MAX < score_meta)
			) {
				throw invalidScoreError('score_meta', score_meta);
			}

			// TODO maybe validate plot_short and plot_full?
		});

		this.on('fetched', convertDates);
		this.on('fetched::collection', coll => coll.forEach(convertDates));
	}
});

function invalidScoreError(name, value) {
	return new Error(`${name} ${INVALID_SCORE_MESSAGE} (Got: ${value})`);
}

function convertDates(model) {
	let dateRelease = model.get('date_release');
	if (dateRelease) {
		model.set('date_release', new Date(dateRelease));
	}
}

