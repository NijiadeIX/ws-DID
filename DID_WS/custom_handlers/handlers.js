var log  = require('../core/log.js')('handlers.js');
var fs   = require('fs');
var path = require('path');

var handlers = {
	_table : {},

	/**
	 * 加载在custom_handlers下面的所有处理器，加载目标为各目录下的load.js文件
	 */
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

	/**
	 * 重新加载所有的处理器，这样修改接口的时候无需重启服务器，似乎没什么用
	 * @return {[type]} [description]
	 */
	reload : function() {
		this._table = {};
		this.load();
	},

	/**
	 * 注册一个处理器
	 * @param  {number} realm  部门id
	 * @param  {string} method GET或POST，大小写无关
	 * @param  {string} path   路由路径，也是处理器的标识
	 * @param  {function} func   function(data, callback(statusCode, retData))
	 */
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

	/**
	 * 调用一个处理器
	 * @param  {number}   realm    部门id
	 * @param  {string}   method   GET或POST，大小写无关
	 * @param  {string}   path     路由路径，也是处理器的标识
	 * @param  {object}   data     req的body
	 * @param  {Function} callback function(data, callback(statusCode, retData))
	 */
	handle : function(realm, method, path, data, callback) {
		var table = this._table;
		var _method = method.toUpperCase();
		if (!table[realm] || !table[realm][_method] || !table[realm][_method][path]) {
			var statusCode = 404;
			var _data = { error_message : 'not found' };
			callback(statusCode, _data);
		} else {
			table[realm][_method][path](data, callback);
		}
	}
}

handlers.load();

module.exports = handlers;