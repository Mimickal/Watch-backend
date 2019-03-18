const expect = require('chai')
	.use(require('chai-as-promised'))
	.expect;

const knex = require('../../app/lib/bookshelf').knex;
const testdata = require('../../seed/test/data/test_data');

const MediaInfo = require('../../app/models/MediaInfo');
const Media = require('../../app/models/Media');
const Series = require('../../app/models/Series');
const Episode = require('../../app/models/Episode');
const File = require('../../app/models/File');

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
				.where({id: testdata.mediaInfo1.id})
				.fetch();
			// TODO validate date
			let gotInfo = gotModel.toJSON();
			expect(gotInfo).to.deep.equal(testdata.mediaInfo1);
		});
	});

	describe('Media', function() {
		// TODO add test validating date
		it('Fetching associated MediaInfo', async function() {
			let gotMedia = await Media
				.where({id: testdata.media1.id})
				.fetch({withRelated: 'info'});

			let gotInfo = gotMedia.toJSON().info;
			expect(gotInfo).to.deep.equal(testdata.media1.info);
		});

		it('Fetching associated Files', async function() {
			let gotModel = await Media
				.where({id: testdata.media1.id})
				.fetch({withRelated: 'files'});

			let gotMedia = gotModel.toJSON();
			expect(gotMedia.files).to.deep.equal(testdata.media1.files);
		});
	});

	describe('Series', function() {
		it('Fetching Series record', async function() {
			let gotModel = await Series
				.where({id: testdata.series1.id})
				.fetch();

			// TODO validate date
			let gotSeries = gotModel.toJSON();
			expect(gotSeries).to.deep.equal(testdata.series1.model());
		});

		it('Fetching associated Media', async function() {
			let gotModel = await Series
				.where({id: testdata.series1.id})
				.fetch({withRelated: 'media'});

			let gotSeries = gotModel.toJSON();
			expect(gotSeries.media).to.deep.equal(testdata.series1.media.model());
		});

		it('Fetch associated Episodes', async function() {
			let gotModel = await Series
				.where({id: testdata.series1.id})
				.fetch({withRelated: 'episodes'});

			let gotSeries = gotModel.toJSON();
			let episodes = testdata.series1.episodes.map(episode => episode.model());
			expect(gotSeries.episodes).to.deep.equal(episodes);
		});

		it.skip('Fetch associated Episodes for season');
	});

	describe('Episode', function() {
		it('Fetching associated Media', async function() {
			let episode = testdata.series1.episodes[0];

			let gotModel = await Episode
				.where({id: episode.id})
				.fetch({withRelated: 'media'});

			let gotEpisode = gotModel.toJSON();
			expect(gotEpisode.media).to.deep.equal(episode.media.model());
		});

		it('Fetching associated Series', async function() {
			let series = testdata.series1;

			let gotModel = await Episode
				.where({id: series.episodes[0].id})
				.fetch({withRelated: 'series'});

			let gotEpisode = gotModel.toJSON();
			expect(gotEpisode.series).to.deep.equal(series.model());
		});
	});

	describe('File', function() {
		it('Fetching associated Media', async function() {
			let gotModel = await File
				.where({id: testdata.media1.files[0].id})
				.fetch({withRelated: 'media'});

			let gotFile = gotModel.toJSON();
			expect(gotFile.media).to.deep.equal(testdata.media1.model());
		});

		it('MD5 hash length must be 32', async function() {
			let testFile = Object.assign({}, testdata.media1.files[0]);
			delete testFile.id;

			expect(File.forge(testFile).save()).to.be.fulfilled;

			testFile.hash_md5 += 'x';

			expect(File.forge(testFile).save())
				.to.be.rejectedWith(Error, 'hash_md5 must have length 32');
		});

		it('Path length limited to 4096', async function() {
			let testFile = Object.assign({}, testdata.media1.files[0]);
			delete testFile.id;
			testFile.path = 'x'.repeat(4096);

			expect(File.forge(testFile).save()).to.be.fulfilled;

			testFile.path += 'x';

			expect(File.forge(testFile).save())
				.to.be.rejectedWith(Error, 'File path longer than 4096 chars');
		});

		it('Verified defaults to false', async function() {
			let testFile = Object.assign({}, testdata.media1.files[0]);
			delete testFile.verified;

			let addedFile = await File.forge(testFile).save();

			expect(addedFile.attributes.verified).to.equal(false);
		});
	});
});

