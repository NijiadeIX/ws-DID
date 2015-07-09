var accessQuery = require('./hotel.js');
var path        = require('path');
var hotel       = require('./hotel.js');
var settings 	= require('./settings.json');

function load(handlers) {
	handlers.register(settings.id, 'POST', '/access/get', hotel.postAccess);
	handlers.register(settings.id, 'POST', '/callid/get', hotel.postGetDnis);
}

module.exports = load;