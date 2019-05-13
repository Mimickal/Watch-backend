const chai = require('chai')
	.use(require('chai-http'));
const expect = chai.expect;

const knex = require('../../app/lib/bookshelf').knex;
const testdata = require('../../seed/test/data/test_data');
const util = require('../util');

const app = require('../../app').handler;

describe('media controller', function() {

	before('Setup SQLite memory database', function() {
		return knex.migrate.latest();
	});

	beforeEach('Populate SQLite memory DB with fresh test data', function() {
		return knex.seed.run();
	});

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

	describe('GET /media/search/:query', function() {

		describe('Search by', function() {

			it('invalid field', async function() {
				let bad = 'badfield';
				let res = await chai.request(app)
					.get(`/media/search/thing?by=${bad}`);

				expect(res.status).to.equal(400);
				expect(res.text).to.equal(`Invalid 'by' field [${bad}]`);
			});

			it('title', async function() {
				let res = await chai.request(app)
					.get('/media/search/3?by=title');

				expect(res.status).to.equal(200);
				expect(util.convertDates(res.body)).to.deep.equal([
					util.flattenMedia(testdata.media3),
					util.flattenMedia(testdata.media4)
				]);
			});

			it('year', async function() {
				let res = await chai.request(app)
					.get('/media/search/2000?by=year');

				expect(res.status).to.equal(200);
				expect(util.convertDates(res.body)).to.deep.equal([
					util.flattenSeries(testdata.series3),
					util.flattenMedia(testdata.series3.episodes[0].media)
				]);
			});

			it('plot', async function() {
				let res = await chai.request(app)
					.get('/media/search/aqua teen?by=plot');

				expect(res.status).to.equal(200);
				expect(util.convertDates(res.body)).to.deep.equal([
					util.flattenSeries(testdata.series3),
					util.flattenMedia(testdata.series3.episodes[0].media)
				]);
			});
		});

	});

});

