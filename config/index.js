const knexfile = require('../knexfile');

if (process.env.NODE_ENV === 'test') {
	module.exports = knexfile.test;
} else {
	process.env.NODE_ENV = 'development';
	module.exports = knexfile.development;
}

