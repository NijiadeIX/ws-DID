var log  = require('../core/log.js')('handlers.js');
var fs   = require('fs');
var path = require('path');

// var handlers = {
// 	_table : {},

// 	/**
// 	 * 处理post请求
// 	 * @param  {string} path 请求路径
// 	 * @param  {object} req  request实例
// 	 * @param  {object} res  response实例
// 	 */
// 	post : function(path, req, res) {
// 		//check if route function exist
// 		if (!this._table['POST'] || !this._table['POST'][path] || typeof this._table['POST'][path] != 'function') {
// 			var resStatus = 400;
// 			var resBody   = { error_msg : '404 not found' };

// 			log.trace(resStatus + ' ' + resBody);
// 			res.status(resStatus).json(resBody);
// 			return;
// 		}

// 		this._table['POST'][path](req, res);
// 	},

// 	/**
// 	 * 注册post请求的处理方法
// 	 * @param  {string} path 请求路径
// 	 * @param  {function} func 回掉函数
// 	 */
// 	bindPOST : function(path, func) {
// 		//if no, than add
// 		if (!this._table['POST']) {
// 			this._table['POST'] = {};
// 		}

// 		//record the function 
// 		log.trace(typeof func);
// 		if (typeof func == 'function') {
// 			this._table['POST'][path] = func;
// 			log.info('bind POST:' + path);
// 		}
// 	},

// 	/**
// 	 * 处理get请求
// 	 * @param  {string} path 请求路径
// 	 * @param  {object} req  request实例
// 	 * @param  {object} res  response实例
// 	 */
// 	get : function(path, req, res) {
// 		//check if route function exist
// 		if (!this._table['GET'] || !this._table['GET'][path] || typeof this._table['GET'][path] != 'function') {
// 			var resStatus = 400;
// 			var resBody   = { error_msg : '404 not found' };

// 			log.trace(resStatus + ' ' + resBody);
// 			res.status(resStatus).json(resBody);
// 			return;
// 		}

// 		this._table['GET'][path](req, res);
// 	},

// 	/**
// 	 * 注册get请求的处理方法
// 	 * @param  {string} path 请求路径
// 	 * @param  {function} func 回掉函数
// 	 */
// 	bindGET : function(path, func) {
// 		//if no, than add
// 		if (!this._table['GET']) {
// 			this._table['GET'] = {};
// 		}

// 		//record the function 
// 		log.trace(typeof func);
// 		if (typeof func == 'function') {
// 			this._table['GET'][path] = func;
// 			log.info('bind GET:' + path);
// 		}
// 	},	


// }

var handlers = {
	_table : {},

	load : function() {
		log.info('load handlers');
		var files = fs.readdirSync(__dirname);

		var self = this;
		files.forEach(function (file) {
			var pathname = path.join(__dirname, file, 'load.js');
			if (fs.existsSync(pathname)) {
				var _load = require(pathname);
				_load(self);
			}
		});			
	},

	reload : function() {
		this._table = {};
		this.load();
	},

	register : function(realm, method, path, func) {
		var _method = method.toUpperCase();

		if (!this._table[realm]) {
			this._table[realm] = {};
		}

		if (!this._table[realm][_method]) {
			this._table[realm][_method] = {};
		}

		var id = realm + '@' + _method + '@' + path;
		log.info('register: ' + id);
		this._table[realm][_method][path] = func;
	},

	handle : function(realm, method, path, data, callback) {
		var table = this._table;
		var _method = method.toUpperCase();
		if (!table[realm] || !table[realm][_method] || !table[realm][_method][path]) {
			var statusCode = 404;
			callback(statusCode, null);
		} else {
			table[realm][_method][path](data, callback);
		}
	}
}

handlers.load();

module.exports = handlers;