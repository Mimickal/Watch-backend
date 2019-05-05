const config = require('../../config');
const knex = require('knex')(config);

knex.raw('PRAGMA foreign_keys = ON;')
	.catch(console.error);

const Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('registry');
Bookshelf.plugin('pagination');
Bookshelf.plugin(require('bookshelf-eloquent'));

module.exports = Bookshelf;

