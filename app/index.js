#!/usr/local/bin/node
const polka = require('polka');

const FluentRes = require('./fluent_res');

const PORT = 3000;

const app = polka();
const media = require('./controllers/media')(app);

app.use((req, res, next) => {
	// Log requested routes
	// TODO there is definitely a library that can do this better
	console.log(`${req.method} ${req.path}`);
	console.log(`\t${req.search}`);

	// Wrap response object in fluent interface
	FluentRes(res);

	next();
});

app.listen(PORT, err => {
	if (err) throw err;
	console.log(`FunboxWatch2 backend listening on port ${PORT}`);
});

