var log = require('../log/log.js')('dao');
var connection = require('./db.js');

function getNumDepart(serviceNum, callback) {
	log.trace(serviceNum);
	connection.query('SELECT department_id, service_type FROM num_depart WHERE service_number = ?', [serviceNum], function(err, results, fields) {
		if (err) {
			log.error(err.name + ':' + err.message);
			return;
		}

		log.trace('getNumDepart: ' + results);
		callback(results[0]);
	});
} 


module.exports.getNumDepart = getNumDepart;