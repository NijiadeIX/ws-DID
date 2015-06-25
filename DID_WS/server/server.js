var express = require('express');
var bodyParser = require('body-parser');

var settings = requrie('./settings.json');

var jsonParser = bodyParser.json();
var server = express();

function run(port) {
	if (port && typeof port == 'number') {
		server.listen(port);
	}
}