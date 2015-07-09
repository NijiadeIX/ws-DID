var log       = require('../../core/log.js')('hotel.js');
var settings  = require('./settings.json'); //酒店webservice地址配置
var numDepart = require('../../server/models/numDepart.js');
var http 	  = require('../../core/httpAgent.js');

// function postAccess(req, res) {
// 	var resBody;

// 	var now = new Date();
// 	var hours = now.getHours();
// 	if (hours < 8 || hours > 23) {
// 		resBody = { response_code : 'hotel_customer_rest' };
// 	} else {
// 		resBody = { response_code : 'hotel_success' };
// 	}

// 	res.status(200).json(resBody);
// }

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

function postGetDnis(data, callback) {
	var statusCode;
	var _data;

	if (data.call_in_callee_id === undefined) {
		statusCode = 400;
		_data      = { error_msg : 'parameters error'};

		callback(statusCode, _data);
		return;
	}

	if (data.service_type !== undefined) {	//如果传了service_tyep
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
				results[0].department_id === undefined ||
				results[0].service_type === undefined ||
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
 * 酒店号码转换对外的统一接口
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
// function postGetDnis(req, res) {
// 	var resStatus;
// 	var resBody;

// 	if (!req.body || 
// 		!req.body.call_in_caller_id || 
// 		!req.body.call_in_callee_id || 
// 		!req.body.dtmf ||
// 		!req.body.call_id) {
// 		resStatus = 400;
// 		resBody = { error_msg : 'parameter error' };

// 		res.status(resStatus).json(resBody);
// 		return;
// 	}

// 	numDepart.getNumDepart(req.body.call_in_callee_id, function(data) {
// 		log.trace('num_depart data:' +  data);
// 		if (!data || !data.service_type) {
// 			res.status(200).json({ response_code : 'failure', message : 'callee number does not exist'});
// 			return;
// 		}

// 		switch (data.service_type) {
// 			case 'supplier' :
// 				getCustomerDnis(req, res);
// 				break;
// 			case 'customer' :
// 				getSupplierDnis(req, res);
// 				break;
// 			default : 
// 				res.status(200).json({ response_code : 'failure', message : 'service type error'});
// 		}
// 	});
// }

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
	var resBody = {};
	var postData = {};
	switch(serviceType) {
		case 'supplier':
			url = 'http://' + host + '/call_number/supplier/get_call_number';
			if (data.call_in_caller_id === undefined || 
				data.call_in_callee_id === undefined ||
				data.call_id === undefined) {
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
			if (data.call_in_caller_id === undefined || 
				data.call_in_callee_id === undefined ||
				data.dtmf === undefined ||
				data.call_id === undefined) {
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

	//获取服务号码类型后的回掉函数
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
		if (body.call_out_caller_id !== undefined) {
			_data.call_out_caller_id = body.call_out_callee_id;
		}

		if (body.call_out_callee_id !== undefined) {
			_data.call_out_callee_id = body.call_out_callee_id;
		}
		callback(200, _data);
	};

	http.post(url, 'application/json', JSON.stringify(postData), handleResponse);
}


// /**
//  * 获取供应商的号码
//  * @param  {[type]} req [description]
//  * @param  {[type]} res [description]
//  * @return {[type]}     [description]
//  */
// function getSupplierDnis(req, res) {
// 	var callerNum = req.body.call_in_caller_id;
// 	var calleeNum = req.body.call_in_callee_id;
// 	var data = req.body.dtmf;
// 	var callId = req.body.call_id;

// 	var hostname = settings.host;
// 	var port = settings.port;
// 	var host;
// 	if (port) {
// 		host = hostname + ':' + port;
// 	} else {
// 		host = hostname;
// 	}

// 	var url = 'http://' + host + '/call_number/supplier/get_call_number';
// 	log.trace(url);
// 	var postData = {
// 		call_in_caller_id : callerNum,
// 		call_in_callee_id : calleeNum,
// 		dtmf : data,
// 		call_id : callId
// 	}

// 	var _res = res;
// 	http.post(url, 'application/json', JSON.stringify(postData), function(res) {
// 		var body = null;
// 		if (res.body) {	
// 			try {
// 				body = JSON.parse(res.body);
// 			} catch (err) {
// 				log.error(err.name + ':' + err.message);
// 			}
// 		}

// 		log.trace(body);

// 		if (!body || !body.response_code) {
// 			_res.status(200).json({ response_code : 'failure', message : 'hotel web service error'});
// 			return;
// 		}


// 		_res.status(200).json({ 
// 			response_code : body.response_code, 
// 			call_out_caller_id : body.call_out_caller_id, 
// 			call_out_callee_id : body.call_out_callee_id
// 		});
// 	});

// 	//callback({ response_code : "hotel_success", call_out_caller_id : '20001', call_out_callee_id : '10001', call_id : null });
// }

// /**
//  * 获取客户的号码
//  * @param  {[type]} req [description]
//  * @param  {[type]} res [description]
//  * @return {[type]}     [description]
//  */
// function getCustomerDnis(req, res) {
// 	var callerNum = req.body.call_in_caller_id;
// 	var calleeNum = req.body.call_in_callee_id;
// 	var data = req.body.dtmf;
// 	var callId = req.body.call_id;

// 	var hostname = settings.host;
// 	var port = settings.port;
// 	var host;
// 	if (port) {
// 		host = hostname + ':' + port;
// 	} else {
// 		host = hostname;
// 	}

// 	var url = 'http://' + host + '/call_number/customer/get_call_number';
// 	var postData = {
// 		call_in_caller_id : callerNum,
// 		call_in_callee_id : calleeNum,
// 		dtmf : data,
// 		call_id : callId
// 	}

// 	var _res = res;
// 	http.post(url, 'application/json', JSON.stringify(postData), function(res) {
// 		var body = {};
// 		if (res.body) {	
// 			try {
// 				body = JSON.parse(res.body);
// 			} catch (err) {
// 				log.error(err.name + ':' + err.message);
// 			}
// 		}

// 		log.trace(body);

// 		if (!body || !body.response_code || !body.call_out_caller_id || !body.call_out_callee_id) {
// 			_res.status(200).json({ response_code : 'failure', message : 'hotel web service error'});
// 			return;
// 		}

// 		_res.status(200).json({ 
// 			response_code : body.response_code, 
// 			call_out_caller_id : body.call_out_caller_id, 
// 			call_out_callee_id : body.call_out_callee_id
// 		});
// 	});
// }

module.exports.postAccess = postAccess;
module.exports.postGetDnis = postGetDnis;