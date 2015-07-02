var accessQuery = require('./accessQuery.js');
var dnisQuery = require('./dnisQuery.js');
var path = require('path');

function load(routeImpl) {
	var realm = path.basename(__dirname);
	routeImpl.add(realm, 'postAccess', accessQuery.postAccess);
	routeImpl.add(realm, 'postGetDnis', dnisQuery.postGetDnis);
}

module.exports = load;