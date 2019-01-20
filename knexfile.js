// Defines database "profiles" for various environments

const SQLITE3 = 'sqlite3';

module.exports = {

	development: {
		client: SQLITE3,
		connection: {
			filename: './dev.sqlite3'
		},
		useNullAsDefault: true,
		seeds: {
			directory: ''
		}
	},

	test: {
		client: SQLITE3,
		connection: {
			filename: ':memory:'
		},
		useNullAsDefault: true,
		seeds: {
			directory: ''
		}
	}

};

