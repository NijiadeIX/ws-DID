var log = require('../log/log.js')('dao');
var connection = require('./db.js');
var departments = null;
var numDepart = null;

init();

/**
 * 将departments表存在内存中，方便查询
 * @return {[type]} [description]
 */
function init() {
	//TODO query departments
	connection.query('SELECT department_id, department_name, department_desc FROM departments', function(err, results, fields) {
		if (err) {
			log.error(err.name + ':' + err.message);
			return;
		}

		log.trace(results);	
		departments = results;
	});

	connection.query('SELECT service_number, department_id, service_type FROM num_depart', function(err, results, fields) {
		if (err) {
			log.error(err.name + ':' + err.message);
			return;
		}

		log.trace(results);
		numDepart = results;	
	});
}

/**
 * 手动将departments变量更新到和数据库同步
 * @return {[type]} [description]
 */
function refreshDepartments() {
	connection.query('SELECT department_id, department_name, department_desc FROM departments', function(err, results, fields) {
		if (err) {
			log.error(err.name + ':' + err.message);
			return;
		}

		log.trace(results);
		departments = results;
	});

}

/**
 * 手动将numDepart变量更新到和数据库同步
 * @return {[type]} [description]
 */
function refreshNumDepart() {
	connection.query('SELECT service_number, department_id, service_type FROM num_depart', function(err, results, fields) {
		if (err) {
			log.error(err.name + ':' + err.message);
			return;
		}

		log.trace(results);
		numDepart = results;	
	});	
}

/**
 * [getDepartId description]
 * @param  {string}   calleeNum [description]
 * @return {int} [description]
 */
function getDepartId(calleeNum) {
	log.info('api: getDepartId');

	var _getDepartId = function(element, index, array) {
		return element.service_number == calleeNum;
	};

	var result = numDepart.filter(_getDepartId);
	if (result.length > 0) {
		return result[0].department_id;
	} else {
		return null;
	}
}

/**
 * 根据部门id获取部门名字
 * @param  {int} departId [部门id]
 * @return {string} [description]
 */
function getDepartName(departId) {
	log.info('api: getDepartName');

	var _getDepartName = function(element, index, array) {
		return element.department_id = departId;
	};

	var result = departments.filter(_getDepartName);
	log.trace(result);
	if (result.length > 0) {
		return result[0].department_name;
	} else {
		return null;
	}
}

module.exports.getDepartId = getDepartId;
module.exports.getDepartName = getDepartName;