var log = require('../../log/log.js')('route');
var departDao = require('../../db/departmentDao.js');
var routeImpl = require('./routeImpl.js');

/**
 * 根据部门id调用对应的路由
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function postAccess(req, res) {
	log.info('POST ' + req.path);
	if (!req.body || !req.body.department_id) {
		res.status(200).json({ response_code : 'failure', message : 'parameter error'});
		return;
	}

	var departId = req.body.department_id;
	var departName = departDao.getDepartName(departId);

	var route = routeImpl.get(departName, 'postAccess');

	if (route) {
		route(req, res);
	} else {
		res.status(200).json({ response_code : 'failure', message : 'server error'});
	}
}

module.exports.postAccess = postAccess;