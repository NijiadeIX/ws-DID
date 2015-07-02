var log = require('../../log/log.js')('route');
var numDepartDao = require('../../db/numDepartDao.js');

function postGetdepart(req, res) {
	log.info('POST ' + req.path);
	
	if (!req.body || !req.body.callee_id) {
		res.status(200).json({ resposne_code : 'failure', message : 'parameter error'});
		return;
	}

	var departId = numDepartDao.getNumDepart(req.body.callee_id, function(data) {
		log.trace(data);
		if (!data || !data.department_id || !data.service_type) {
			res.status(200).json({ resposne_code : 'failure'});
			return;
		}

		res.status(200).json(data);
	});

}

module.exports.postGetdepart = postGetdepart;
