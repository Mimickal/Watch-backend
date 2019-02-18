const util = require('./DataUtils');

exports.Info = class {
	constructor(id) {
		this.id = id || util.nextId('info');
		this.date_release = '';
	}
	withImdb(imdbId) {
		this.imdb_id = imdbId || 'imdbid' + String(this.id).padStart(3, '0');
		return this;
	}
	withScore(imdbScore, metaScore) {
		this.score_imdb = imdbScore || util.randRating();
		this.score_meta = metaScore || util.randRating();
		return this;
	}
	withPlot(shortPlot, longPlot) {
		this.plot_short = shortPlot;
		this.plot_full = longPlot;
		return this;
	}
	// If null, knex will auto-fill with "now"
	withReleaseDate(date) {
		this.date_release = date || null;
		return this;
	}
}

exports.Media = class {
	constructor(id) {
		this.id = id || util.nextId('media');
		this.date_added = '';
		this.runtime = null;
	}
	withTitle(title, normalized) {
		this.title = title;
		this.title_normalized = normalized || title;
		return this;
	}
	withType(type) {
		this.type = type;
		return this;
	}
	withRuntime(runtime) {
		this.runtime = runtime;
		return this;
	}
	withAddDate(date) {
		this.date_added = date || null;
		return this;
	}
	withInfo(info) {
		this.info_id = info.id;
		this.info = info;
		return this;
	}
}

exports.Series = class {
	constructor(id) {
		this.id = id || util.nextId('series');
		this.date_end = '';
	}
	withEndDate(date) {
		this.date_end = date || null;
		return this;
	}
	withMedia(media) {
		this.media_id = media.id;
		this.media = media;
		return this;
	}
	withEpisode(episode) {
		episode.series_id = this.id;
		if (!this.series) {
			this.series = [];
		}
		this.series.push(episode);
		return this;
	}
}

exports.Episode = class {
	constructor(id) {
		this.id = id || util.nextId('episode');
	}
	withMedia(media) {
		this.media_id = media.id;
		this.media = media;
		return this;
	}
	withNumber(episode, season) {
		this.episode = episode;
		this.season = season;
		return this;
	}
}

