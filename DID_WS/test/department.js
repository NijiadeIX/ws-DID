var expect    = require('expect.js');
var httpAgent = require('../core/httpAgent.js');

describe('Department', function() {
	it('/service_number/get_department right', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'{"callee_id" : "10000"}', 
			function(res) {
				try {
					var _body = JSON.parse(res.body);
				} catch(err) {
					throw err;
					done();
				}

				expect(_body.department_id).to.eql(1);
				done();
			});
	});

	it('/service_number/get_department callee_id wrong', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'{"callee_id" : "1000"}', 
			function(res) {
				try {
					var _body = JSON.parse(res.body);
				} catch(err) {
					throw err;
					done();
				}

				expect(_body.response_code).to.eql('failure');
				done();
			});
	});

	it('/service_number/get_department callee_id no body', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'{}', 
			function(res) {
				try {
					var _body = JSON.parse(res.body);
				} catch(err) {
					throw err;
					done();
				}

				expect(_body.response_code).to.eql('failure');
				done();
			});
	});
});