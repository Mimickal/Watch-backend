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
	model() {
		return {
			id: this.id,
			imdb_id: this.imdb_id,
			score_imdb: this.score_imdb,
			score_meta: this.score_meta,
			date_release: this.date_release,
			plot_short: this.plot_short,
			plot_full: this.plot_full
		};
	}
}

exports.Media = class {
	constructor(id) {
		this.id = id || util.nextId('media');
		this.type = 0;
		this.title = 'Test title ' + this.id;
		this.title_normalized = 'Test title ' + this.id;
		this.date_added = '';
		this.runtime = null;
		this.info_id = null;
		this.files = [];
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
	withFile(file) {
		file.media_id = this.id;
		this.files.push(file);
		return this;
	}
	model() {
		return {
			id: this.id,
			info_id: this.info_id,
			type: this.type,
			title: this.title,
			title_normalized: this.title_normalized,
			date_added: this.date_added,
			runtime: this.runtime
		};
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
		if (!this.episodes) {
			this.episodes = [];
		}
		this.episodes.push(episode);
		return this;
	}
	model() {
		return {
			id: this.id,
			media_id: this.media_id,
			date_end: this.date_end
		};
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
	model() {
		return {
			id: this.id,
			media_id: this.media_id,
			series_id: this.series_id,
			episode: this.episode,
			season: this.season
		};
	}
}

exports.File = class {
	constructor(id) {
		this.id = id || util.nextId('file');
		this.file_id = util.randInt(50000);
		this.path = util.randString();
		this.size_bytes = util.randInt(99999999);
		this.hash_md5 = util.randHash();
		this.verified = false;
	}
	withPath(path) {
		this.path = path;
		return this;
	}
	withHash(hash) {
		this.hash_md5 = hash;
		return this;
	}
	withSize(size) {
		this.size_bytes = size;
		return this;
	}
	withVerified(val) {
		this.verified = val;
		return this;
	}
	model() {
		return {
			id: this.id,
			media_id: this.media_id,
			file_id: this.file_id,
			path: this.path,
			size_bytes: this.size_bytes,
			hash_md5: this.hash_md5,
			verified: this.verified
		};
	}
}

