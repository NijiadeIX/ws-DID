var log          = require('../../core/log.js')('department.js');
var numDepart = require('../models/numDepart.js');

function postGetdepart(req, res) {
	log.info('POST ' + req.path);
	log.info(req.body);
	var resBody;
	var resStatus;
	
	//检查body里面需要的参数是否齐全
	if (!req.body || req.body.callee_id == undefined) {
		resStatus = 400;
		resBody   = { error_msg : 'parameter error' };

		log.info('statusCode ' + resStatus);
		log.info(resBody);
		res.status(resStatus).json(resBody);
		return;
	} 

	//正常处理流程
	numDepart.getNumDepart(req.body.callee_id, function(err, results) {
		log.trace(results);
		if (!results || 
			!results[0] || 
			results[0].department_id == undefined || 
			results[0].service_type == undefined) {
			resStatus = 404;
			resBody = { error_msg : 'not found'};

			res.status(resStatus).json(resBody);
			log.info('statusCode ' + resStatus);
			log.info(resBody);
			return;
		}

		resStatus = 200;
		resBody   = {
			department_id : results[0].department_id, 
			service_type : results[0].service_type
		};

		res.status(resStatus).json(resBody);
		log.info('statusCode ' + resStatus);
		log.info(resBody);
	});


}

module.exports.postGetdepart = postGetdepart;
