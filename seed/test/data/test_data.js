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
		.withReleaseDate(new Date('2009-01-01'))
		.withPlot('Short description of media 1', 'Blah blah blah')
	)
	.withFile(new File())
	.withFile(new File());

const media2 = new Media()
	.withTitle('Brüno', 'Bruno')
	.withType(1)
	.withRuntime(81)
	.withAddDate(new Date('2018-01-01'))
	.withInfo(new Info()
		.withImdb('tt0889583')
		.withScore(5.8, 5.4)
		.withReleaseDate(new Date('2009-07-10'))
		.withPlot(
			'Flamboyant and gay Austrian Brüno looks for new fame in America.',
			`Brüno is a gay Austrian fashion guru. He has his own fashion based
			 television show, Funkyzeit, the most popular German-language show
			 of its kind outside of Germany.`
		)
	);

const media3 = new Media()
	.withTitle('3:10 to Yuma', '3 10 to Yuma')
	.withType(1)
	.withRuntime(122)
	.withAddDate(new Date('2019-02-01'))
	.withInfo(new Info()
		.withImdb('tt0381849')
		.withScore(7.7, null)
		.withReleaseDate(new Date('2007-09-07'))
		.withPlot(`A small-time rancher agrees to hold a captured outlaw who's
			awaiting a train to go to court in Yuma. A battle of wills ensues as
			the outlaw tries to psych out the rancher.`
		)
	);

const media4 = new Media()
	.withTitle('300', '300')
	.withType(1)
	.withRuntime(117)
	.withAddDate(new Date('2018-03-01'))
	.withInfo(new Info()
		.withImdb('tt0416449')
		.withScore(7.7, null)
		.withReleaseDate(new Date('2007-03-09'))
		.withPlot(`King Leonidas of Sparta and a force of 300 men fight the
			Persians at Thermopylae in 480 B.C.`
		)
	);

const series1 = new Series()
	.withEndDate(Date.now())
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

const series2 = new Series()
	.withEndDate(new Date('2015-06-14'))
	.withMedia(new Media()
		.withTitle('China, IL', 'China IL')
		.withType(2)
		.withRuntime(22)
		.withAddDate(new Date('2018-04-01'))
		.withInfo(new Info()
			.withImdb('tt2058221')
			.withScore(6.6, null)
			.withReleaseDate(new Date('2008-10-02'))
			.withPlot(`Steve and Frank Smith are brothers who teach the history
				department in the worst university in America.`
			)
		)
	);

// FIXME These can be declared separately, but all fields need to be set within
// the fluent interface below, for some reason.
// I probably messed up the data generator. Sue me.
const s3e1 = new Episode();
const s3e2 = new Episode();
const s3e3 = new Episode();
const s3e4 = new Episode();
const s3e5 = new Episode();

const series3 = new Series()
	.withEndDate(new Date('2015-08-26'))
	.withMedia(new Media()
		.withTitle('Aqua Teen Hunger Force', 'Aqua Teen Hunger Force')
		.withType(2)
		.withRuntime(15)
		.withAddDate(new Date('2019-05-01'))
		.withInfo(new Info()
			.withImdb('tt0297494')
			.withReleaseDate(new Date('2000-12-30'))
			.withPlot(`The misadventures of a milkshake, an order of fries, a
				meatball, and their retired next door neighbor in the suburbs of
				New Jersey.`,
				`The Aqua Teen Hunger Force debuted on episode 92 "Baffler Meal"
				of the cartoon talk-show "Space Ghost Coast to Coast" According
				to TVtome.com, Master Shake is portrayed as being a chocolate
				milkshake in this episode, although he's a pistachio shake in
				the series`
			)
		)
	)
	.withEpisode(s3e1
		.withNumber(1, 1)
		.withMedia(new Media()
			.withTitle('Rabbot', 'Rabbot')
			.withType(3)
			.withRuntime(12)
			.withAddDate(new Date('2019-05-01'))
			.withInfo(new Info()
				.withImdb('tt0821172')
				.withScore(7.4, null)
				.withReleaseDate(new Date('2000-12-30'))
				.withPlot(`Dr. Weird invents a robot rabbit that escapes and
					destroys Carls car. So now it's up to Aqua Teen Hunger Force
					to find out who did it.`
				)
			)
		)
	)
	.withEpisode(s3e2
		.withNumber(1, 3)
		.withMedia(new Media()
			.withTitle('Bus of the Undead', 'Bus of the Undead')
			.withType(3)
			.withRuntime(12)
			.withAddDate(new Date('2019-06-01'))
			.withInfo(new Info()
				.withImdb('tt0514061')
				.withScore(8.3, null)
				.withReleaseDate(new Date('2001-09-30'))
				.withPlot(`Dr. Weird creates a mutant creature named
					MothMonsterMan. The creature escapes and flies to the Aqua
					Teens' house, attracted by the light.`
				)
			)
		)
	)
	.withEpisode(s3e3
		.withNumber(2, 1)
		.withMedia(new Media()
			.withTitle('Super Birthday Snake', 'Super Birthday Snake')
			.withType(3)
			.withRuntime(12)
			.withAddDate(new Date('2019-07-01'))
			.withInfo(new Info()
				.withImdb('tt0763336')
				.withScore(8.3, null)
				.withReleaseDate(new Date('2003-05-23'))
				.withPlot(`Meatwad is expecting the arrival of his new pet, a
					bunny. A snake arrives instead, and Master Shake is
					suspiciously unsurprised.`
				)
			)
		)
	)
	.withEpisode(s3e4
		.withNumber(2, 2)
		.withMedia(new Media()
			.withTitle('Super Hero', 'Super Hero')
			.withType(3)
			.withRuntime(12)
			.withAddDate(new Date('2019-06-01'))
			.withInfo(new Info()
				.withImdb('tt0763337')
				.withScore(8.1, null)
				.withReleaseDate(new Date('2003-06-01'))
				.withPlot(`Master Shake wants to become a super hero so he
					steels three drums of highly toxic chemical waste and starts
					to mutate.`
				)
			)
		)
	)
	.withEpisode(s3e5
		.withNumber(2, 3)
		.withMedia(new Media()
			.withTitle('Super Bowl', 'Super Bowl')
			.withType(3)
			.withRuntime(12)
			.withAddDate(new Date('2019-02-01'))
			.withInfo(new Info()
				.withImdb('tt0815765')
				.withScore(8.3, null)
				.withReleaseDate(new Date('2003-06-08'))
				.withPlot(`Meatwad wins two tickets two Super Bowl and both
					Shake and Carl wants to go with him so they do whatever
					Meatwad whats so he will choose them.`
				)
			)
		)
	);

// Break nested objects out for seed functions
module.exports = {
	mediaInfo1: mediaInfo1,
	media1: media1,
	media2: media2,
	media3: media3,
	media4: media4,
	series1: series1,
	series2: series2,
	series3: series3,
	s3e1: s3e1,
	s3e2: s3e2,
	s3e3: s3e3,
	s3e4: s3e4,
	s3e5: s3e5,

	mediaInfo: [
		mediaInfo1,
		media1.info,
		media2.info,
		media3.info,
		media4.info,
		series1.media.info,
		series2.media.info,
		series3.media.info,
		...series3.episodes.map(episode => episode.media.info)
	],
	media: [
		media1,
		media2,
		media3,
		media4,
		series1.media,
		series2.media,
		series3.media,
		...series1.episodes.map(episode => episode.media),
		...series3.episodes.map(episode => episode.media)
	],
	series: [
		series1,
		series2,
		series3
	],
	episode: [
		...series1.episodes,
		...series3.episodes
	],
	file: [
		...media1.files
	]
};

