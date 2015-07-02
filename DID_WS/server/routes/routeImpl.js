var log = require('../../log/log.js')('routeImpl');
var fs = require('fs');
var path = require('path');
var routeImpl = {
	_table : {},
	add : function(realm, funcName, func) {
		if (!this._table[realm]) {
			this._table[realm] = {};
		}

		log.info('add routeImpl: ' + realm + '/' + funcName);
		this._table[realm][funcName] = func;
	},

	get : function(realm, funcName) {
		if (this._table[realm] && this._table[realm][funcName]) {
			return this._table[realm][funcName];
		} else {
			return null;
		}
	}
};

function loadRouteImpl() {

	var files = fs.readdirSync(__dirname);

	files.forEach(function (file) {
		var pathname = path.join(__dirname, file, 'load.js');
		if (fs.existsSync(pathname)) {
			var load = require(pathname);
			load(routeImpl);
		}
	});	
}

loadRouteImpl();

module.exports = routeImpl;