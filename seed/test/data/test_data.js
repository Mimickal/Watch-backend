const gen = require('../util/DataGen');
const Info = gen.Info;
const Media = gen.Media;
const Series = gen.Series;
const Episode = gen.Episode;
const File = gen.File;


const mediaInfo1 = new Info()
	.withImdb('testimdb1')
	.withScore(5.5, 8.8)
	.withReleaseDate('')
	.withPlot('Basic plot', 'Longer plot and stuff');

const media1 = new Media()
	.withTitle('Test Media 1')
	.withType(1)
	.withRuntime(20)
	.withInfo(new Info()
		.withImdb()
		.withScore(5.7, 1.2)
		.withPlot('Short description of media 1', 'Blah blah blah')
	)
	.withFile(new File())
	.withFile(new File());

const series1 = new Series()
	.withEndDate('')
	.withMedia(new Media()
		.withTitle('Media for Series 1')
		.withType(2)
		.withInfo(new Info()
			.withPlot('Info about series 1')
		)
	)
	.withEpisode(new Episode()
		.withNumber(1, 1)
		.withMedia(new Media())
	)
	.withEpisode(new Episode()
		.withNumber(2, 1)
		.withMedia(new Media())
	)
	.withEpisode(new Episode()
		.withNumber(1, 2)
		.withMedia(new Media())
	);

// Break nested objects out for seed functions
module.exports = {
	mediaInfo1: mediaInfo1,
	media1: media1,
	series1: series1,

	mediaInfo: [
		mediaInfo1,
		media1.info,
		series1.media.info
	],
	media: [
		media1,
		series1.media,
		...series1.episodes.map(episode => episode.media)
	],
	series: [
		series1
	],
	episode: [
		...series1.episodes
	],
	file: [
		...media1.files
	]
};

