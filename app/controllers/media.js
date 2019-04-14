module.exports = function(app) {


const VALID_SEARCH_BY = ['title', 'director', 'actors', 'year', 'genre', 'plot'];
const VALID_TYPES = ['all', 'movies', 'series'];
const VALID_SORTS = ['title', 'year', 'genre', 'IMDb rating', 'metascore', 'date added'];
const VALID_ORDERS = ['ascending', 'descending'];

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

};

