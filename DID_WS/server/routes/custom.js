var log          = require('../../core/log.js')('route');
var departments  = require('../../core/models/departments.js');
var customRouter = require('../../custom_routes/route.js');


function postCustom(req, res) {
	log.info('POST ' + req.path);

	//check body and departmet id
	if (!req.body || !req.body.department_id) {
		res.status(200).json({ response_code : 'failure', message : 'parameter error'});
		return;
	}

	//get department name
	var departId = req.body.department_id;
	var departName = departments.getDepartName(departId);
	if (!departName || departName == '') {
		res.status(200).json({ response_code : 'failure', message : 'department error'});
		return;
	}

	//call custom route
	var realPath = '/' + departName + req.path;
	log.trace(realPath);
	customRouter.post(realPath, req, res);
}

module.exports.postCustom = postCustom;