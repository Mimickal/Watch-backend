const expect = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-subset'))
	.expect;

const knex = require('../../app/lib/bookshelf').knex;
const testdata = require('../../seed/test/data/test_data');
const util = require('../util');

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
		it('Fetching MediaInfo record', async function() {
			let gotModel = await MediaInfo
				.where({id: testdata.mediaInfo1.id})
				.fetch();

			let gotInfo = gotModel.toJSON();
			expect(gotInfo).to.deep.equal(testdata.mediaInfo1);
		});

		it('imdb_id must have length of 9', async function() {
			let expectedError = 'imdb_id must have length 9';
			let mediaInfo = Object.assign({}, testdata.mediaInfo1);
			delete mediaInfo.id;

			mediaInfo.imdb_id = 'x'.repeat(8);
			expect(MediaInfo.forge(mediaInfo).save())
				.to.be.rejectedWith(Error, expectedError);

			mediaInfo.imdb_id = 'x'.repeat(10);
			expect(MediaInfo.forge(mediaInfo).save())
				.to.be.rejectedWith(Error, expectedError);
		});

		function scoreTest(field) {
			return async function() {
				const model = function(value) {
					let obj = Object.assign({}, testdata.mediaInfo1);
					delete obj.id;
					obj.imdb_id = Math.random().toString(36).substring(2, 11);
					obj[field] = value;
					return obj;
				}

				const errMsg = function(value) {
					return `${field} must be a number between 0 and 10 `
						+ `(Got: ${value})`;
				}

				expect(MediaInfo.forge(model(-0.1)).save())
					.to.be.rejectedWith(Error, errMsg(-0.1));

				expect(MediaInfo.forge(model(10.1)).save())
					.to.be.rejectedWith(Error, errMsg(10.1));

				expect(MediaInfo.forge(model(0)).save()).to.be.fulfilled;

				expect(MediaInfo.forge(model(10)).save()).to.be.fulfilled;
			}
		}

		it('score_imdb must be between 0 and 10', scoreTest('score_imdb'));

		it('score_meta must be between 0 and 10', scoreTest('score_meta'));
	});

	describe('Media', function() {
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

		it('date_added defaults to now', async function() {
			let testMedia = Object.assign({}, testdata.media1.model());
			testMedia.date_added = null;

			let addedMedia = await Media.forge(testMedia).save();

			expect(addedMedia.attributes.date_added).to.be.closeTo(Date.now(), 60);
		});

		it('Fetching associated Series', async function() {
			let testSeries = testdata.series1;
			let gotMedia = await Media
				.where({id: testSeries.media.id})
				.fetch({withRelated: 'series'});

			let gotSeries = gotMedia.toJSON().series;
			expect(gotSeries).to.deep.equal(testSeries.model());
		});

		describe('search', function() {
			describe('by', function() {
				it('title', async function() {
					let results = await Media.search({
						field: 'title_normalized',
						search: '3'
					});
					expect(results).to.have.lengthOf(2);
					expect(results).to.containSubset([
						util.flattenMedia(testdata.media3),
						util.flattenMedia(testdata.media4)
					]);
				});

				// TODO this
				it.skip('director');

				// TODO implement this
				it.skip('actors');

				describe('year', function() {
					it('valid search', async function() {
						let results = await Media.search({
							field: 'date_release',
							search: {
								from: new Date('2009-01-01').getTime(),
								to: new Date('2009-12-31').getTime()
							}
						});
						expect(results).to.have.lengthOf(4);
						expect(results).to.containSubset([
							util.flattenMedia(testdata.media1),
							util.flattenMedia(testdata.media2),
							util.flattenSeries(testdata.series1),
							util.flattenEpisode(testdata.s3e6)
						]);
					});

					it('Missing to', function() {
						return expect(Media.search({
							field: 'date_release',
							search: { from: new Date() }
						})).to.be.rejectedWith(
							Error, 'from and to must be defined'
						);
					});

					it('Missing from', function() {
						return expect(Media.search({
							field: 'date_release',
							search: { to: new Date() }
						})).to.be.rejectedWith(
							Error, 'from and to must be defined'
						);
					});
				});

				// TODO and this
				it.skip('genre');

				it('plot', async function() {
					let results = await Media.search({
						field: 'plot',
						search: 'Aqua Teen'
					});
					expect(results).to.have.lengthOf(2);
					expect(results).to.containSubset([
						util.flattenMedia(testdata.series3.media),
						util.flattenMedia(testdata.s3e1.media)
					]);
				});
			});

			describe('type', function() {
				it('Single type', async function() {
					let results = await Media.search({
						field: 'plot',
						search: 'aqua',
						type: Media.Types().EPISODE
					});

					expect(results).to.have.length(2);
					expect(results).to.containSubset([
						util.flattenEpisode(testdata.s3e1),
						util.flattenEpisode(testdata.s3e2)
					]);
				});

				it('Multiple types', async function() {
					let results = await Media.search({
						field: 'title_normalized',
						search: 'Media',
						type: [Media.Types().MOVIE, Media.Types().SERIES]
					});

					expect(results).to.have.length(2);
					expect(results).to.containSubset([
						util.flattenMedia(testdata.media1),
						util.flattenSeries(testdata.series1)
					]);
				});

				it('Invalid type', function() {
					let invalid = 'invalid';
					return expect(Media.search({
						field: 'plot',
						search: 'thing',
						type: invalid
					})).to.be.rejectedWith(Error, `Invalid type [${invalid}]`);
				});
			});

			it('Invalid field', async function() {
				let badField = 'bad_field';
				return expect(Media.search({
					field: badField,
					search: 'ignore'
				})).to.be.rejectedWith(Error, `Invalid search field [${badField}]`);
			});

			it('Missing search', async function() {
				return expect(Media.search({
					field: 'title_normalized'
				})).to.be.rejectedWith(Error, 'Missing search parameter');
			});

			// FIXME order is wrong here. Order insensitive comparison?
			it.skip('Defined but empty search ok', async function() {
				let results = await Media.search({
					field: 'title_normalized',
					search: ''
				});

				expect(results).to.deep.equal(
					testdata.media.map(util.flattenMedia)
				);
			});
		});
	});

	describe('Series', function() {
		it('Fetching Series record', async function() {
			let gotModel = await Series
				.where({id: testdata.series1.id})
				.fetch();

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

		// TODO implement this test
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

