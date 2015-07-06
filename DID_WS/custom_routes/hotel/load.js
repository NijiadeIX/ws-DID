var accessQuery = require('./hotel.js');
var path        = require('path');
var hotel       = require('./hotel.js');

function load(router) {
	router.bindPOST('/hotel/access/get', hotel.postAccess);
	router.bindPOST('/hotel/callid/get', hotel.postGetDnis);
}

module.exports = load;