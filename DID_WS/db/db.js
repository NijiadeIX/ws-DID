var mysql = require('mysql');
var log = require('../log/log.js')('db');
var settings = require('../settings.json').mysql;

var connection = mysql.createConnection(settings);

/**
 * 执行sql语句的函数
 * @param  {[string]}   queryString [description]
 * @param  {Function} callback    [description]
 */
function query(queryString, callback) {
	connection.connect();
	log.info('execute sql: ' + queryString);
	connection.query(queryString, callback);
	connection.end();
}

module.exports = query;