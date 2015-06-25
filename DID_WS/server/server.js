var express = require('express');
var bodyParser = require('body-parser');

var settings = require('./settings.json');
var log = require('../log/log.js')('server');
var router = require('./routes/routes.js');

var jsonParser = bodyParser.json();
var server = express();

/**
 * used to start the server, optional parameter is port
 * @param  {number} port server will run on the port
 */
function run(port) {
	configure();

	if (port && typeof port == 'number') {
		log.info('server run on 0.0.0.0:' +  port);
		server.listen(port);
	} else {
		log.info('server run on 0.0.0.0:' + settings.port);
		server.listen(settings.port);
	}
}

function configure() {
	server.use(jsonParser);
	server.use(errHandler);

	server.use(router);
}
 
function errHandler(err, req, res, next) {
	if (err) {
		switch(err.name) {
			default : 
				log.error(err.name + ':' + err.message);
				res.status(err.status || 500).json({ "error_msg" : "server error"});
		}
	}
} 

module.exports = run;