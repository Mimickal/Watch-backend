const gen = require('../util/DataGen');
const Info = gen.Info;
const Media = gen.Media;
const Series = gen.Series;

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
	);

const series1 = new Series()
	.withEndDate('')
	.withMedia(new Media()
		.withTitle('Media for Series 1')
		.withType(2)
		.withInfo(new Info()
			.withPlot('Info about series 1')
		)
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
		series1.media
	],
	series: [
		series1
	]
};

