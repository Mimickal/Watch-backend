
exports.up = function(knex, Promise) {
	return knex.schema
		.createTable('MediaInfo', table => {
			table.increments('id').primary();
			table.string('imdb_id', 9).unique();
			table.decimal('score_imdb', 2, 1).unsigned();
			table.decimal('score_meta', 2, 1).unsigned();
			table.date('date_release');
			table.string('plot_short', 200);
			table.string('plot_full', 1000).nullable();
		})
		.createTable('Media', table => {
			table.increments('id').primary();
			table.integer('info_id').references('id').inTable('MediaInfo').nullable();
			table.integer('type').notNullable();
			table.string('title').notNullable();
			table.string('title_normalized').notNullable();
			table.date('date_added').defaultTo(knex.fn.now()).notNullable();
			table.integer('runtime').notNullable();
		})
		.createTable('Series', table => {
			table.increments('id').primary();
			table.integer('media_id').references('id').inTable('Media').notNullable();
			table.date('date_end').nullable();
		})
		.createTable('Episode', table => {
			table.increments('id').primary();
			table.integer('media_id').references('id').inTable('Media').notNullable();
			table.integer('series_id').references('id').inTable('Series').notNullable();
			table.integer('season').nullable();
			table.integer('episode').nullable();
		})
		.createTable('File', table => {
			table.increments('id').primary();
			table.integer('media_id').references('id').inTable('Media').notNullable();
			table.integer('file_id').notNullable();
			table.string('path', 4096).notNullable();
			table.bigInteger('size_bytes').notNullable();
			table.string('hash_md5', 32).notNullable();
			table.boolean('verified').defaultTo(false).notNullable();
		})
		.createTable('Issue', table => {
			table.increments('id').primary();
			table.integer('file_id').references('id').inTable('File').notNullable();
			table.integer('type').notNullable();
			table.string('description', 250).nullable();
		})
		.createTable('Tag', table => {
			table.increments('id').primary();
			table.string('name', 25);
		})
		.createTable('Director', table => {
			table.increments('id').primary();
			table.string('name', 50);
		})
		.createTable('Actor', table => {
			table.increments('id').primary();
			table.string('name', 50);
		})
		.createTable('Genre', table => {
			table.increments('id').primary();
			table.string('name', 25);
		})
		.createTable('MediaTagPivot', table => {
			table.integer('media_id').references('id').inTable('Media').notNullable();
			table.integer('tag_id').references('id').inTable('Tag').notNullable();
			table.primary(['media_id', 'tag_id']);
			table.unique(['media_id', 'tag_id']);
		})
		.createTable('MediaDirectorPivot', table => {
			table.integer('media_id').references('id').inTable('Media').notNullable();
			table.integer('director_id').references('id').inTable('Director').notNullable();
			table.primary(['media_id', 'director_id']);
			table.unique(['media_id', 'director_id']);
		})
		.createTable('MediaActorPivot', table => {
			table.integer('media_id').references('id').inTable('Media').notNullable();
			table.integer('actor_id').references('id').inTable('Actor').notNullable();
			table.primary(['media_id', 'actor_id']);
			table.unique(['media_id', 'actor_id']);
		})
		.createTable('MediaGenrePivot', table => {
			table.integer('media_id').references('id').inTable('Media').notNullable();
			table.integer('genre_id').references('id').inTable('Genre').notNullable();
			table.primary(['media_id', 'genre_id']);
			table.unique(['media_id', 'genre_id']);
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('MediaInfo')
		.dropTable('Media')
		.dropTable('Series')
		.dropTable('Episode')
		.dropTable('File')
		.dropTable('Issue')
		.dropTable('Tag')
		.dropTable('Director')
		.dropTable('Actor')
		.dropTable('Genre')
		.dropTable('MediaTagPivot')
		.dropTable('MediaDirectorPivot')
		.dropTable('MediaActorPivot')
		.dropTable('MediaGenrePivot');
};

