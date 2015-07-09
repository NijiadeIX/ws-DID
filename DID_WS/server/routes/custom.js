var log         = require('../../core/log.js')('custom.js');
var departments = require('..//models/departments.js');
var handlers    = require('../../custom_handlers/handlers.js');

function postCustom(req, res) {
	log.info('POST ' + req.path);
	log.info(req.body);

	var resStatus;
	var resBody;

	//check body and departmet id
	if (!req.body || req.body.department_id == undefined) {
		resStatus = 400;
		resBody   = { error_msg : 'expected department_id'};

		res.status(resStatus).json(resBody);
		log.info('statusCode ' + resStatus);
		log.info(resBody);
		return;
	}

	var departId   = req.body.department_id;
	var handleResult = function(statusCode, data) {
		res.status(statusCode).json(data);
		log.info('statusCode ' + statusCode);
		log.info(data);
	};

	handlers.handle(departId, 'POST', req.path, req.body, handleResult);
}


module.exports.postCustom = postCustom;