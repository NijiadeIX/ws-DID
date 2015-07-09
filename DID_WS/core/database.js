var mysql    = require('mysql');
var log      = require('./log.js')('db');
var settings = require('../settings/database.json');

//创建数据库连接实例并且连接数据库,保持长连接

var db = {
	connection : null,
	query : function(sql, values, callback) {
		this.connection.query(sql, values, callback);
	},

	connect : function() {
		if (this.connection) {
			this.connection.destroy();
		}

		this.connection = mysql.createConnection(settings);
		this.connection.connect();
		this.connection.on('error', function(err) {
			log.error(err.name + ':' + err.message);
			log.info('database error, Server shutdown');
			process.exit();
		});
	}
};

module.exports = db;