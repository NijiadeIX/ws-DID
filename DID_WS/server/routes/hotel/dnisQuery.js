var log = require('../../../log/log.js')('route');
var numDepartDao = require('../../../db/numDepartDao.js');
var http = require('../../../httpAgent/httpAgent.js');
var settings = require('./hotel.json');

function getSupplierDnis(req, res) {
	var callerNum = req.body.call_in_caller_id;
	var calleeNum = req.body.call_in_callee_id;
	var data = req.body.dtmf;
	var callId = req.body.call_id;

	var hostname = settings.host;
	var port = settings.port;
	var host;
	if (port) {
		host = hostname + ':' + port;
	} else {
		host = hostname;
	}

	var url = 'http://' + host + '/call_number/supplier/get_call_number';
	log.trace(url);
	var postData = {
		call_in_caller_id : callerNum,
		call_in_callee_id : calleeNum,
		dtmf : data,
		call_id : callId
	}

	var _res = res;
	http.post(url, 'application/json', JSON.stringify(postData), function(res) {
		var body = null;
		if (res.body) {	
			try {
				body = JSON.parse(res.body);
			} catch (err) {
				log.error(err.name + ':' + err.message);
			}
		}

		log.trace(body);

		if (!body || !body.response_code || !body.call_out_caller_id || !body.call_out_callee_id) {
			_res.status(200).json({ response_code : 'failure', message : 'hotel web service error'});
			return;
		}

		_res.status(200).json({ 
			response_code : body.response_code, 
			call_out_caller_id : body.call_out_caller_id, 
			call_out_callee_id : body.call_out_callee_id
		});
	});

	//callback({ response_code : "hotel_success", call_out_caller_id : '20001', call_out_callee_id : '10001', call_id : null });
}

function getCustomerDnis(req, res) {
	var callerNum = req.body.call_in_caller_id;
	var calleeNum = req.body.call_in_callee_id;
	var data = req.body.dtmf;
	var callId = req.body.call_id;

	var hostname = settings.host;
	var port = settings.port;
	var host;
	if (port) {
		host = hostname + ':' + port;
	} else {
		host = hostname;
	}

	var url = 'http://' + host + '/call_number/customer/get_call_number';
	var postData = {
		call_in_caller_id : callerNum,
		call_in_callee_id : calleeNum,
		dtmf : data,
		call_id : callId
	}

	var _res = res;
	http.post(url, 'application/json', JSON.stringify(postData), function(res) {
		var body = {};
		if (res.body) {	
			try {
				body = JSON.parse(res.body);
			} catch (err) {
				log.error(err.name + ':' + err.message);
			}
		}

		log.trace(body);

		if (!body || !body.response_code || !body.call_out_caller_id || !body.call_out_callee_id) {
			_res.status(200).json({ response_code : 'failure', message : 'hotel web service error'});
			return;
		}

		_res.status(200).json({ 
			response_code : body.response_code, 
			call_out_caller_id : body.call_out_caller_id, 
			call_out_callee_id : body.call_out_callee_id
		});
	});
}


function postGetDnis(req, res) {
	if (!req.body || 
		!req.body.call_in_caller_id || 
		!req.body.call_in_callee_id || 
		!req.body.dtmf ||
		!req.body.call_id) {
		res.status(200).json({ response_code : 'failure', message : 'parameter error'});
		return;
	}

	numDepartDao.getNumDepart(req.body.call_in_callee_id, function(data) {
		log.trace('num_depart data:' +  data);
		if (!data || !data.service_type) {
			res.status(200).json({ response_code : 'failure', message : 'callee number does not exist'});
			return;
		}

		switch (data.service_type) {
			case 'supplier' :
				getCustomerDnis(req, res);
				break;
			case 'customer' :
				getSupplierDnis(req, res);
				break;
			default : 
				res.status(200).json({ response_code : 'failure', message : 'service type error'});
		}
	});
}

module.exports.postGetDnis = postGetDnis;