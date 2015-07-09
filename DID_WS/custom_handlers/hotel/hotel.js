var log       = require('../../core/log.js')('hotel.js');
var settings  = require('./settings.json'); //酒店webservice地址配置
var numDepart = require('../../server/models/numDepart.js');
var http 	  = require('../../core/httpAgent.js');

/**
 * 酒店接入控制的实现, 8点之前，11点之后禁止呼入
 */
function postAccess(data, callback) {
	var statusCode = 200;
	var _data;

	var now = new Date();
	var hours = now.getHours();
	if (hours < 8 || hours > 23) {
		_data = { response_code : 'hotel_customer_rest' };
	} else {
		_data = { response_code : 'hotel_success' };
	}	

	callback(statusCode, _data);
}

/**
 * 酒店获取被叫号码的实现
 */
function postGetDnis(data, callback) {
	var statusCode;
	var _data;

	if (data.call_in_callee_id == undefined) {
		statusCode = 400;
		_data      = { error_msg : 'parameters error'};

		callback(statusCode, _data);
		return;
	}

	if (data.service_type != undefined) {	//如果传了service_tyep
		_getDnis(data.service_type, data, callback);
	} else { 								//如果没传service_type只好自己查咯
		var handleResult = function(err, results) {
			if (err) {
				log.error(err.name + ':' + err.message);

				statusCode = 500;
				_data      = { error_msg : 'db error'};
				callback(statusCode, _data);
				return;
			}

			if (!results || 
				!results[0] ||
				results[0].department_id == undefined ||
				results[0].service_type == undefined ||
				results[0].department_id != data.department_id) {
				statusCode = 404;
				_data      = {};
				callback(statusCode, _data);
				return;
			}

			var serviceType = results[0].service_type;
			_getDnis(serviceType, data, callback);
		};

		numDepart.getNumDepart(data.call_in_callee_id, handleResult);
	}
}

/**
 * 获取被叫号码内部实现
 */
function _getDnis(serviceType, data, callback) {
	//构造http的参数
	var hostname = settings.host;
	var port = settings.port;
	var host;

	if (port) {
		host = hostname + ':' + port;
	} else {
		host = hostname;
	}

	var url;
	var statusCode = 200;
	var resBody    = {};
	var postData   = {};
	switch(serviceType) {
		case 'supplier':
			url = 'http://' + host + '/call_number/supplier/get_call_number';
			if (data.call_in_caller_id == undefined || 
				data.call_in_callee_id == undefined ||
				data.call_id == undefined) {
				statusCode        = 400;
				resBody.error_msg = 'parameters error';
			} else {
				postData.call_in_caller_id = data.call_in_caller_id;
				postData.call_in_callee_id = data.call_in_callee_id;
				postData.call_id           = data.call_id;				
			}

			break;
		case 'customer':
			url = 'http://' + host + '/call_number/customer/get_call_number';
			if (data.call_in_caller_id == undefined || 
				data.call_in_callee_id == undefined ||
				data.dtmf == undefined ||
				data.call_id == undefined) {
				statusCode        = 400;
				resBody.error_msg = 'parameters error';
			} else {
				postData.call_in_caller_id = data.call_in_caller_id;
				postData.call_in_callee_id = data.call_in_callee_id;
				postData.dtmf              = data.dtmf;
				postData.call_id           = data.call_id;				
			}
			break;
		default:
			log.error('serviceType not exist');
			callback(404, { error_msg : 'service_type not exist'});
			return;
	}

	log.trace(url);
	if (statusCode != 200) {
		callback(statusCode, resBody);
		return;
	}

	//调用酒店webservice后的回掉函数
	var handleResponse = function(err, res) {
		if (err) {
			log.error(err.name + ':' + err.message);
			callback(500, { error_msg : 'http agent error'});
			return;
		}

		var body = null;
		log.trace(res.body);
		if (res.body) {	
			try {
				body = JSON.parse(res.body);
			} catch (err) {
				log.error(err.name + ':' + err.message);
			}
		}

		log.trace(body);

		if (!body || !body.response_code) {
			callback(500, { error_msg : 'hotel webservice error'});
			return;
		}

		var _data;
		if (body.response_code == 'hotel_success') {
			_data = {
				response_code : body.response_code,
				call_out_caller_id : body.call_out_caller_id,
				call_out_callee_id : body.call_out_callee_id
			};
		} else {
			_data = { response_code : body.response_code };
		}

		var _data = {};
		_data.response_code = body.response_code;
		if (body.call_out_caller_id != undefined) {
			_data.call_out_caller_id = body.call_out_callee_id;
		}

		if (body.call_out_callee_id != undefined) {
			_data.call_out_callee_id = body.call_out_callee_id;
		}
		callback(200, _data);
	};

	http.post(url, 'application/json', JSON.stringify(postData), handleResponse);
}

module.exports.postAccess = postAccess;
module.exports.postGetDnis = postGetDnis;