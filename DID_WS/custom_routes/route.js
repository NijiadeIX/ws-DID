var log  = require('../core/log.js')('route');
var fs   = require('fs');
var path = require('path');

var router = {
	_table : {},
	post : function(path, req, res) {
		//check if route function exist
		if (!this._table['POST'] || !this._table['POST'][path] || typeof this._table['POST'][path] != 'function') {
			res.status(200).json({ response_code : 'failure', message : '404 not found'});
			return;
		}

		this._table['POST'][path](req, res);
	},

	bindPOST : function(path, func) {
		//if no, than add
		if (!this._table['POST']) {
			this._table['POST'] = {};
		}

		//record the function 
		log.trace(typeof func);
		if (typeof func == 'function') {
			this._table['POST'][path] = func;
			log.info('bind POST:' + path);
		}
	}
}

function _load() {

	var files = fs.readdirSync(__dirname);

	files.forEach(function (file) {
		var pathname = path.join(__dirname, file, 'load.js');
		if (fs.existsSync(pathname)) {
			var load = require(pathname);
			load(router);
		}
	});	
}

_load();

module.exports = router;