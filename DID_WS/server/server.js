var express    = require('express');
var bodyParser = require('body-parser');
var settings   = require('../settings/server.json');
var log        = require('../core/log.js')('server.js');
var router     = require('./routes/route.js');
var db		   = require('../core/database.js');
var jsonParser = bodyParser.json();
var server     = express();

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
		if (!settings || !settings.port || typeof settings.port != 'number') {
			log.error('Please set the server port');
			log.info('Server shutdown');
			return;
		}

		log.info('server run on 0.0.0.0:' + settings.port);
		server.listen(settings.port);
	}
}

function configure() {
	db.connect();

	server.use(jsonParser);
	server.use(errHandler);
	server.use(router);
}
 
function errHandler(err, req, res, next) {
	if (err) {
		log.error(err.name + ':' + err.message);

		var statusCode = err.status || 500;
		var resBody    = (statusCode == 500? { error_msg : "server error"} : { error_msg : "something bad in your request" });
		log.info('statudCode ' + statudCode);
		log.info(resBody);
		res.status(statudCode).json(resBody);
	}
} 

module.exports = run;