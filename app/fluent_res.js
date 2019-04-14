/**
 * A simple wrapper around Polka's response object to provide several helper
 * functions and a fluent interface for responses.
 *
 * see: https://nodejs.org/dist/latest-v9.x/docs/api/http.html#http_class_http_serverresponse
 */
module.exports = function(res) {
	res.status = status.bind(res);
	res.json = json.bind(res);
};

function status(code) {
	this.statusCode = code;
	return this;
}

function json(data) {
	this.setHeader('Content-Type', 'application/json');
	this.end(JSON.stringify(data));
}


