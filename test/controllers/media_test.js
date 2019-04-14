const chai = require('chai')
	.use(require('chai-http'));
const expect = chai.expect;

const app = require('../../app').handler;

describe('media controller', function() {

	it('GET /media/meta', async function() {
		let res = await chai.request(app)
			.get('/media/meta');

		expect(res.status).to.equal(200);
		expect(res.header['content-type']).to.equal('application/json');
		expect(res.type).to.equal('application/json');
		// TODO maybe just import the constants from media?
		expect(res.body).to.deep.equal({
			bys: ['title', 'director', 'actors', 'year', 'genre', 'plot'],
			types: ['all', 'movies', 'series'],
			sorts: ['title', 'year', 'genre', 'IMDb rating', 'metascore', 'date added'],
			orders: ['ascending', 'descending']
		});
	});

});

