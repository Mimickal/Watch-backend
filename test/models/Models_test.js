const expect = require('chai').expect;

const knex = require('../../app/lib/bookshelf').knex;
const testdata = require('../../seed/test/data/test_data');

const MediaInfo = require('../../app/models/MediaInfo');
const Media = require('../../app/models/Media');
const Series = require('../../app/models/Series');

describe('Models', function() {

	before('Setup SQLite memory database', function() {
		return knex.migrate.latest();
	});

	beforeEach('Populate SQLite memory DB with fresh test data', function() {
		return knex.seed.run();
	});

	describe('MediaInfo', function() {
		it('Fetching MedaiInfo record', async function() {
			let gotModel = await MediaInfo
				.where({id: testdata.mediaInfo[0].id})
				.fetch();
			// TODO validate date
			let gotInfo = gotModel.toJSON();
			expect(gotInfo).to.deep.equal(testdata.mediaInfo[0]);
		});
	});

	describe('Media', function() {
		// TODO add test validating date
		it('Fetching associated MediaInfo', async function() {
			let gotMedia = await Media
				.where({id: testdata.media[0].id})
				.fetch({withRelated: 'info'});

			let gotInfo = gotMedia.toJSON().info;
			expect(gotInfo).to.deep.equal(testdata.mediaInfo[0]);
		});
	});

	describe('Series', function() {
		it('Fetching Series record', async function() {
			let gotModel = await Series
				.where({id: testdata.series[0].id})
				.fetch();

			let gotSeries = gotModel.toJSON();
			expect(gotSeries).to.deep.equal(testdata.series[0]);
		});
	});

});

