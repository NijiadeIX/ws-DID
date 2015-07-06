var mysql    = require('mysql');
var log      = require('./log.js')('db');
var settings = require('../settings/database.json');

//创建数据库连接实例并且连接数据库,保持长连接
var connection = mysql.createConnection(settings);
connection.on('error', function(error) {
	log.error(err.name + ':' + err.message);
	exit();
});

connection.connect();

module.exports = connection;