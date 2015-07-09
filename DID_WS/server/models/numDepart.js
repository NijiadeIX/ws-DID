var log = require('../../core/log.js')('numDepart.js');
var db  = require('../../core/database.js');

var numDepart = {
	/**
	 * _query(sql, callback) or _query(sql, values, callback)
	 */
	_query : function(sql, values, callback) {
		db.query(sql, values, function(err, results, fields) {
			callback(err, results);
		});		
	},

	/**
	 * 根据服务号码获取部门id
	 * @param  {string} serviceNum 服务号码
	 * @param {function} callback [description]
	 */
	getDepartmentId : function(serviceNum, callback) {	
		var sql    = 'SELECT department_id FROM num_depart WHERE service_number = ?';
		var values = [serviceNum];
		this._query(sql, values, callback);
	},

	/**
	 * 根据被叫号码获取服务类型
	 * @param  {string}   serviceNum [description]
	 * @param  {Function} callback   [description]
	 */
	getServiceType : function(serviceNum, callback) {
		var sql    = 'SELECT service_type FROM num_depart WHERE service_number = ?';
		var values = [serviceNum];
		this._query(sql, values, callback);	
	},

	/**
	 * 根据服务号码获取映射详情
	 * @param  {string}   serviceNum [description]
	 * @param  {Function} callback   [description]
	 */
	getNumDepart : function(serviceNum, callback) {
		var sql    = 'SELECT service_number, department_id, service_type FROM num_depart WHERE service_number = ?';
		var values = [serviceNum];
		this._query(sql, values, callback);			
	},
	/**
	 * 增加服务号码的映射
	 * @param {string}   serviceId   服务号码
	 * @param {number}   departId    部门id
	 * @param {string}   serviceType 服务号码类型
	 * @param {Function} callback    [description]
	 */
	addNumDepart : function(serviceId, departId, serviceType, callback) {
		//TODO
	},

	/**
	 * 删除服务号码映射
	 * @param  {string} serviceId 服务号码
	 * @param {function} callback [description]
	 */
	delNumDepart : function(serviceId, callback) {
		//TODO
	},

	getAllNumDepart : function(callback) {
		//TODO
	}
};


// module.exports.getNumDepart = getNumDepart;
module.exports = numDepart;