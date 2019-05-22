module.exports = function(app) {

const Media = require('../models/Media');

const VALID_SEARCH_BY = ['title', 'director', 'actors', 'year', 'genre', 'plot'];
const VALID_TYPES = ['all', 'movies', 'series'];
const VALID_SORTS = ['title', 'year', 'genre', 'IMDb rating', 'metascore', 'date added'];
const VALID_ORDERS = ['ascending', 'descending'];

// Mapping of 'search by' field to Media model field
const BY_QUERY_MAP = {
	title: 'title_normalized',
	year: 'date_release'
};

/**
 * Returns the valid fields to sort and filter search results by.
 */
app.get('/media/meta', (req, res) => {
	res.status(200).json({
		bys: VALID_SEARCH_BY,
		types: VALID_TYPES,
		sorts: VALID_SORTS,
		orders: VALID_ORDERS
	});
});

/**
 * Returns a paginated list of media items matching the given query.
 *
 * Parameters:
 *   by      Field to match the given query on.
 *   type    Type of media to return.
 *   sort    Field to sort results on.
 *   order   Direction of sort (ascending or descending).
 *   page    Page to fetch.
 *   items   Number of items to fetch per page.
 *   format  TODO better info here
 */
app.get('/media/search/:search', async (req, res) => {
	let by = req.query.by;
	let type = req.query.type || 'all';

	if (!VALID_SEARCH_BY.includes(by)) {
		return res.status(400).text(`Invalid 'by' field [${by}]`);
	}

	if (!VALID_TYPES.includes(type)) {
		return res.status(400).text(`Invalid 'type' field [${type}]`);
	}

	let search = decodeURI(req.params.search);

	if (by === 'year') {
		let year = Number.parseInt(search);
		if (!Number.isInteger(year)) {
			return res.status(400).text(`Invalid year [${search}]`);
		}

		search = {
			from: new Date(`${year}-01-01`),
			to: new Date(`${year}-12-31`)
		};
	}

	if (type === 'all') {
		type = null;
	}

	let media = await Media.search({
		search: search,
		field: BY_QUERY_MAP[by] || by, // Convert 'by' to Media field to query on
		type: type
	});

	res.status(200).json(media);
});

};

