var log = require('../../core/log.js')('departments.js');
var db  = require('../../core/database.js');

/**
 * 部门集合
 * @type {Object}
 */
var departments = {
	/**
	 * 根据部门id获取部门信息
	 * @param  {[type]} departId 部门id
	 * @param {function} callback 
	 */
	getDepartmentById : function(departId, callback) {
		var sql    = 'SELECT department_id, department_name, department_desc FROM departments WHERE department_id = ?';
		var values = [departId];
		db.query(sql, values, function(err, results, fields) {
			callback(err, results);
		});
	},

	/**
	 * 根据部门名字获取部门信息
	 * @param  {string}   departName 部门名字
	 * @param  {Function} callback   [description]
	 */
	getDepartmentByName : function(departName, callback) {
		var sql    = 'SELECT department_id, department_name, department_desc FROM departments WHERE department_name = ?';
		var values = [departName];
		db.query(sql, values, function(err, results, fields) {
			callback(err, results);
		});
	},

	/**
	 * 增加新的部门，并写到数据库中
	 * @param {string} departName [description]
	 * @param {string} departDesc [description]
	 */
	addDepartment : function(departName, departDesc, callback) {
		//TODO	
	},

	/**
	 * 获取所有部门信息
	 * @param  {Function} callback [description]
	 */
	getAllDepartments : function(callback) {
		//TODO
	}
};

module.exports = departments;

